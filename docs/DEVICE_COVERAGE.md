# Device coverage

Decision, 2026-09-22, updated 2026-09-24: support officially skinned Samsung
Galaxy models first released in **2020 or later**, plus **all Galaxy Fold and
Flip models regardless of release year**. This replaces the earlier no-cutoff
decision and adds the Fold/Flip exception.
Discontinued and non-flagship models remain eligible. Priority is current
S/Fold/Flip quality → Tab → Note and A. The owner separately approved TriFold
artwork and two-hinge animation on 2026-09-24; all four screen/mode captures are
now verified.

Use the model's first commercial release year, not the skin upload date, ZIP
timestamp, announcement of a refresh, or inferred generation number. A separately
identified refreshed model can have its own release year.

## Boundary audit

The supplied `Galaxy_Z_TriFold.zip` was registered on 2026-09-24 with separate
2160×1584 main and 1080×2520 cover display layouts. Original image, foreground
mask and layout bytes remain in `public/skins/galaxy-z-trifold/`, with provenance.
Samsung's [launch announcement](https://news.samsung.com/global/introducing-galaxy-z-trifold-the-shape-of-whats-next-in-mobile-innovation)
places Korean availability in December 2025, establishing coverage eligibility.
The public form factor is `foldable-trifold`, distinct from a single-hinge book
fold. Korea/Gumi RTL sessions on 2026-09-24 and 2026-09-25 verified main and
cover insets in both navigation modes. The cover 3-button recapture is
1080×2520 px at 420 dpi with fontScale 1.

These are official Samsung sources checked on 2026-09-22 through 2026-09-24. Regional availability
dates below establish the year; they are not necessarily the first worldwide date.

