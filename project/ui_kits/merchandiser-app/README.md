# HOFT Merchandiser App — UI Kit

A high-fidelity, click-through recreation of the HOFT field merchandiser app, reconstructed from the hand mockup (`assets/reference-mockup.png`) and the real Week 202616 RONA report.

## Run it
Open `index.html`. It renders inside an iPhone bezel on a neutral gray stage.

## Flow
1. **Splash** (#4a4a4a) — pick **WHO?** (rep) and **WHERE?** (store) via bottom-sheet pickers; choosing both auto-enters the app.
2. **App** — the HOFT header, a store strip with **change**, and the **5-folder accordion**:
   - **info** — store name, year-to-date vs last year, **WHY?/CONGRATS!** verdict (auto from the numbers), last visit & notes.
   - **start** — "do not replace any product" arrival photos; six heat-colored condition dots, tap to capture.
   - **check list** — YES toggles (out of stock / POP correct / competitor) + expandable 30-SKU "missing products" picker.
   - **pictures** — after-photo grid, tap **+** to add.
   - **complete** — visit recap + **COMPLETE VISIT** → confirmation.
3. **Accordion motion** — selecting a folder expands it; the others collapse and sink, stepping darker toward the bottom (the signature interaction).

## Files
| File | Role |
|------|------|
| `index.html` | Loads React + Babel + the device frame, mounts the app. |
| `ios-frame.jsx` | iPhone bezel / status bar / home indicator (starter component). |
| `data.jsx` | `window.HOFT_DATA` — reps, stores (real report figures), checklist, 30-SKU pool, `fmtMoney` (fr-CA). |
| `splash.jsx` | `SplashScreen` + `Pill` + `PickerSheet` bottom sheets. |
| `folders.jsx` | `InfoFolder`, `StartFolder`, `ChecklistFolder`, `PicturesFolder`, `CompleteFolder`, `ConditionTile`. |
| `accordion.jsx` | `FolderAccordion` — the expand/collapse stack. |
| `app.jsx` | `HoftApp` shell + state + mount. |
| `assets/` | Local copies of the HOFT logo + wordmark. |

## Notes
- Components share scope via `window.*` (each Babel script is isolated) — see the project README's React notes.
- Money renders fr-CA (`19 328,48$`); interface verbs stay terse English; store/SKU names are verbatim French from the report.
- This is a cosmetic recreation: photo capture, submission, etc. are simulated (no backend, no camera).
