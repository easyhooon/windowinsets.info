# Samsung RTL credits and reservation budget

**Last live verification:** 2026-09-29 KST

## Published policy

- Samsung's [About Remote Test Lab](https://developer.samsung.com/remotetestlab/doc/about-remote-test-lab)
  says each Samsung Developer user receives **20 credits every day**, one credit
  buys **15 minutes**, and the minimum reservation is **30 minutes / 2 credits**.
- The [Web Client guide](https://developer.samsung.com/remotetestlab/doc/get-started-with-web-client)
  says ending a reservation early returns credits for unused time.
- The 2023 [RTL watch-testing guide](https://developer.samsung.com/sdp/blog/en/2023/11/16/testing-watch-faces-in-remote-test-lab-through-watch-face-studio)
  says the credit control grants **10 credits once per day**, which matches the
  live account.

## Observed behavior

- **Get Free Credits** added 10 credits and then reported
  `Available only 1 time a day`. The UI shows no reset time or timezone, and
  the limit did not reset at Korean midnight (still blocked at 00:20 KST).
- A 30-minute reservation always charges 2 credits when it is booked.
- Ending a session from the WebClient exit dialog with
  **Return this device to get back 1 credit(s)** checked returns one credit.
  The option appears only while at least one whole 15-minute block is unused;
  with 14 minutes or less left, no return is offered.
- The Reservations page offers the same one-credit return: hover the reservation
  card, press its top-right close button, then **Return** in the Notification
  dialog. Use it when the WebClient tab is gone; prefer the WebClient exit dialog
  otherwise.
- The exit can show a `postMessage` error; the refund still applies, so confirm
  it from the device-list header rather than the error.
- A typical measured device therefore costs **1 credit net** (book 2, return 1).

## Budgeting rule

1. Build the APK and capture checklist before spending credits.
2. Read the live header balance; claim the daily grant once if needed. Plan from
   the live balance, not the published 20-credit figure.
3. Book exactly 30 minutes / 2 credits per device. Do not extend a session.
4. Finish and validate the captures first. If the exit dialog then offers the
   one-credit return, check it; never cut a needed capture short for a refund.
5. Stop when the balance is below two credits.

Per-reservation spending is visible in RTL **Usage History**; it is not
recorded in this repository.
