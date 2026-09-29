#!/usr/bin/env python3
"""Register Pixel emulator captures and AOSP emulator skins on the site (issue #23).

Usage: python3 scripts/import-emulator-captures.py [slug ...]

Reads scripts/pixel-devices.json and, per device with a measurements/pixel/<slug>/emulator-*/
set, copies the AOSP skin into public/skins/<slug>/, regenerates app/data/aospSkins.ts,
writes app/data/devices/<slug>/index.ts from the rotation-0 captures and lists the
modules in app/data/devices/pixel.ts. Raw captures are read, never modified. Screen
rectangles come from the skin layout; body clips are illustrative.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SDK_SKINS = Path.home() / "Library/Android/sdk/skins"
REPO_BLOB = "https://github.com/easyhooon/windowinsets.info/blob/main"
AOSP_COMMIT = "ca26f0383e6cca7c3fe55ccbbe5526ba4e24d198"
AOSP_TREE = ("https://android.googlesource.com/platform/tools/adt/idea/+/"
             f"{AOSP_COMMIT}/artwork/resources/device-art-resources")
RETRIEVED = "2026-09-27"
NAV_MODES = ("gesture", "threeButton")
NAV_LABELS = {"gesture": "gestures", "threeButton": "3-button"}


def skin_folder(profile: str, screen: str) -> tuple[Path, str]:
    base = SDK_SKINS / profile
    if (base / "default").is_dir():
        sub = "closed" if screen == "cover" else "default"
        return base / sub, f"{profile}/{sub}"
    return base, profile


def decode_alpha(path: Path) -> tuple[int, int, bytes]:
    raw = subprocess.run(["dwebp", str(path), "-pam", "-o", "-"], capture_output=True, check=True).stdout
    end = raw.index(b"ENDHDR\n") + 7
    header = raw[:end].decode()
    width = int(re.search(r"WIDTH (\d+)", header)[1])
    height = int(re.search(r"HEIGHT (\d+)", header)[1])
    return width, height, raw[end:]


def body_clip(path: Path, screen: dict) -> tuple[int, int, dict]:
    # Scan through the display centre; the artwork is opaque from the frame inward.
    width, height, pixels = decode_alpha(path)
    opaque = lambda x, y: pixels[(y * width + x) * 4 + 3] > 128
    cx, cy = screen["x"] + screen["width"] // 2, screen["y"] + screen["height"] // 2
    left = next(x for x in range(width) if opaque(x, cy))
    right = next(x for x in reversed(range(width)) if opaque(x, cy))
    top = next(y for y in range(height) if opaque(cx, y))
    bottom = next(y for y in reversed(range(height)) if opaque(cx, y))
    radius = next(x for x in range(left, right) if opaque(x, top)) - left
    return width, height, {"x": left, "y": top, "width": right - left + 1, "height": bottom - top + 1, "radius": radius}


def import_skin(slug: str, profile: str, screen: str) -> dict:
    folder, upstream = skin_folder(profile, screen)
    layout = (folder / "layout").read_text()
    display = re.search(r"display\s*{\s*width\s+(\d+)\s*height\s+(\d+)", layout)
    part = re.search(r"part2\s*{\s*name\s+device\s*x\s+(\d+)\s*y\s+(\d+)", layout)
    rect = {"x": int(part[1]), "y": int(part[2]), "width": int(display[1]), "height": int(display[2])}
    dest = ROOT / "public/skins" / slug / screen
    dest.mkdir(parents=True, exist_ok=True)
    for name in ("back.webp", "mask.webp", "layout"):
        shutil.copyfile(folder / name, dest / name)
    (dest / "source.json").write_text(json.dumps({
        "source": f"{AOSP_TREE}/{upstream}",
        "project": "Android Open Source Project, platform/tools/adt/idea",
        "commit": AOSP_COMMIT,
        "license": "Apache-2.0",
        "copyright": "Copyright The Android Open Source Project",
        "copiedFrom": f"Android SDK skins/{upstream}",
        "background": "back.webp",
        "foreground": "mask.webp",
        "importedAt": RETRIEVED,
    }, indent=2) + "\n")
    width, height, body = body_clip(dest / "back.webp", rect)
    assert rect["x"] + rect["width"] <= width and rect["y"] + rect["height"] <= height, slug
    return {"image": f"/skins/{slug}/{screen}/back.webp", "foreground": f"/skins/{slug}/{screen}/mask.webp",
            "width": width, "height": height, "screen": rect, "body": body}


def capture_set(slug: str) -> Path | None:
    sets = sorted((ROOT / "measurements" / "pixel" / slug).glob("emulator-*/manifest.json"))
    return sets[-1].parent if sets else None


def rotation_zero(folder: Path, screen: str, nav: str) -> tuple[str, dict]:
    manifest = json.loads((folder / "manifest.json").read_text())
    labels = ("phone",) if screen == "main" else ()
    for entry in manifest["captures"]:
        if entry["navMode"] != nav or entry["screen"] not in (screen, *labels):
            continue
        data = json.loads((folder / entry["file"]).read_text())
        if data["display"]["rotation"] == 0:
            return entry["file"], data
    raise SystemExit(f"{folder}: no rotation-0 {screen} capture for {nav}")


def validate(slug: str, screen: str, nav: str, data: dict, spec: dict) -> None:
    display = data["display"]
    assert data["device"]["model"].startswith("sdk_gphone64"), (slug, "not an emulator capture")
    assert data["navigation"]["mode"] == nav and data["navigation"]["settingAgreesWithInsets"], (slug, screen, nav)
    size = [display["widthPx"], display["heightPx"]]
    assert size == spec["resolutionPx"], (slug, screen, nav, size, spec["resolutionPx"])
    features = data.get("hinge", {}).get("foldingFeatures") or []
    if screen == "cover":
        assert not features, (slug, "cover reports a folding feature")


def edges(value: dict) -> dict:
    return {side: value[side] for side in ("top", "right", "bottom", "left")}


def cutout_shape(data: dict) -> dict | None:
    rects = (data["displayCutout"] or {}).get("boundingRects") or []
    if len(rects) != 1:
        return None
    px, dp = rects[0]["px"], rects[0]["dp"]
    display = data["display"]
    return {
        "xDp": dp["left"], "yDp": dp["top"], "widthDp": dp["width"], "heightDp": dp["height"],
        "rightDp": round(display["maximumWindowDp"]["width"] - dp["right"], 2),
        "bottomDp": round(display["maximumWindowDp"]["height"] - dp["bottom"], 2),
        "xPx": px["left"], "yPx": px["top"], "widthPx": px["right"] - px["left"], "heightPx": px["bottom"] - px["top"],
        "rightPx": display["widthPx"] - px["right"], "bottomPx": display["heightPx"] - px["bottom"],
    }


def corners(data: dict, unit: str) -> dict | None:
    # Profiles without rounded_corner_radius report null corners; keep them unmeasured.
    radii = data.get("roundedCorners", {}).get("windowInsets") or {}
    if not all(radii.get(corner) for corner in ("topLeft", "topRight", "bottomRight", "bottomLeft")):
        return None
    return {corner: radii[corner][unit] for corner in ("topLeft", "topRight", "bottomRight", "bottomLeft")}


def condition_note(device: dict, screen: str, data: dict, provenance: dict) -> str:
    display = data["display"]
    state = ""
    if device["formFactor"].startswith("foldable"):
        hinge = data.get("hinge", {})
        state = ("Folded (device state CLOSED); no folding feature. " if screen == "cover" else
                 f"Unfolded (device state OPENED); hinge {hinge.get('angleDegrees')}° with a "
                 f"{hinge['foldingFeatures'][0]['orientation'].lower()} FLAT folding feature. ")
    orientation = display["orientation"]
    note = (f"Android Emulator {provenance['installedEmulatorVersion']} running the {provenance['hwDevice']} "
            f"device profile with its AOSP skin, system image {data['device']['buildId']} (Android "
            f"{data['device']['android']}, API {data['device']['sdkInt']}). {state}{orientation.capitalize()} "
            f"rotation 0, default {display['densityDpi']} dpi and font scale {display['fontScale']:g}. "
            f"InsetsProbe {data['probeVersion']} reported a {display['widthPx']}×{display['heightPx']} px window. "
            "These are the values the framework reports for the emulator profile, not a Pixel hardware "
            "measurement. View rotation does not measure landscape insets.")
    if device.get("emulatorNote"):
        note += " " + device["emulatorNote"]
    return note


def ts(value) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def export_name(slug: str) -> str:
    head, *rest = slug.split("-")
    return head + "".join(part.capitalize() for part in rest)


def device_module(device: dict, spec_source: dict, folder: Path) -> str:
    slug = device["slug"]
    provenance = json.loads((folder / "manifest.json").read_text())["provenance"]
    rel = folder.relative_to(ROOT).as_posix()
    emulator = {
        "deviceProfile": provenance["hwDevice"],
        "skin": provenance["skin"],
        "systemImage": provenance["systemImage"].rstrip("/"),
        "buildFingerprint": provenance["buildFingerprint"],
        "emulatorVersion": provenance["installedEmulatorVersion"],
        "manifestUrl": f"{REPO_BLOB}/{rel}/manifest.json",
    }
    specs = {"kind": "official", **spec_source}
    screens_out, all_sources = [], [specs]
    order = ["cover", "main"] if "cover" in device["screens"] else ["main"]
    for screen in order:
        spec = device["screens"][screen]
        folder_name = skin_folder(device["profile"], screen)[1]
        skin_source = {"kind": "official", "label": f"AOSP Android Emulator skin {folder_name} (Apache 2.0)",
                       "url": f"{AOSP_TREE}/{folder_name}", "retrievedAt": RETRIEVED}
        insets, captures, reference = {}, [], None
        for nav in NAV_MODES:
            file, data = rotation_zero(folder, screen, nav)
            validate(slug, screen, nav, data, spec)
            reference = reference or data
            label = "cover" if screen == "cover" else "inner display" if len(order) == 2 else ""
            source = {"kind": "emulator",
                      "label": f"InsetsProbe {data['probeVersion']} on Android Emulator, {provenance['hwDevice']} profile"
                               f"{', ' + label if label else ''}, {NAV_LABELS[nav]}",
                      "url": f"{REPO_BLOB}/{rel}/{file}", "retrievedAt": RETRIEVED}
            captures.append(source)
            measurement = {
                "systemBars": edges(data["insets"]["systemBars"]["dp"]),
                "systemBarsPx": edges(data["insets"]["systemBars"]["px"]),
                "displayCutout": edges(data["insets"]["displayCutout"]["dp"]),
                "displayCutoutPx": edges(data["insets"]["displayCutout"]["px"]),
            }
            shape = cutout_shape(data)
            if shape:
                measurement["cutoutShape"] = shape
            measurement["condition"] = {"android": data["device"]["android"],
                                        "note": condition_note(device, screen, data, provenance),
                                        "emulator": emulator}
            measurement["sources"] = [source]
            insets[nav] = measurement
        display = reference["display"]
        screens_out.append({
            "id": screen,
            "label": "Cover" if screen == "cover" else "Main",
            "diagonalInch": spec["diagonalInch"],
            "resolutionPx": {"width": spec["resolutionPx"][0], "height": spec["resolutionPx"][1]},
            "logicalSizePx": {"width": display["widthPx"], "height": display["heightPx"]},
            "captureOrientation": display["orientation"],
            "captureRotation": 0,
            "ppi": spec["ppi"],
            "logicalSizeDp": display["maximumWindowDp"],
            "densityDpi": display["densityDpi"],
            "cornerRadiiDp": corners(reference, "radiusDp"),
            "cornerRadiiPx": corners(reference, "radiusPx"),
            "insets": insets,
            "sources": [specs, skin_source, *captures],
        })
        all_sources += [skin_source, *captures]
    body = {
        "slug": slug, "name": device["name"], "brand": "Google", "series": device["series"],
        "formFactor": device["formFactor"],
    }
    if device.get("chassisMm"):
        body["chassisMm"] = {**device["chassisMm"], "source": specs}
    body.update({"releaseYear": device["releaseYear"], "screens": screens_out, "sources": all_sources})
    return ("// Generated by scripts/import-emulator-captures.py from the raw emulator captures.\n"
            "import type { Device } from \"../../types\";\n\n"
            f"export const {export_name(slug)}: Device = {ts(body)};\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slugs", nargs="*")
    args = parser.parse_args()
    config = json.loads((ROOT / "scripts/pixel-devices.json").read_text())
    skins_path = ROOT / "app/data/aospSkins.ts"
    header = ("// Generated by scripts/import-emulator-captures.py. AOSP emulator artwork, Apache 2.0;\n"
              "// provenance per asset in public/skins/<slug>/<screen>/source.json.\n"
              "import type { DeviceSkin } from \"./skins\";\n\n"
              "export const aospSkins: Record<string, DeviceSkin> = ")
    skins = json.loads(skins_path.read_text().split(" = ", 1)[1].strip().removesuffix(";")) if skins_path.exists() else {}
    registered = []
    for device in config["devices"]:
        slug = device["slug"]
        folder = capture_set(slug)
        if folder and (not args.slugs or slug in args.slugs):
            for screen in device["screens"]:
                skins[f"{slug}/{screen}"] = import_skin(slug, device["profile"], screen)
            module = ROOT / "app/data/devices" / slug / "index.ts"
            module.parent.mkdir(parents=True, exist_ok=True)
            module.write_text(device_module(device, config["specSources"][device["spec"]], folder))
            print(f"registered {slug} from {folder.relative_to(ROOT)}")
        if (ROOT / "app/data/devices" / slug / "index.ts").exists():
            registered.append(slug)
    ordered = {key: skins[key] for device in config["devices"] for key in sorted(skins) if key.split("/")[0] == device["slug"]}
    skins_path.write_text(header + ts(ordered) + ";\n")
    imports = "".join(f"import {{ {export_name(slug)} }} from \"./{slug}\";\n" for slug in registered)
    (ROOT / "app/data/devices/pixel.ts").write_text(
        "// Generated by scripts/import-emulator-captures.py; order is the sidebar order.\n"
        f"import type {{ Device }} from \"../types\";\n{imports}\n"
        f"export const pixelDevices: Device[] = [{', '.join(export_name(slug) for slug in registered)}];\n")


if __name__ == "__main__":
    main()
