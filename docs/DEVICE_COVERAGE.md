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

Registered on 2026-09-27 (first checkpoint): Pixel 10 Pro Fold, Pixel 9 Pro
Fold, Pixel Fold, Pixel 10 Pro, Pixel 10, Pixel 9 Pro XL, Pixel 9 Pro, Pixel 9,
Pixel 9a and Pixel Tablet. Pending: Pixel 10 Pro XL (incomplete run, recapture
needed), Pixel 8 Pro, 8, 8a, 7 Pro, 7, 7a, 6 Pro, 6, 6a, 5 and 4a.
`scripts/pixel-devices.json` lists every in-scope model with its Google spec
source.
