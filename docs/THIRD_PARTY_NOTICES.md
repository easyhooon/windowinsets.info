# Third-party notices

## Android Emulator skins (AOSP)

The Google Pixel device frames under `public/skins/pixel-*/` (`back.webp`,
`mask.webp` and `layout`) are copied unchanged from the Android SDK `skins/`
directory. Their upstream source is the Android Open Source Project:

- Project: `platform/tools/adt/idea`
- Path: `artwork/resources/device-art-resources/<profile>`
- Commit: `ca26f0383e6cca7c3fe55ccbbe5526ba4e24d198`
- Copyright The Android Open Source Project
- Licensed under the Apache License, Version 2.0
  (https://www.apache.org/licenses/LICENSE-2.0)

Each skin directory has a `source.json` with the exact upstream URL, the SDK
folder it was copied from and the import date. The site draws these images at
the rectangles given by their `layout` files; the body clip in
`app/data/aospSkins.ts` is derived from the image alpha channel and is
illustrative. "Google" and "Pixel" are trademarks of Google LLC; their use here
identifies the devices and does not imply endorsement.

## Samsung Galaxy Emulator Skins

Galaxy artwork under `public/skins/` comes from Samsung's
[Galaxy Emulator Skin](https://developer.samsung.com/galaxy-emulator-skin)
downloads; see `public/skins/README.md` for provenance.
