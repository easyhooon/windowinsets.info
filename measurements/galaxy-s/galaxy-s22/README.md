# Galaxy S22 measurements

The original `main-*.json` files are immutable InsetsProbe 1.3.0 captures from
Samsung RTL Vietnam/Hanoi Galaxy S22 SM-S901B on 2026-09-25 (Android 15 /
One UI 7.0).

Samsung RTL India/Noida SM-S901E-IN1 was captured on 2026-09-28 (UTC) with
InsetsProbe 1.6.0. `recapture-2026-09-28-rotation/` contains portrait
rotation 0 and landscape rotations 1 and 3 in both navigation modes. All
captures report Android 14 / One UI 6.1.1 build
`UP1A.231005.007.S901EXXSCEYC1`, 480 dpi, font scale 1, 1080×2340 px
full-screen windows and navigation settings matching the Probe
classification. The Android 15 unit SM-S901B-RU7 was tried first but did not
install the probe.

`landscape-1-gesture.json` is an unchanged File Browser download. The File
Browser did not download the other five files, so they were reconstructed from
the unchanged WebClient log exports in `rtl-logs/`. The export
`logs_2026929_11739.txt` stops at its 2,000-line limit during the rotation 3
gesture capture. `logs_2026929_12015.txt` was filtered to 21:39–21:41 device
time and contains the complete gesture sweep. For each capture, the
`InsetsProbe` message column was joined in its original order, removing only
RTL's date/time/PID/TID/priority/tag columns, parsed as JSON and re-serialized
with two-space indentation. The two gesture captures present in both exports
parse identically, and the downloaded rotation 1 gesture file matches its log
copy byte for byte after the same serialization.