| Imported model | Release evidence | Public coverage |
| --- | --- | --- |
| Galaxy Tab S4 10.5 | [US availability August 10, 2018](https://news.samsung.com/us/samsung-galaxy-tab-s4-helps-get-more-done) | Archive only |
| Galaxy Tab S6 | [Korean release August 29, 2019](https://www.samsung.com/sec/business/insights/news/news-20190830/) | Archive only |
| Galaxy Fold | [Korean release September 6, 2019](https://www.samsungmobilepress.com/articles/samsung-galaxy-fold-now-available) | Included (Fold exception) |
| Galaxy S10 Lite | [UK availability February 7, 2020](https://news.samsung.com/uk/samsung-brings-galaxy-to-more-people-introducing-galaxy-s10-lite-and-note10-lite) | Included |
| Galaxy Tab S6 Lite | [Available April 30, 2020 in the Netherlands](https://news.samsung.com/nl/nieuwe-samsung-galaxy-tab-s6-lite-de-tablet-voor-werk-en-vrije-tijd) | Included |
| Galaxy Tab S8 Ultra | [Global availability February 25, 2022](https://news.samsung.com/global/after-record-breaking-preorders-samsung-announces-global-availability-of-new-galaxy-s22-series-and-galaxy-tab-s8-series) | Included |
| Galaxy Z Flip | [Original model first launched February 2020](https://news.samsung.com/us/galaxy-z-flip-5g-enabled-foldable-smartphone-unpacked/) | Included |
| Galaxy Z Fold3 | [US availability August 26, 2021](https://news.samsung.com/us/galaxy-z-fold3-5g-galaxy-z-flip3-5g-unpacked-2021-next-mobile-innovation/) | Included |
| Galaxy Note FE | [Korean release July 7, 2017](https://news.samsung.com/kr/%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90-%EB%85%B8%ED%8A%B8-%ED%8C%AC%EC%9D%84-%EC%9C%84%ED%95%9C-%ED%8A%B9%EB%B3%84-%ED%95%9C%EC%A0%95%ED%8C%90-%EA%B0%A4%EB%9F%AD%EC%8B%9C-%EB%85%B8%ED%8A%B8-fan-editi) | Archive only |
| Galaxy Note8 | [Available from September 2017](https://news.samsung.com/global/do-bigger-things-with-samsung-galaxy-note8-the-next-level-note) | Archive only |
| Galaxy Note9 | [Global launch August 24, 2018](https://news.samsung.com/global/samsung-electronics-officially-launches-galaxy-note9-in-global-markets) | Archive only |
| Galaxy Note10 / Note10+ | [Global launch August 23, 2019](https://news.samsung.com/global/galaxy-note10-officially-launches-in-markets-around-the-world) | Archive only |
| Galaxy Note10 Lite | [India sale February 3, 2020](https://news.samsung.com/in/building-on-the-note-legacy-samsung-introduces-galaxy-note10-lite-in-india) | Included |
| Galaxy Note20 / Note20 Ultra | [US availability August 21, 2020](https://news.samsung.com/us/galaxy-note20-series-is-available-today-power-your-work-and-play/) | Included |
| Galaxy A01 Core | [Brazil availability August 10, 2020](https://news.samsung.com/br/samsung-apresenta-galaxy-a01-core-ao-brasil) | Included |
| Galaxy A11 / A21s / A31 | [Mexico introduction June 29, 2020](https://news.samsung.com/mx/samsung-presenta-en-mexico-tres-nuevos-smartphones-que-complementan-la-serie-galaxy-a) | Included |
| Galaxy A42 5G | [UK availability November 6, 2020](https://news.samsung.com/uk/samsung-unveils-galaxy-a42-5g-its-most-affordable-5g-smartphone-to-date) | Included |
| Galaxy A71 | [Brazil availability February 17, 2020](https://news.samsung.com/br/com-tres-opcoes-de-cores-samsung-galaxy-a71-ja-esta-a-venda-no-brasil) | Included |

## Release-year metadata audit (2026-09-28)

The public catalogue had 33 entries with a missing year: 31 artwork previews
and two measured foldables. Their years now come from Samsung release evidence,
including the boundary audit above. Artwork and inset measurement status are
unchanged. For the distinct Tab A7 10.4 (2022) skin, Samsung's June 2022 price
list identifies the SM-T503 model; the original Tab A7 was released in 2020.

| Models | Year | Samsung evidence |
| --- | --- | --- |
| Galaxy S20, S20+ | 2020 | [Series availability](https://news.samsung.com/us/introducing-samsung-galaxy-s20-5g-unpacked2020/) |
| Galaxy S26 FE | 2026 | [September availability](https://news.samsung.com/us/samsung-galaxy-s26-fe-delivering-latest-flagship-features-what-matters-most/) |
| Galaxy Z Flip7 FE | 2025 | [July launch and specifications](https://news.samsung.com/global/samsung-galaxy-z-flip7-a-pocket-sized-ai-powerhouse-with-a-new-edge-to-edge-flexwindow) |
| Galaxy Z Fold8 Ultra | 2026 | [August global availability](https://news.samsung.com/global/samsung-officially-launches-galaxy-z-fold8-ultra-fold8-flip8-watch-ultra2-and-watch9) |
| Galaxy Tab A11+ | 2025 | [November availability](https://news.samsung.com/jp/tab-a11-plus) |
| Galaxy Tab A7 10.4 (2022) | 2022 | [SM-T503 in Samsung's June 2022 price list](https://image-us.samsung.com/SamsungUS/samsungbusiness/solutions/industries/government/msrp-price-sheets/Samsung_Galaxy_Tablet_MSRP_Price_File_June_2022.pdf) |
| Galaxy Tab A9 | 2023 | [A9 series launch](https://news.samsung.com/global/samsung-galaxy-tab-a9-and-galaxy-tab-a9-entertainment-and-productivity-engineered-for-everyone) |
| Galaxy Tab Active3, Active4 Pro, Active5, Active5 Pro | 2020, 2022, 2024, 2025 | [Active3](https://news.samsung.com/mx/samsung-presenta-en-mexico-galaxy-tab-active3-una-tableta-disenada-para-entornos-desafiantes), [Active4 Pro](https://news.samsung.com/uk/introducing-the-galaxy-tab-active4-pro-a-rugged-device-designed-for-the-new-mobile-workforce), [Active5](https://news.samsung.com/us/galaxy-tab-active5-delivering-next-level-durability-productivity-security-for-enterprises/), [Active5 Pro](https://news.samsung.com/us/samsung-introduces-galaxy-xcover7-pro-galaxy-tab-active5-pro-ruggedized-devices-frontline-excellence/) |
| Galaxy Tab S7 | 2020 | [September availability](https://news.samsung.com/us/galaxy-tab-s7-s7plus-available-today-first-5g-enabled-tablets-united-states/) |
| Galaxy A02s, A12 | 2020 | [December 2020 retail availability](https://news.samsung.com/vn/samsung-chinh-thuc-ra-mat-galaxy-a12-va-a02s-bo-doi-smartphone-tien-phong-cong-nghe-voi-bo-4-camera-uu-viet-hieu-nang-manh-me-thiet-ke-man-hinh-lon-va-dung-luong-pin-vuot-troi) |
| Galaxy A03s | 2021 | [September launch](https://news.samsung.com/uk/samsung-adds-the-new-galaxy-a03s-to-the-galaxy-a-series) |
| Galaxy A05s | 2023 | [October launch](https://news.samsung.com/in/samsung-unveils-galaxy-a05s-with-stylish-design-snapdragon-processor-and-up-to-12gb-ram) |
| Galaxy A13 5G | 2021 | [December launch](https://news.samsung.com/us/samsung-introduces-galaxy-a13-5g-us/) |
| Galaxy A22, A22 5G | 2021 | [A22 arrival](https://news.samsung.com/br/samsung-apresenta-galaxy-a22-no-brasil), [A22 5G launch](https://news.samsung.com/in/samsung-announces-first-5g-smartphone-in-galaxy-a-series-launches-future-ready-galaxy-a22-5g-in-india) |
| Galaxy A26 5G | 2025 | [April availability](https://news.samsung.com/latin/samsung-lanza-hoy-la-nueva-linea-galaxy-a-en-latinoamerica) |
| Galaxy A52, A72 | 2021 | [March launch and sale](https://news.samsung.com/in/samsung-launches-galaxy-a52-and-galaxy-a72-in-india-makes-exciting-innovations-accessible-to-all) |

The downloaded archive therefore reaches back at least to 2017. This is not a
claim about the oldest model in Samsung's entire skin library. This boundary
audit also does not establish exact release dates for every imported model.

## Implementation and future imports

`app/data/skinCatalog.json` and `public/skins/` retain all 126 imported models.
`app/data/coverage.ts` includes Fold/Flip models at any release year and applies
the 2020 cutoff to other known release years and audited boundary models.
`devices.ts` filters the merged device list, so device
navigation, lookup, prerendered routes and the sitemap share the same policy.
There are 119 public models: 29 S, 29 Tab, 9 Fold, 8 Flip, 1 TriFold, 3 Note and 40 A.

Galaxy Z Flip cover support has a separate generation and skin boundary: Flip,
Flip3 and Flip4 are out of cover-measurement scope. Flip5 and later qualify for
cover collection only when their registered official skin includes a cover
layout. On 2026-09-25, the catalog has cover layouts for Flip7 and Flip8; Flip5
and Flip6 remain main-only until cover artwork is imported. A physical cover
display without a corresponding registered skin does not create a product
measurement target.

## Galaxy Watch limitation

The Samsung Galaxy Emulator Skin downloads checked on 2026-09-25 contain no
Galaxy Watch skin. Galaxy Watch4 and later use Wear OS Powered by Samsung and
can expose Android `WindowInsets`, but the current device model requires gesture
or 3-button measurements and does not model watch-specific round-screen safe
areas. Keep Galaxy Watch outside the public device catalogue until traceable
watch artwork and a dedicated Wear OS capture/data path are available; do not
derive screen geometry or inset values from product images. See Samsung's
[Galaxy Watch platform notice](https://developer.samsung.com/galaxy-watch-tizen/notice.html)
and Android's [Wear OS screen-shape guide](https://developer.android.com/training/wearables/views/layouts).

The user-supplied `Galaxy_S10_Lite.zip` and `Galaxy_Tab_S8_Ultra.zip` were imported
on 2026-09-24 as main-screen artwork previews. Their official release years meet
the coverage cutoff; inset measurements remain pending.

The user-supplied `Galaxy_Z_Fold3.zip` was imported on 2026-09-23 with its
folded cover and unfolded main layouts. InsetsProbe 1.3.0 measurements for
cover and main in both navigation modes were registered on 2026-09-25.
The user-supplied `Galaxy_Z_Flip5.zip` was imported on 2026-09-23 with its
1080×2640 main display layout. The ZIP has no cover layout; both inset modes
were measured on RTL on 2026-09-23; cover artwork remains unavailable.

The user supplied 48 Galaxy Note and A ZIPs on 2026-09-23. Their original
layouts and referenced official artwork were imported as main-screen previews.
Five pre-2020 Note models (FE, 8, 9, 10 and 10+) remain in the asset archive
without public routes. The 2020 Note and earliest A models have release-year
evidence above; the later A models are also kept as artwork-only previews.
The Galaxy A22 5G ZIP's layout names a missing Black background image; the
importer retains that layout unchanged and uses its included Gray image for
the preview, recording the selected asset in `source.json`.

The importer preserves artwork independently of coverage. Before publishing a
new batch, check its release years using official sources; record older/boundary
models in `coverage.ts` and add the evidence here. Unknown-year preview entries
are not automatically rejected, so importing assets alone does not certify their
eligibility.

Artwork-only models continue to show pending measurements. A supported release
year or an official skin does not establish WindowInsets values or measured 3D
geometry. Raw captures and downloaded originals remain unchanged.

## Google Pixel (issue #23)

Pixel coverage starts with the Android Emulator device profiles and AOSP
emulator skins (Apache 2.0) installed with the SDK. Foldables come first, newest
first (Pixel 10 Pro Fold, Pixel 9 Pro Fold, Pixel Fold), then phones and the
Pixel Tablet. Scope: every Pixel released in 2020 or later with an SDK
emulator skin, and every Pixel Fold. Emulator values describe an AVD profile,
not real hardware, and stay labelled as such (source kind `emulator`, export
evidence `emulator`). Skin attribution is in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Registered on 2026-09-27: Pixel 10 Pro Fold, Pixel 9 Pro Fold, Pixel Fold,
Pixel 10 Pro XL, Pixel 10 Pro, Pixel 10, Pixel 9 Pro XL, Pixel 9 Pro, Pixel 9,
Pixel 9a, Pixel 8 Pro, Pixel 8, Pixel 8a, Pixel 7 Pro, Pixel 7, Pixel 7a,
Pixel 6 Pro, Pixel 6, Pixel 6a, Pixel 5, Pixel 4a and Pixel Tablet. No
in-scope models with SDK emulator skins are pending capture.
`scripts/pixel-devices.json` lists every in-scope model with its Google spec
source.

Physical Firebase Test Lab spot checks on 2026-09-28 covered 19 of the 22
public Pixel models, using the existing gesture navigation mode and one
physical screen/orientation per model. Raw captures stay in separate dated
`testlab-2026-09-28/` folders. Camera paths and corner radii match or nearly
match AVD data for most checked phones, but Pixel 10 Pro, Pixel 10 and Pixel
9a have material corner or path differences. Matched landscape captures of
Pixel Fold's inner display and Pixel Tablet report physical rounded corners
where the API 37 AVD reports `null`. Some top safe insets also differ even when
camera paths match. The FTL devices used API 32–36, so keep OS and source
provenance separate rather than changing the published emulator values.
Pixel 6 Pro and Pixel 4a are absent from the FTL physical catalog, and Pixel
5's offered API 30 is below the current probe's minimum API. [Issue #46](https://github.com/easyhooon/windowinsets.info/issues/46)
tracks these three models. The spot checks
do not validate both navigation modes, every rotation, or Fold cover states.
See [the FTL validation log](PIXEL_HARDWARE_VALIDATION.md).
