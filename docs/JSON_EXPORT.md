# Per-device JSON export

Every device page exposes an **Export JSON** action. It downloads
`<slug>-window-insets.json` for the whole device—not only the screen or navigation
mode currently selected in the UI.

Each public device also has a shareable URL at
`https://windowinsets.info/data/<slug>.json`. The **JSON** link opens it
directly; copy the link address to share it or fetch it from a script:

```sh
curl https://windowinsets.info/data/galaxy-z-flip8.json
```

For bulk use, `https://windowinsets.info/data/all.json` holds every device export
in one `devices` array (schema `device-bundle-v1`), and
`https://windowinsets.info/data/index.json` lists every device with its
measurement status. The [`windowinsets-info`](../cli/README.md) CLI reads these
files, for example `npx windowinsets-info fixtures --series fold`.

Both actions return the same versioned payload. The link follows the current
published data, so save a copy if a particular measurement revision matters.

The root object identifies the stable public format with:

```json
{
  "schema": "https://windowinsets.info/schemas/device-window-insets-v1.schema.json",
  "schemaVersion": 1
}
```

The referenced JSON Schema is served with the site and can be used by validators
and generated clients.

`device.formFactor` also accepts `foldable-trifold` for Galaxy Z TriFold. Its
`foldAnimation: true` indicates visualization support, not measured hinge geometry
or inset availability. Both artwork-only screens retain explicit pending capture
and navigation-mode values.

Each export contains device metadata, every registered main/cover screen, both
`gesture` and `threeButton` navigation modes, capture conditions and traceable
sources. A mode that has not been captured is emitted as
`{"status":"pending","value":null}`; the exporter never fills it from another
screen, rotates another capture, or estimates a missing value.

Inside a measured mode, `raw` keeps recorded `dp` and exact `px` as separate
values. Missing raw pixels stay `null` and are never reconstructed from rounded
dp. `derived` contains only calculations made from those values, currently safe
area insets (`max(systemBars, displayCutoutInsets)` per edge) and safe area size.
Every derived object includes its method so consumers can distinguish it from
probe evidence.

`specifications` use the neutral `registered` evidence label and carry
screen-level sources. The label means only that the value is present in the
catalog; consumers must inspect those sources instead of assuming it is official
or measured. Zero/unknown legacy placeholders are exported as `null`. Source
entries always expose nullable `url` and `note` fields so downstream consumers do
not need to infer missing provenance fields.

Emulator captures (Google Pixel) use source kind `emulator` and the evidence
label `emulator` instead of `measured`. Their `condition.oneUi` is `null` and
`condition.emulator` names the device profile, skin, system image, build
fingerprint, emulator version and manifest URL; Samsung captures export
`condition.emulator: null`.

Schema additions will remain backward-compatible within version 1. Any breaking
field or meaning change requires a new `schemaVersion`.
