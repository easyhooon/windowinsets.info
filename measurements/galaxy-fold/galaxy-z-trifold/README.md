# Galaxy Z TriFold capture provenance

## Galaxy Z TriFold — 2026-09-24 and 2026-09-25

Samsung RTL SM-F968N_KR1, Korea/Gumi, Android 16 / One UI 8.5, build
`BP4A.251205.006.F968NKSS6BZG3`. Main 3-button and gesture captures are
2160×1584 px, natural landscape (rotation 0), 320 dpi, Taskbar off. Cover
gesture is 1080×2520 px, portrait, 420 dpi. The 2026-09-24 reservation did not
yield a valid cover 3-button file. A second Korea/Gumi reservation on 2026-09-25
captured the cover in three-button mode at 1080×2520 px, display 0, rotation 0,
420 dpi (default 320 dpi), and fontScale 1. The raw capture is
`cover-threeButton.json`. InsetsProbe and Settings agree on navigation mode;
all four physical-screen/mode combinations are now registered.

During the 2026-09-24 reservation, File Browser delivered only
`main-threeButton.json`. The other two accepted captures were recovered through
WebClient Logs filtered to `InsetsProbe`, then **save logs**. Original downloaded
logs are retained in `rtl-logs/`. JSON message fields were extracted in order,
removing only the tab-separated log metadata; complete objects were parsed
independently (the cover log also contains the prior main gesture capture). No
values were filled from another capture.

After physically switching screens, Probe could retain the previous display's
density until restarted. Both gesture captures were taken after restarting Probe.
Cover reports densityDpi 420 while defaultDensityDpi remains 320. RTL's hinge
sensor reports 0° even unfolded; main exposes one vertical FLAT feature at x=1080.
This API report does not describe the two physical hinges. The initial main
fontScale 1.08 capture is retained separately and not published.
