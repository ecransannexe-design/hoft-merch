---
name: hoft-design
description: Use this skill to generate well-branded interfaces and assets for HOFT Merchandising (a field tool for reps servicing HOFT fence/post/planter displays in RONA and Home Depot stores), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key files:
- `README.md` — brand context, content fundamentals, visual foundations, iconography.
- `colors_and_type.css` — drop-in CSS variables + semantic classes (colors, type, spacing, radii, shadows, motion).
- `assets/` — `hoft-logo.png` (full lockup), `hoft-wordmark.png` (header), `reference-data.md` (real store/SKU/sales figures).
- `ui_kits/merchandiser-app/` — the full click-through app + modular JSX components to reuse.
- `preview/` — design-system specimen cards.

House rules to honor: lowercase folder labels in Queens Compressed italic; Larsseit for all UI/body; terse English UI verbs but verbatim French store/product/money data (fr-CA `19 328,48$`); red = problem, green = win, brown→amber = condition; flat white paper UI, no gradients/textures; the folder-accordion collapse-down is the signature interaction. Always use the logo PNGs — never re-typeset the HOFT wordmark.
