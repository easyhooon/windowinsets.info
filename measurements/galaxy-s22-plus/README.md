# Galaxy S22+ measurements

The original `main-*.json` files are immutable InsetsProbe 1.3.0 captures from
Samsung RTL Vietnam/Hanoi Galaxy S22+ SM-S906B on 2026-09-25 (Android 15 /
One UI 7.0).

Samsung RTL Russia/Moscow SM-S906B-RU1 was captured on 2026-09-28 (UTC) with
InsetsProbe 1.6.0. `recapture-2026-09-28-rotation/` contains portrait
rotation 0 and landscape rotations 1 and 3 in both navigation modes. All
captures report Android 15 / One UI 7.0 build
`AP3A.240905.015.A2.S906BXXUDFYD9`, 450 dpi, font scale 1, 1080×2340 px
full-screen windows and navigation settings matching the Probe
classification.

Five files are unchanged File Browser downloads. The File Browser did not
download `main-threeButton.json`, so that file was reconstructed from the
unchanged WebClient log export `rtl-logs/logs_2026929_04323.txt`: the
`InsetsProbe` message column of the capture logged at
2026-09-28T15:30:06.973880Z was joined in its original order, removing only
RTL's date/time/PID/TID/priority/tag columns, parsed as JSON and re-serialized
with two-space indentation. The same log also contains the other five sweep
captures, and each parses identically to its downloaded file. A later 3-button
sweep logged at 15:43 UTC is kept in the log but not registered.
