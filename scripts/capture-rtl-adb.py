#!/usr/bin/env python3
"""Capture InsetsProbe JSON from a Samsung Remote Test Lab device over Remote Debug Bridge.

Start RTL's `rdb` binary, reserve a device, press Connect in the WebClient's
Remote Debug Bridge panel once the device stream is live, and check that
`adb devices` lists localhost:<port>. Then:

    scripts/capture-rtl-adb.py localhost:32754 /tmp/caps/s9fe --tablet --lock

Navigation is selected in Settings > Display > Navigation bar, as a user would;
Samsung keeps the 3-button taskbar size when only the overlay changes. With
--lock each rotation is fixed by `cmd window user-rotation lock`, which Android
16 large screens need because they ignore the probe's orientation requests.
Files land in OUTDIR as rot<N>-<probe file name>; importing into measurements/
is a separate, reviewed step (strip the prefix, keep the JSON unchanged).
"""
import argparse, subprocess, time, json, sys, os, re
from pathlib import Path

PKG = "info.windowinsets.probe"
FILES = f"/sdcard/Android/data/{PKG}/files"
APK = Path(__file__).resolve().parent.parent / "tools/insets-probe/app/build/outputs/apk/release/app-release.apk"
OVL = {"gesture": os.environ.get("GESTURE_OVERLAY", "com.android.internal.systemui.navbar.gestural"),
       "threeButton": "com.android.internal.systemui.navbar.threebutton"}

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("serial"); ap.add_argument("out")
ap.add_argument("--tablet", action="store_true")
ap.add_argument("--modes", default="threeButton,gesture")
ap.add_argument("--screen", default="phone")
ap.add_argument("--apk", type=Path, default=APK)
ap.add_argument("--no-install", action="store_true")
ap.add_argument("--no-switch", action="store_true", help="navigation already set through Settings")
ap.add_argument("--lock", action="store_true", help="rotate with user-rotation lock; Android 16 large screens ignore the probe's sweep")
ap.add_argument("--overlay", action="store_true", help="switch with cmd overlay instead of Settings (wrong taskbar size on Samsung)")
a = ap.parse_args()

def adb(*args, check=True, timeout=120):
    r = subprocess.run(["adb", "-s", a.serial, *args], capture_output=True, text=True, timeout=timeout)
    if check and r.returncode:
        raise SystemExit(f"adb {' '.join(args)} failed: {r.stderr or r.stdout}")
    return r.stdout.strip()

def sh(cmd, **kw): return adb("shell", cmd, **kw)

def log(*m): print(time.strftime("%H:%M:%S"), *m, flush=True)

def nodes():
    sh("uiautomator dump /sdcard/ui.xml", check=False)
    xml = sh("cat /sdcard/ui.xml", check=False)
    return [(t, *map(int, b)) for t, *b in re.findall(r'text="([^"]*)"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', xml)]

def tap_text(pattern, scroll=0):
    for i in range(scroll + 1):
        for t, x1, y1, x2, y2 in nodes():
            if re.search(pattern, t):
                sh(f"input tap {(x1 + x2) // 2} {(y1 + y2) // 2}"); time.sleep(1.5); return t
        # Scroll the rightmost scrollable pane: tablets show Settings in two panes.
        xml = sh("cat /sdcard/ui.xml", check=False)
        panes = [tuple(map(int, b)) for b in re.findall(r'scrollable="true"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', xml)]
        if not panes:
            # A first-run tip (e.g. the taskbar's "Show multiple apps together") owns the window.
            close = re.search(r'content-desc="Close[^"]*"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', xml)
            if not close: break
            x1, y1, x2, y2 = map(int, close.groups())
            sh(f"input tap {(x1 + x2) // 2} {(y1 + y2) // 2}"); time.sleep(1)
            continue
        x1, y1, x2, y2 = max(panes, key=lambda b: (b[0], b[2] - b[0]))
        x, h = (x1 + x2) // 2, y2 - y1
        sh(f"input swipe {x} {y1 + h * 4 // 5} {x} {y1 + h // 5} 300"); time.sleep(1)
    raise SystemExit(f"no node matching {pattern!r}")

