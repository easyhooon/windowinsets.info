# windowinsets-info

Measured Android `WindowInsets`, display cutouts and safe areas for Samsung Galaxy
and Google Pixel devices, from [windowinsets.info](https://windowinsets.info).

Every value comes from a raw capture on a real device (Samsung Remote Test Lab or
a user device) or, for Pixel, the Android Emulator. Values that were not captured
are reported as "not measured yet" and are never estimated.

## Usage

No install needed (Node.js 18.3 or later):

```bash
npx windowinsets-info get s26-ultra
```

A global install also adds the short `windowinsets` command:

```bash
npm install -g windowinsets-info
```

### Look up a device

```bash
npx windowinsets-info get fold7 --screen cover --nav gesture
npx windowinsets-info get galaxy-s23-plus --unit px
npx windowinsets-info get s26-ultra --json
```

`<device>` is a slug or part of one (`galaxy-s26-ultra`, `s26-ultra`, `fold7`).
`--nav` accepts `gesture` or `3-button`, `--screen` accepts `main` or `cover`, and
`--unit` accepts `dp` (default) or `px`.

### List devices

```bash
npx windowinsets-info list
npx windowinsets-info list --series flip --status complete
```

### Fixtures for tests

`fixtures` prints compact JSON for every measured screen and navigation mode,
ready to load into screenshot or layout tests (Roborazzi, Paparazzi, Compose UI
tests):

```bash
npx windowinsets-info fixtures --series fold --nav gesture > insets.json
npx windowinsets-info fixtures s26-ultra fold7 flip7 --unit px
```

Each entry has the device, screen, navigation mode, unit, density, window size,
orientation, the inset types (`statusBars`, `navigationBars`, `systemBars`,
`displayCutout`, `systemGestures`, `mandatorySystemGestures`,
`tappableElement`) and the derived `safeArea`, plus the Android/One UI version,
evidence kind and source page.

Values describe the screen in its capture orientation. Separately captured
rotations are shown on the device page.

## Data source

The CLI reads the public JSON exports: `/data/index.json`, `/data/<slug>.json`
and `/data/all.json` (schemas under `https://windowinsets.info/schemas/`). Use
`--base-url` or `WINDOWINSETS_BASE_URL` to point it at another copy, including a
local directory.

## License

The CLI code is MIT licensed. Measurement data and Samsung artwork are not part of
this package; see [windowinsets.info](https://windowinsets.info) for their sources.
