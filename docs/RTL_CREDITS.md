# Samsung RTL credits and reservation budget

**Last live verification:** 2026-09-29 KST

Samsung's published pages and the current RTL account UI do not agree on the
daily grant. Keep the published policy, observed behavior and spending history
separate instead of turning either one into an unsupported universal rule.

## Published policy

- Samsung's current [About Remote Test Lab](https://developer.samsung.com/remotetestlab/doc/about-remote-test-lab)
  says that each Samsung Developer user receives **20 credits every day**, one
  credit buys **15 minutes**, the minimum reservation is **30 minutes / 2
  credits**, and the daily reservation maximum is 10 hours / 40 credits.
- Samsung's [Web Client guide](https://developer.samsung.com/remotetestlab/doc/get-started-with-web-client)
  says that ending a reservation early returns credits in proportion to unused
  time. Therefore reservation rows show booked credits, not necessarily final
  net consumption.
- Samsung's 2023 [RTL watch-testing guide](https://developer.samsung.com/sdp/blog/en/2023/11/16/testing-watch-faces-in-remote-test-lab-through-watch-face-studio)
  instead says that clicking the credit control earns **10 credits once per
  day**. This matches the live observation below.

## Live account observation

At 2026-09-23 01:20 KST the signed-in account showed **0 Credits**. Clicking
**Get Free Credits** once produced `10 Credits have been added.` and changed the
header to **10 Credits**. A second click produced `Available only 1 time a day`
and did not change the balance. The UI did not expose a countdown, reset time or
timezone, so those details remain unknown.

A Galaxy Z Fold7 reservation then ran for the full 30-minute minimum and expired
without extension. The header showed **8 Credits** afterward, directly confirming
the documented two-credit cost for one minimum reservation on this account.

A second 30-minute Fold7 reservation reduced the header from **8 to 6 Credits**.
Ending it early with RTL's checked `Return this device to get back 1 credit(s)`
option raised the balance to **7 Credits**. This is direct evidence that an early
return can refund one whole unused 15-minute block; it does not establish
sub-credit or partial-block behavior.

A subsequent Galaxy Z Flip8 reservation was confirmed at exactly **30 minutes / 2
credits** and produced the verified FlexWindow captures at about 02:40 KST. The
slot expired normally without an early return. Returning to the device list then
showed **5 Credits**, confirming the full two-credit net consumption from the
previously observed 7-credit balance.

