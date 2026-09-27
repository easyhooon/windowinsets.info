#!/usr/bin/env python3
"""Capture InsetsProbe JSON from a running Android emulator (issue #23).

Drives an already booted AVD through every screen x navigation mode x rotation
and pulls the probe's raw exports plus a provenance manifest. Output goes to a
staging directory; importing into measurements/ is a separate, reviewed step.

Build the probe without an upload key first so emulator captures never reach
the real-device capture inbox:

    (cd tools/insets-probe && ./gradlew :app:assembleDebug -PinsetsProbeUploadKey=)
    emulator -avd <avd> -no-window -no-audio -no-snapshot -no-boot-anim &
    scripts/capture-emulator.py --out /tmp/pixel-captures
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import time
from pathlib import Path

SDK = Path(os.environ.get("ANDROID_HOME", Path.home() / "Library/Android/sdk"))
ADB = str(SDK / "platform-tools/adb")
PACKAGE = "info.windowinsets.probe"
EXPORT_DIR = f"/sdcard/Android/data/{PACKAGE}/files"
APK = Path(__file__).resolve().parent.parent / "tools/insets-probe/app/build/outputs/apk/debug/app-debug.apk"
NAV_OVERLAYS = {
    "gesture": "com.android.internal.systemui.navbar.gestural",
    "threeButton": "com.android.internal.systemui.navbar.threebutton",
}


def adb(*args: str, check: bool = True) -> str:
    result = subprocess.run([ADB, *args], capture_output=True, text=True, check=check)
    return result.stdout.strip()


def shell(command: str) -> str:
    return adb("shell", command)


def wait_until(predicate, timeout: float = 20, message: str = "condition") -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        if predicate():
            return
        time.sleep(0.5)
    raise TimeoutError(f"timed out waiting for {message}")


def device_state() -> str:
    match = re.search(r"Committed state: DeviceState\{identifier=\d+, name='(\w+)'", shell("cmd device_state state"))
    return match.group(1) if match else "UNKNOWN"


def set_nav_mode(mode: str) -> None:
    shell(f"am force-stop {PACKAGE}")
    shell(f"cmd overlay enable-exclusive --category {NAV_OVERLAYS[mode]}")
    expected = "2" if mode == "gesture" else "0"
    wait_until(lambda: shell("settings get secure navigation_mode") == expected, message=f"{mode} navigation")
    time.sleep(2)


def set_fold(screen: str) -> None:
    if screen == "phone":
        return
    # A running probe would recreate on the fold change and export under stale state.
    shell(f"am force-stop {PACKAGE}")
    adb("emu", "fold" if screen == "cover" else "unfold")
    expected = "CLOSED" if screen == "cover" else "OPENED"
    wait_until(lambda: device_state() == expected, message=f"device state {expected}")
    shell("input keyevent KEYCODE_WAKEUP")
    shell("wm dismiss-keyguard")
    time.sleep(2)


def exported_rotations() -> dict[str, int]:
    rotations = {}
    for name in shell(f"ls {EXPORT_DIR}").split():
        try:
            rotations[name] = json.loads(shell(f"cat {EXPORT_DIR}/{name}"))["display"]["rotation"]
        except (json.JSONDecodeError, KeyError):
            pass  # still being written
    return rotations


def export(screen: str, rot: int) -> list[str]:
    # Android 16+ ignores app orientation requests on large screens, so rotate the
    # inner display from outside instead of using the in-app sweep. Files are
    # selected by the rotation they record, not by name.
    shell(f"am force-stop {PACKAGE}")
    shell(f"rm -f '{EXPORT_DIR}'/*")
    shell(f"cmd window user-rotation lock {rot}")
    wait_until(lambda: f"mRotation={rot}" in shell("dumpsys window displays"), message=f"rotation {rot}")
    time.sleep(1)
    # The probe exports once and refuses while the display is still changing; relaunch then.
    for attempt in range(3):
        shell(f"am force-stop {PACKAGE}")
        shell(f"am start -W -n {PACKAGE}/.MainActivity --es screen {screen} --ez export true")
        try:
            wait_until(lambda: rot in exported_rotations().values(), timeout=15, message=f"probe export at rotation {rot}")
            break
        except TimeoutError:
            if attempt == 2:
                raise
    time.sleep(1)
    names = [name for name, value in exported_rotations().items() if value == rot]
    shell(f"am force-stop {PACKAGE}")
    return names


def sweep(screen: str) -> list[str]:
    # Phone-sized displays honor app orientation requests, so the probe's own sweep
    # records exactly the rotations the system allows and skips the rest.
    shell(f"am force-stop {PACKAGE}")
    shell(f"rm -f '{EXPORT_DIR}'/*")
    shell("cmd window user-rotation free")
    adb("logcat", "-c")
    shell(f"am start -W -n {PACKAGE}/.MainActivity --es screen {screen} --ez sweep true")
    summary = []
    def done() -> bool:
        summary[:] = [line for line in adb("logcat", "-d", "-s", "InsetsProbe:I").splitlines() if "Sweep saved" in line]
        return bool(summary)
    wait_until(done, timeout=60, message="probe sweep")
    time.sleep(1)
    print(summary[-1].split(": ", 1)[-1])
    shell(f"am force-stop {PACKAGE}")
    return shell(f"ls {EXPORT_DIR}").split()


def emulator_provenance() -> dict:
    avd = adb("emu", "avd", "name").splitlines()[0].strip()
    config = {}
    config_path = Path.home() / f".android/avd/{avd}.avd/config.ini"
    if config_path.exists():
        for line in config_path.read_text().splitlines():
            key, _, value = line.partition("=")
            config[key.strip()] = value.strip()
    version = subprocess.run([str(SDK / "emulator/emulator"), "-version"], capture_output=True, text=True).stdout
    return {
        "source": "android-emulator",
        "avd": avd,
        "hwDevice": config.get("hw.device.name"),
        "skin": config.get("skin.name"),
        "systemImage": config.get("image.sysdir.1"),
        "installedEmulatorVersion": (re.search(r"version ([\d.]+)", version) or [None, None])[1],
        "buildFingerprint": shell("getprop ro.build.fingerprint"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--screens", default="main,cover", help="main,cover for foldables; phone otherwise")
    parser.add_argument("--nav", default="gesture,threeButton")
    parser.add_argument("--rotations", default="0,1,2,3", help="user rotations for screens that ignore app requests")
    parser.add_argument("--sweep-screens", default="cover,phone", help="screens that honor app orientation requests")
    parser.add_argument("--no-install", action="store_true")
    args = parser.parse_args()

    wait_until(lambda: adb("shell", "getprop sys.boot_completed", check=False) == "1", timeout=300, message="boot")
    if not args.no_install:
        adb("install", "-r", str(APK))
    shell(f"rm -rf {EXPORT_DIR}")
    shell(f"mkdir -p {EXPORT_DIR}")
    shell("settings put system screen_off_timeout 2147483647")

    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
    provenance = emulator_provenance()
    target = args.out / provenance["avd"] / stamp
    target.mkdir(parents=True)
    captures = []
    try:
        for nav in args.nav.split(","):
            set_nav_mode(nav)
            for screen in args.screens.split(","):
                set_fold(screen)
                if screen in args.sweep_screens.split(","):
                    runs = [("sweep", lambda: sweep(screen))]
                else:
                    runs = [(rot, lambda rot=rot: export(screen, rot)) for rot in map(int, args.rotations.split(","))]
                for method, run in runs:
                    for name in run():
                        adb("pull", f"{EXPORT_DIR}/{name}", str(target / name))
                        entry = {"file": name, "screen": screen, "navMode": nav}
                        entry.update({"method": "probeSweep"} if method == "sweep" else {"method": "userRotationLock", "userRotation": method})
                        captures.append(entry)
                        print(f"{nav:12} {screen:6} {method}: {name}")
    finally:
        shell("cmd window user-rotation free")
        (target / "manifest.json").write_text(
            json.dumps({"capturedAt": stamp, "provenance": provenance, "captures": captures}, indent=2) + "\n"
        )
    print(f"{len(captures)} captures in {target}")


if __name__ == "__main__":
    main()
