# HOFT Merchandising — Design System

A design system for **HOFT Merchandising**, a field tool used by merchandisers (vendors) who visit **RONA** and **Home Depot** stores to service HOFT product displays. The app runs on the web and as a mobile web app on iPhone and Android.

## What is HOFT?
HOFT is a brand of outdoor **fence, post, and planter** hardware — aluminum fence posts, fence boards, gate kits, solar post caps, steel hooks, and black planters (in French: *poteaux*, *clôtures*, *jardinières*). HOFT product is sold through big-box retail partners RONA and Home Depot across Canada (QC, ON, AB, BC, MB, SK provinces seen in the data).

## Who uses the app?
**Merchandisers / field reps** ("vendors") who travel a route of stores. At each store they:
1. Identify themselves (**WHO?**) and pick the store (**WHERE?**).
2. Review the store's performance & known issues (**info**).
3. Take honest "before" arrival photos (**start** — *do not fix anything first; we want the real thing*).
4. Run a **check list** (out of stock? POP displayed correctly? competitor presence? which of 30 SKUs are missing?).
5. Take "after" **pictures**.
6. **complete** the visit.

The five action stages are presented as a stack of **folders**. Selecting one expands it; the others collapse and sink to the bottom of the screen in a drawer-like motion.

## Sources provided
- `uploads/Capture d'écran, le 2026-05-28 à 03.42.16.png` — hand mockup of 7 phone screens (splash → info → check list states). The single source of truth for layout & flow.
- `uploads/logo.png` → `assets/hoft-logo.png` — full lockup "HOFT / merchandising" (561×344, transparent).
- `uploads/petit-logo.png` → `assets/hoft-wordmark.png` — small "HOFT" wordmark for headers (147×53, transparent).
- `uploads/RONA WEEKLY REPORT - 24 avril 2026 copie.xlsx` — real weekly sales report (Week 202616). Sheets: *Tableau de bord* (dashboard), *Résumé par magasin*, *Détail par magasin*, *Résumé par produit*. Drives the realistic store list, SKU names, sales figures, and red-flag / out-of-stock content used throughout the UI kit.

> No codebase or Figma was provided — this system is reconstructed from the mockup + report data. The screenshot is the authority on layout; the report is the authority on copy/data.

---

## CONTENT FUNDAMENTALS

**Language:** Bilingual reality — the **report data is French** (*Ventes cette semaine*, *magasins actifs*, *POTEAU LIGNE KIT*), but the **app chrome is terse English** (*info, start, check list, pictures, complete, WHO?, WHERE?, YES*). Keep this split: interface verbs in English, store/product/sales data verbatim from the French source.

**Voice:** Blunt, imperative, field-friendly. The app talks *to* the rep like a manager leaning over their shoulder. Short commands and direct warnings, not polished marketing prose.
- Honesty demand: *"Photos when you arrived: do not replace any product! (we want the real thing)"*
- Verdicts are one word and loud: **WHY!** (red) when a store is down vs last year, **CONGRATS!** (green) when it's up.
- Questions are blunt yes/no: *"ANY OUT OF STOCK?"*, *"IS THE POP DISPLAYED CORRECTLY?"*, *"COMPETITOR PRESENCE!"*

**Casing:** Folder labels are **lowercase** (*info, start, check list*). Section headers and store names are **UPPERCASE** (*HOME DEPOT - BROSSARD*). Checklist questions are **UPPERCASE**. Verdict buttons are **UPPERCASE**.

**Person:** Second person implied / imperative ("do not replace"). No "I". Occasional first-person-plural for the team's intent ("we want the real thing").

**Numbers & money:** French formatting from the source — comma decimal, space thousands, trailing dollar: `19 328,48$`, `$ 389,808`. Variation arrows: `▼ 5.5 %` (down) / `▲` (up). Counts read plainly: *"30 options"*, *"13 mag. à 0"*.

**Emoji:** The **report** uses section emoji as wayfinding (📊 🏆 🏪 📦 🚨). The **app UI does not** — it stays clean text + color. Use emoji only if recreating report/dashboard surfaces; never in the merchandiser app chrome.

**Vibe:** A clipboard, not a brochure. Fast, unfussy, slightly demanding. Color does the talking (red = problem, green = win, brown→amber = condition).

---

## VISUAL FOUNDATIONS

**Overall feel:** Utilitarian and high-contrast — a paper checklist reimagined as stacked tabbed folders on a phone. Black ink on white paper, with a single gray family for the folder stack and three loud accents.

**Color:**
- Neutrals carry everything: black ink `#141414` on white paper `#ffffff`, dividers `#e3e3e3`.
- The splash screen inverts to **dark charcoal** (`~#333`) with the black logo.
- **Folder gray stack** — the signature device. The active folder is lightest (`#e4e4e4`); collapsed folders step darker as they sink (`#d2d2d2 → #bcbcbc → #a6a6a6 → #8f8f8f`), creating physical depth.
- **Status accents, used sparingly:** alert red `#ED1C24` (WHY / out of stock / red flags), success green `#2FA84F` (CONGRATS / on target), warn amber `#F5A623`.
- **Condition heatmap:** a brown→amber ramp (`#6B3A2A → #F7C915`) for the arrival-condition dots — reads like a fill/health gauge.