A Galaxy Z Fold8 Ultra reservation then reduced the header from **5 to 3
Credits**. InsetsProbe installed successfully, but the device started at its lock
screen and the single calibrated Computer Use swipe did not unlock it. Because the
user was unavailable for the required manual handoff and 25 minutes remained, the
reservation was ended with RTL's checked `Return this device to get back 1
credit(s)` option. The device list then showed **4 Credits**. No measurement from
this blocked reservation was accepted.

On 2026-09-23, a second Galaxy Z Fold6 reservation reduced the live header
from **19 to 17 Credits**. After downloading the remaining attempted capture,
the WebClient still displayed 17 minutes remaining on the 30-minute slot.
Ending it with `Return this device to get back 1 credit(s)` checked raised the
header to **18 Credits** and left no active reservation. This is a second direct
one-credit refund observation, not proof that the threshold is exactly 15
minutes; the checkbox and resulting balance are the evidence.

Two Galaxy Z Fold5 30-minute reservations on 2026-09-23 each ended with the
WebClient's one-credit return option selected after their needed captures were
downloaded. The first raised the observed balance from **14 to 15 Credits**;
the second, used to recapture an upright cover gesture file, reduced the balance
to **13** on booking and raised it to **14 Credits** on return. The final 14-credit
header was verified on the RTL device list. These are optional refunds after
completed work, not a reason to shorten measurement or validation.

A Galaxy Z Fold4 30-minute reservation later reduced the observed balance from
**14 to 12 Credits**. All four accepted captures were downloaded and checked;
the taskbar and rotation recaptures used most of the slot, so no early-return
refund was assumed or claimed. The next booking must read the live header again.

On 2026-09-23, a Galaxy Z Flip7 FE 30-minute reservation reduced the header
from **12 to 10 Credits**. InsetsProbe installation remained at 0% across
retries, including after reconnecting to the same reservation following a device
restart. No capture was made. Ending the reservation with the displayed
`Return this device to get back 1 credit(s)` option checked raised the header
to **11 Credits**, and Reservations showed no active device. A subsequent
Galaxy Z Flip6 30-minute reservation reduced the balance to **9 Credits**.
Both needed Flip6 main-screen captures were downloaded and validated. When the
WebClient showed 14 minutes remaining, its exit dialog offered no credit-return
option. The session was ended and displayed `All ongoing tests have ended.`; no
refund is claimed from this reservation.

A subsequent Galaxy Z Fold3 reservation reduced the header from **9 to 7
Credits**. Probe installation stayed at 0%, so the device was returned with
the one-credit option selected and the header rose to **8 Credits**. Galaxy Z
Flip7 then reduced it from **8 to 6 Credits**. After one supplemental RTL
capture was downloaded and checked, the device was returned with the one-credit
option selected; Reservations showed **7 Credits** and no active test.

A second booking of the same Galaxy Z Flip7 FE unit was ended without a
capture and returned one credit (7 → 5 → 6). Galaxy Z Flip4 SM-F721U-VN1
was then booked, but no valid capture was obtained; its early-return option
restored one credit (6 → 4 → 5). The Galaxy Z Flip5 SM-F731BE-VN3 booking
reduced the balance from **5 to 3 Credits**. Both main-screen modes were
captured and validated. With 10 minutes left, the exit dialog offered no
credit-return checkbox; the session ended without a refund claim.

Galaxy Z Flip3 SM-F711B-VN2 was then booked for 30 minutes, reducing the
visible balance from **3 to 1 Credit**. The main 3-button capture reached the
host. A gesture capture was saved on the device, but subsequent WebClient
downloads and the device-to-host clipboard transfer did not reach the host.
No refund is claimed for this booking.

On 2026-09-24 the live header showed **31 Credits** before this session.
Galaxy Z Fold3 SM-F926U-VN2 was booked for 30 minutes, reducing it to
**29 Credits**. Probe installation remained at 0%; ending the reservation
with the one-credit return option selected restored **30 Credits**.
Galaxy Z Flip3 SM-F711B-VN2 was then booked for 30 minutes. Its fresh main
gesture JSON reached the host and passed validation. Ending it with the
one-credit return option selected left **29 Credits** after a page reload,
and the WebClient reported that all ongoing tests had ended. These are live
balance observations, separate from booked-credit totals.

Galaxy S25 SM-S931N_KR1 (Korea/Gumi, Android 16) was booked for 30 minutes on
2026-09-24 after the live header showed 26 Credits. The booking reduced the
balance to 24. Both main captures were downloaded and validated. The exit dialog
offered no one-credit return option, so no refund is claimed. The live header
showed 24 Credits after the reservation ended.

Galaxy S25 Edge SM-S937N_KR10 was then booked for 30 minutes from a 24-credit
live balance; the header showed 22 Credits. Galaxy S25 FE SM-S731N_KR1 was
booked for 30 minutes from 22 Credits, leaving 20. Both FE captures were
completed while its reservation remained active. Galaxy S24 Ultra SM-S928N-KR3
was then booked for 30 minutes from 20 Credits, leaving 18. Its reservation
showed 28 minutes remaining at the first check. Its accepted main 3-button and
gesture captures are in `measurements/galaxy-s/galaxy-s24-ultra/recapture-2026-09-24/`.

Galaxy S24+ SM-S926N-KR3 and Galaxy S24 SM-S921N-KR3 were each booked for
30 minutes on 2026-09-24 (2 credits apiece). The S24+ reservation produced
accepted main captures in both navigation modes; the gesture capture was
downloaded and validated after a fresh reservation. The S24 reservation also
produced accepted main captures in both navigation modes.

The additional 30-minute S24+ reservation reduced the live header from **10 to
8 Credits** and produced the fresh gesture capture at 2026-09-24T14:26:26Z.
The 8-credit balance was visible after booking; no early-return refund is
claimed.

The preceding 2026-09-22 Usage History contained these booked reservations:

| Time | Device | Booked credits |
| --- | --- | ---: |
| 10:34 | Galaxy S25 Ultra | 2 |
| 11:15 | Galaxy Z Fold8 | 2 |
| 13:20 | Galaxy Z Fold8 | 4 |
| 13:26 | Galaxy Z Flip8 | 4 |
| 20:02 | Galaxy Z Fold8 | 2 |
| 21:20 | Galaxy Z Flip8 | 2 |
| 22:04 | Galaxy Z Flip8 | 2 |
| 22:36 | Galaxy Z Flip8 | 2 |
| **Total** |  | **20** |

This explains the observed progression from four remaining credits to zero:
the final two 30-minute Flip8 reservations booked two credits each. It does not
prove a universal 20-credit grant because the next live grant was only 10.

## Operational budgeting rule

1. Build the APK and capture checklist before spending credits.
2. Read the current header balance. If needed, click **Get Free Credits** once
   and record the exact notification and resulting balance.
3. Treat the live balance as the reservation ceiling. Do not budget against the
   published 20-credit figure when the account received less.
4. Reserve one device for exactly 30 minutes / 2 credits. With a confirmed
   10-credit balance, the no-refund ceiling is five devices; with 20, it is ten.
5. Complete and validate the captures at a sound pace; 15 minutes is not a
   measurement deadline. Only if the work happens to finish while the
   early-return dialog offers one credit back, optionally check it, end the
   slot and verify the balance increase. Never sacrifice a needed capture or
   validation for a refund. Do not extend a session; preserve partial evidence
   and requeue unfinished captures.
6. After closing a session, refresh the header and Usage History. Record booked
   credits separately from any returned unused-time credits.
7. Stop when the current balance is below two credits or the UI reports the
   once-per-day grant has already been claimed.

Until Samsung resolves the documentation mismatch, reports should say both the
published allowance and the amount actually granted to the account on that date.

On 2026-09-24 a Galaxy Z TriFold reservation (SM-F968N_KR1, Korea/Gumi,
Android 16) reduced the confirmed header balance from **12 to 10 Credits**.
The slot was booked for 30 minutes / 2 credits after inspecting Usage History.
The user completed the reservation and installed InsetsProbe while the Chrome
file-chooser preflight remained blocked. No extension or renewal was requested.

On 2026-09-25 the same TriFold model was booked for another 30 minutes / 2
credits to capture the missing cover 3-button mode. The preceding catalog header
showed 8 Credits; a post-booking balance and any refund were not independently
verified.

On 2026-09-25, the live header showed 4 Credits after the Galaxy S24 FE
reservation. Galaxy S23 Ultra (SM-S918B-VN4, Vietnam/Hanoi, Android 16) was
reserved for 30 minutes, reducing the header from **4 to 2 Credits**. Galaxy
S23+ (SM-S916B-VN2, Vietnam/Hanoi, Android 15) was then reserved for 30
minutes, reducing it from **2 to 0 Credits**. Each WebClient immediately showed
`All ongoing tests have ended`; no measurements were captured. The Reservations
page still showed both reservation timers running (23 minutes on S23 Ultra and
30 minutes on S23+) and offered only **Start** in each reservation detail. No
early-return dialog or refund was available or claimed. One **Get Free Credits**
attempt returned `Available only 1 time a day`; the balance remained 0.

On 2026-09-26 the catalog still offered Galaxy S23 Ultra, S23+ and S23 only in
Vietnam/Hanoi. Galaxy S23 was reserved for one retry and its WebClient again
showed `All ongoing tests have ended` immediately; no measurements were
captured. The exact unit identifier, credit change and any refund were not
recorded. Further S23-series bookings are paused until another unit appears.

On 2026-09-27, a 30-minute Galaxy Z Fold8 Ultra reservation (SM-F976U_KR1,
Korea/Gumi, Android 17) produced a complete 12-file rotation sweep. The header
showed 5 Credits after that booking, but the pre-booking header had shown 14 and
was not independently refreshed, so its exact net change is unverified. A
subsequent 30-minute Galaxy Z Fold8 reservation (SM-F971N_KR1, Korea/Gumi,
Android 17) reduced the confirmed header from **5 to 3 Credits**. The
Reservations page kept its Start button disabled, but the existing WebClient
tab switched to Fold8 automatically. InsetsProbe was not installed on that unit;
the browser file chooser did not respond to the automated install control, so
the install step was handed to the user. The installed APK saved nine rotation
files on the device, but none appeared in the Vercel capture inbox and the
reservation expired before a File Browser export. A local inspection found that
APK lacked the configured upload key. No new Fold8 files from this reservation
are accepted, and no refund is assumed.

The Probe APK was rebuilt with the configured upload key and verified locally
without printing the key. A second 30-minute Fold8 reservation on
SM-F971N_KR11 reduced the confirmed header from **3 to 1 Credits**. This leaves
the account below the two-credit minimum for another booking; the user was
notified and offered an account handoff for later devices. With the keyed APK,
the second reservation uploaded all 12 cover/inner, navigation-mode and rotation
combinations to inbox PR #38. The accepted files are recorded in the
measurement queue. The 1-credit balance is the last confirmed header value;
any later refund must be verified separately.

On 2026-09-28, Galaxy S24 Ultra SM-S928N-KR3 was reserved in Korea/Gumi for
30 minutes / 2 credits from a confirmed 24-credit balance. Both rotation sweeps
were uploaded and validated while 24 minutes remained. The WebClient offered
`Return this device to get back 1 credit(s)`; selecting it and ending the test
left 23 Credits in the header and no active reservations.

On 2026-09-28, the Galaxy S24 FE SM-S721N_KR4 Korea/Gumi Android 16
reservation began with a confirmed 23-credit balance. The 30-minute booking
cost two credits; both three-file navigation sweeps uploaded to inbox PR #55.
The early-return dialog offered one credit back, and the refreshed Reservations
page showed 22 Credits and no active reservation. Net cost: one credit.

On 2026-09-28, the Galaxy S24 SM-S921N-KR3 Korea/Gumi Android 16 reservation
began with a confirmed 22-credit balance. The 30-minute booking cost two
credits; both three-file navigation sweeps uploaded to inbox PR #55. The
early-return dialog offered one credit back, and the refreshed Reservations
page showed 21 Credits and no active reservation. Net cost: one credit.

On 2026-09-28, Galaxy S23 Ultra SM-S918B-VN4 Vietnam/Hanoi again opened a
WebClient that immediately reported `All ongoing tests have ended`; it was
returned early and the header recovered from 19 to 20 Credits. Two
Poland/Warsaw reservations and one UK/Staines reservation did not yield a
usable capture session. Samsung processed their returns asynchronously while
the next booking was made, so the individual refund order cannot be
reconstructed from the header. Galaxy S23 Ultra SM-S918U-US01 USA/TX Android
16 then produced both three-file rotation sweeps in inbox PR #55. After its
one-credit early return, Reservations showed 16 Credits and no active devices.
The net cost since the confirmed 21-credit post-S24 balance was five credits
across all S23 Ultra attempts.

Galaxy S23 SM-S911B-IN1 India/Noida Android 15 was then reserved for 30 minutes,
reducing the confirmed header from **16 to 14 Credits**. Both three-file
rotation sweeps uploaded to inbox PR #55. The session ended with eight minutes
remaining and the one-credit return option selected, but the refreshed
Reservations page still showed **14 Credits** and no active devices. No refund
is recorded.

Galaxy S23 FE SM-S711BE-VN3 Vietnam/Hanoi Android 16 was reserved twice for
30 minutes each. The first booking reduced the header from **14 to 12
Credits**. InsetsProbe upload returned `401 Invalid upload key`, so files were
downloaded through the WebClient File Browser; the gesture sweep arrived, but
the session expired before the 3-button natural-rotation file downloaded. The
second booking reduced the header from **12 to 10 Credits** and produced a
complete 3-button sweep. That session was ended with 23 minutes remaining, but
the confirmation closed before the one-credit return option was selected, and
the refreshed header showed **10 Credits**. No refund is recorded. Net cost:
four credits.

Galaxy S22 Ultra SM-S908B-RU1 Russia/Moscow Android 15 was then reserved for
30 minutes, reducing the header from **10 to 8 Credits**. Upload still
returned `401 Invalid upload key` (this machine's build carries an outdated
key), so both three-file sweeps were downloaded through the File Browser. The
session ended with 15 minutes remaining and the one-credit return option
selected; the refreshed Reservations page showed **9 Credits**. Net cost: one
credit.

Galaxy S22+ SM-S906B-RU1 Russia/Moscow Android 15 was then reserved for 30
minutes, reducing the header from **9 to 7 Credits**. Upload still returned
`401 Invalid upload key`, so files were downloaded through the File Browser.
The 3-button natural-rotation file would not download, so it was recovered from
a saved InsetsProbe log export. The session ended with 13 minutes remaining,
below the 15-minute return threshold, so no refund applies. Net cost: two
credits.

Galaxy S22 SM-S901B-RU7 Russia/Moscow Android 15 was then reserved for 30
minutes, reducing the header from **7 to 5 Credits**. The probe APK did not
install on that unit, so the session was ended with 22 minutes remaining and
the one-credit return option selected; the Devices page showed **6 Credits**.
Galaxy S22 SM-S901E-IN1 India/Noida Android 14 was then reserved for 30
minutes (**6 to 4 Credits**). Upload returned `401 Invalid upload key`, and
the File Browser downloaded only one file, so the rest were recovered from
saved InsetsProbe log exports. The session ended with 14 minutes remaining,
below the return threshold. Net cost for Galaxy S22: three credits.

On 2026-09-29, Galaxy Note20 Ultra SM-N985F-RU1 Russia/Moscow Android 13 was
reserved for 30 minutes, reducing the live header from **24 to 22 Credits**.
The 3-button sweep uploaded successfully; a gesture-labelled sweep had a
navigation-setting mismatch and was retained as rejected evidence. With 15
minutes displayed, the exit dialog offered a one-credit return. Selecting it
and ending the session left no ongoing tests, and a refreshed device-list header
showed **23 Credits**. Net cost: one credit.

On 2026-09-29, Galaxy Tab S11 Ultra SM-X930_KR1 Korea/Gumi Android 16 was
reserved for 30 minutes, reducing the confirmed header from **23 to 21
Credits**. Four rotations in each navigation mode uploaded to inbox PR #55.
The session ended with 15 minutes displayed and the one-credit return option
selected. Reservations then showed no active devices and **22 Credits**. Net
cost: one credit.

On 2026-09-30 at about 00:20 KST, the free-credit request returned "Available
only 1 time a day", so the daily limit does not reset at Korean midnight.

Galaxy Tab S10 Ultra SM-X926B-VN2 Vietnam was reserved first because the
location filter had defaulted to Korea and Vietnam (**9 to 7 Credits**). APK
1.6.1 failed to install twice through the file-upload tool, so the unit was
returned with the one-credit option (**8 Credits**). With the filter set to ALL,
SM-X920-IN1 India/Noida was reserved (**8 to 6 Credits**). Installing through a
local server fetch with the `application/vnd.android.package-archive` MIME type
succeeded. The 3-button sweep was exported, then the stream stopped accepting
input. The session ended with 18 minutes remaining and the return option
selected; the exit showed a `postMessage` error, but the device list showed
**7 Credits**. Net cost for the two reservations: two credits.

SM-X920-IN2 India/Noida was then reserved (**7 to 5 Credits**). The 3-button
sweep, including rotation 2, was exported through the File Browser. Settings
input lagged by tens of seconds and then stopped registering on the Navigation
bar page, so the device was returned with 16 minutes displayed and the return
option selected. The device list showed **6 Credits**. Net cost: one credit.

Galaxy Tab S10+ SM-X820-RU1 Russia/Moscow was reserved next (**6 to 4
Credits**). The 3-button sweep was exported, but gesture switching stalled on
delayed input and a brief Chrome extension disconnect; by then only 14 minutes
remained, so the session ended without the return option. Net cost: two
credits.

On 2026-09-30 the maintainer signed in to an account with **37 Credits**.
Galaxy Tab S10 Ultra SM-X920-VN1 Vietnam/Hanoi was reserved (**37 to 35
Credits**) and driven over Remote Debug Bridge (adb). Both navigation modes
were captured in all four rotations. The session ended with 19 minutes
displayed and the return option selected; the exit showed the same
`postMessage` error, and the device list showed **36 Credits**. Net cost: one
credit.

Galaxy Tab S10 FE+ SM-X620_KR3 Korea/Gumi Android 16 was reserved next (**36
to 34 Credits**) and captured over Remote Debug Bridge in both modes and all
four rotations. It was returned with 19 minutes displayed and the return option
selected; the device list showed **35 Credits**. Net cost: one credit.

Galaxy Tab S10 FE SM-X520_KR3 Korea/Gumi Android 16 followed (**35 to 33
Credits**): both modes and four rotations at font scale 1.08 and again at 1. It
was returned with 22 minutes displayed and the return option selected; the
device list showed **34 Credits**. Net cost: one credit.

Galaxy Tab S9 FE+ SM-X616N_KR3 Korea/Gumi Android 16 was reserved next (**34
to 32 Credits**) and captured in both modes and all four rotations. Before the
exit, the browser tab had left the web client, and reopening it returned
`400 Request Header Or Cookie Too Large` while the device list returned 403, so
the return option could not be reached from the browser.
