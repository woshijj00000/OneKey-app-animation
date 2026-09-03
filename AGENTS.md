# OneKey App Animation · Project Instructions

## Mandatory review gate

Every video task must follow `REVIEW_CHECKLIST_ZH.md` before the result is delivered.

1. Run a pre-render review of representative keyframes and every applicable OneKey animation rule.
2. If any checklist item fails, fix it and repeat the pre-render review. Do not proceed with a known failure.
3. Render the complete MP4 only after the pre-render review passes.
4. Review the rendered MP4, its media metadata, audio, pacing, privacy masks, and outro.
5. Deliver the video only when every applicable item is marked `PASS`. Report non-applicable items as `N/A` with a reason.
6. Include a concise review summary with the delivery: composition, output path, resolution, fps, duration, audio status, checklist result, and any `N/A` items.

The review must be based on rendered evidence, not code inspection alone.

## Fixed visual rules

- Import fixed values from `src/config/onekeyBrandRules.ts`; do not redefine them per composition.
- Always use `public/source/onekey-gradient-39db00-00c9a5.png` as the full-canvas background. It is the approved top-to-bottom gradient from `#39DB00` to `#00C9A5`; do not substitute a CSS approximation or another image.
- Center the UI horizontally at `left: 144px`, position its top edge at `160px`, use `width: 792px`, and use a `100px` top corner radius.
- Always use `public/brand/onekey-app-user-fixed.png` for the outro. Its position and size are fixed at `left: 190px`, `top: 465px`, `width: 700px`, `height: 143px`. Only opacity may animate; do not translate or scale the logo.
- Use `#031F00` for every callout background and tail, and `#DBFFD7` for every callout text color. No legacy callout layer, tail, glow, or color may remain underneath.
