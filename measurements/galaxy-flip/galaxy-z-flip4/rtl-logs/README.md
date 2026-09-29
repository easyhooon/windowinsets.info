# RTL log export

`logs_2026-09-25.txt` is the unchanged InsetsProbe-filtered WebClient log export. Its complete JSON objects were extracted from the message column in original order; only RTL date/time/PID/TID/priority/tag columns were removed. Reconstructed documents were parsed as JSON and checked for model, screen, navigation agreement, dimensions, and display ID.

`main-gesture.json` is the directly downloaded `content (38)` file. It has the same `capturedAt` and measurement fields as the first log capture; the log rendering includes one optional zero-valued `displayCutout.waterfallInsets.dp.bottom` field that the direct file omits. The downloaded JSON is preserved unchanged as the accepted raw file.

The two Cover-labelled captures are retained under `../rejected-2026-09-25/`: despite their manual label, both report display 0, an active window of 1080×2640 px, and the unfolded FLAT hinge feature. They are main-screen measurements and do not establish cover insets.