**Type:** One workhorse geometric sans (**Larsseit**) does all UI and body — clean weights from Thin to ExtraBold. The lowercase folder labels — the most distinctive type move — are set in **Queens Compressed** (a compressed display italic). A serif italic (**Lora**) echoes the "merchandising" tagline in the logo. Tabular figures for all money/counts.

**Backgrounds:** Flat. Plain white paper in-app; flat charcoal on splash. **No** gradients (except the discrete heatmap dots), **no** photographic backgrounds, **no** textures, **no** patterns. Imagery appears only as user-captured store photos in square tiles.

**Spacing & layout:** Single-column, full-width-minus-margins, built for one thumb. Generous vertical rhythm between folders; content padded `16–24px`. Folders are fixed full-width rounded rectangles. The collapsed stack is pinned to the bottom of the screen.

**Corner radii:** Medium rounding everywhere — folders & content cards `~14px`, the splash WHO?/WHERE? and YES toggles are full **pills** (`999px`). Photo tiles are near-square with small `8px` rounding; condition dots are full circles.

**Cards:** Light, low-elevation. Content sits on subtle `#f4f4f4` fills or plain white with a hairline. Folders get a soft drop shadow plus a 1px inner top highlight to feel tactile/stacked.

**Shadows / elevation:** Soft and shallow. Folders `0 2px 6px rgba(0,0,0,.12)`; popovers/menus deeper `0 8px 28px rgba(0,0,0,.22)`. No hard or neon shadows.

**Buttons:** Pills. Verdict buttons are full-color fills (red/green) with white uppercase text. YES toggles are gray pills. The splash WHO?/WHERE? are light pills on dark.

**Hover / press states:** Touch-first. Press = slight scale-down (`0.97`) + a touch darker fill. Hover (web) = ~6% darker. No glow, no lift on hover.

**Motion:** The hero interaction is the **folder accordion** — selecting a folder expands it while the rest collapse and slide down, using a firm slightly-springy ease (`cubic-bezier(.22,.61,.36,1)`, ~260–420ms). It should feel like pulling one drawer open and letting the others drop shut. Otherwise: simple fades, no bounces elsewhere, no parallax.

**Transparency / blur:** Minimal. Logos are transparent PNGs. No frosted glass / backdrop blur in the core UI.

**Imagery vibe:** Real, unstyled store photos — exactly what the rep sees on arrival ("the real thing"). No filters, no warm/cool grade. Honesty over polish.

---

## ICONOGRAPHY

**Approach:** Extremely sparse. The mockup uses almost **no icons** — meaning is carried by color, the gray folder stack, and bold text. Don't over-iconify; this brand says it in words and color blocks.

- **Logos / wordmark:** The only true brand graphics. `assets/hoft-logo.png` (full lockup) and `assets/hoft-wordmark.png` (header). The "HOFT" wordmark is a bespoke heavy condensed geometric with a peaked/house-roof "H"; always use the PNG, never re-typeset it.
- **Glyphs as icons:** Plain `+` for "add photo" tiles; report uses Unicode arrows `▼ ▲ ▶` for variation/expand. These typographic glyphs are the house "icon set."
- **Emoji:** Only in the **report/dashboard** context (📊 🏆 🏪 📦 🚨 ℹ) as section markers. **Not** in the app chrome.
- **No SVG icon library** is present in the source. If functional UI icons become unavoidable (e.g. camera, chevron, check), substitute **Lucide** (CDN) at a matching ~2px stroke, monochrome `--ink` — and keep them to a minimum. **[SUBSTITUTION — flagged]** Lucide is not part of the original; it's a stand-in only.

---

## FONTS
Brand files are self-hosted from `fonts/` and wired via `@font-face` in `colors_and_type.css`:
- **Body / UI / numerals** → **Larsseit** (Thin · Light · Medium · Bold · ExtraBold + italics). *Note: no upright Regular 400 file was supplied — 400 maps to the Medium file.*
- **Folder labels** → **Queens Compressed** (Medium Italic; trial build — swap for the licensed file before production).
- **HOFT wordmark** → shipped as PNG. Nearest live fallback: Larsseit ExtraBold. *(The real mark is custom; no font matches exactly.)*
- **"merchandising" serif italic** → **Lora** (Google Fonts CDN — not supplied as a file, CDN delivery is fine).

---

## INDEX — what's in this system
- `README.md` — this file.
- `colors_and_type.css` — all color, type, spacing, radius, shadow & motion tokens (CSS vars + semantic classes).
- `SKILL.md` — Agent-Skill manifest for reuse.
- `assets/` — `hoft-logo.png`, `hoft-wordmark.png`, `reference-data.md` (extracted report figures).
- `preview/` — Design System tab cards (colors, type, folder stack, components, logos).
- `ui_kits/merchandiser-app/` — the recreated app: `index.html` (full click-through: splash → WHO/WHERE → 5-folder accordion) plus modular JSX components.

> No slide template was provided, so `slides/` is intentionally omitted.