def settings_switch(mode):
    # Samsung keeps the taskbar at its 3-button size when only the overlay changes,
    # so select the mode in Settings > Display > Navigation bar like a user would.
    sh("input keyevent KEYCODE_WAKEUP", check=False); sh("wm dismiss-keyguard", check=False)
    sh("am start -W -a android.settings.DISPLAY_SETTINGS"); time.sleep(2)
    tap_text(r"^Navigation bar$", scroll=6)
    tap_text(r"^Swipe gestures$" if mode == "gesture" else r"^Buttons$")
    sh("input keyevent KEYCODE_HOME", check=False)

log("device", sh("getprop ro.product.model"), sh("getprop ro.build.display.id"), sh("wm size"), sh("wm density"))
if not a.no_install:
    log("install", adb("install", "-r", "-g", str(a.apk), timeout=300))
sh("svc power stayon true", check=False)
sh("input keyevent KEYCODE_WAKEUP", check=False)
sh("wm dismiss-keyguard", check=False)
sh("settings put system accelerometer_rotation 0", check=False)
fs = sh("settings get system font_scale", check=False)
if fs not in ("1.0", "1", "null"):
    log("font_scale", fs, "-> 1.0"); sh("settings put system font_scale 1.0", check=False); time.sleep(2)
out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
expected = 4 if a.tablet else 3

for mode in a.modes.split(","):
    sh(f"am force-stop {PKG}")
    sh(f"rm -f {FILES}/*.json", check=False)
    if a.overlay:
        log(mode, "overlay:", sh(f"cmd overlay enable-exclusive --category {OVL[mode]}", check=False))
    elif not a.no_switch:
        settings_switch(mode)
    want = "2" if mode == "gesture" else "0"
    for _ in range(40):
        if sh("settings get secure navigation_mode") == want: break
        time.sleep(0.5)
    nm = sh("settings get secure navigation_mode")
    log(mode, "navigation_mode =", nm, "task_bar_current_size =", sh("settings get global task_bar_current_size"))
    if nm != want:
        log(mode, "navigation mode did not switch; skipping"); continue
    time.sleep(3)
    sh("input keyevent KEYCODE_WAKEUP", check=False)
    sh("wm dismiss-keyguard", check=False)
    if a.lock:
        for rot in ([0, 1, 2, 3] if a.tablet else [0, 1, 3]):
            sh(f"am force-stop {PKG}"); sh(f"rm -f {FILES}/*.json", check=False)
            sh(f"cmd window user-rotation lock {rot}")
            for _ in range(40):
                if f"mRotation={rot}" in sh("dumpsys window displays"): break
                time.sleep(0.5)
            time.sleep(2)
            for attempt in range(3):
                sh(f"am force-stop {PKG}")
                sh(f"am start -W -n {PKG}/.MainActivity --es screen {a.screen} --ez export true")
                got = []
                for _ in range(20):
                    time.sleep(1)
                    got = [n for n in sh(f"ls {FILES}", check=False).split() if n.endswith(".json")]
                    if got: break
                if got: break
            time.sleep(1)
            for n in got:
                adb("pull", f"{FILES}/{n}", str(out / f"rot{rot}-{n}"))
                d = json.loads((out / f"rot{rot}-{n}").read_text())
                log("  ", rot, n, "rot", d["display"].get("rotation"), "nav", d["navigation"]["mode"], "nb", d["insets"]["navigationBars"]["px"])
        sh("cmd window user-rotation free", check=False)
        continue
    extra = " --ez tablet true" if a.tablet else ""
    log(sh(f"am start -W -n {PKG}/.MainActivity --es screen {a.screen} --ez sweep true{extra}"))
    names = []
    for _ in range(120):
        time.sleep(1)
        names = [n for n in sh(f"ls {FILES}", check=False).split() if n.endswith(f"-{mode}.json")]
        if len(names) >= expected: break
    time.sleep(2)
    names = [n for n in sh(f"ls {FILES}", check=False).split() if n.endswith(".json")]
    log(mode, "files:", names)
    for n in names:
        adb("pull", f"{FILES}/{n}", str(out / n))
        d = json.loads((out / n).read_text())
        nv, dp = d["navigation"], d["display"]
        log("  ", n, d["device"]["model"], "rot", dp.get("rotation"), "nav", nv["mode"], nv["settingsSecureNavigationMode"], nv["configNavBarInteractionMode"], "nb", d["insets"]["navigationBars"]["px"])
log("done")
