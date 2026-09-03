# OneKey App Animation

中文复用与交接说明请阅读 [REUSE_GUIDE_ZH.md](./REUSE_GUIDE_ZH.md)。
给 Codex 的标准任务提示词请阅读 [PROMPT_TEMPLATE_ZH.md](./PROMPT_TEMPLATE_ZH.md)。
每个视频交付前必须执行 [REVIEW_CHECKLIST_ZH.md](./REVIEW_CHECKLIST_ZH.md) 的两道 Review Gate；任一适用项目失败时不得交付。

Reusable 1080×1080 / 60fps app interface demo made with Remotion. The default
composition uses the original Figma UI exports as its visual source, without
intro copy, scene labels, or a realistic phone frame.

The UI is horizontally centered at a fixed 160px top offset over the approved
`public/source/onekey-gradient-39db00-00c9a5.png` background. Its top corners
use a fixed 100px radius. Its click cue is
a pale-green outer circle with a green inner circle that appears at the target,
compresses, rebounds, and disappears without rays or expanding rings. Optional
single-line callout bubbles pop in beside selected targets, remain readable,
and disappear before the click. The edit ends on the user-provided OneKey logo
outro. The fixed brand values and asset paths live in
`src/config/onekeyBrandRules.ts` and must be reused by new compositions.

Sensitive UI values can be covered with the reusable
`src/components/PrivacyMask.tsx` layer. It uses a solid `#F1F1F3` rounded
rectangle with no blur, pixelation, border, shadow, or transparency.

## Compositions

- `BulkCopyAddressesSocialSquare` — screenshot-based Bulk Copy Addresses workflow, including full-page scrolling and the reusable OneKey click cue.
- `BulkSendTestSocialSquare` — 12-second social edit built from the complete `bulk send_测试` screenshot sequence, with screenshot-specific scrolling and click timing.
- `BulkSendFigmaUIOnlySquare` — 15-second UI-only version using the original Figma screens.
- `BulkSendMotionSquare` — 18.5-second layered motion-design version retained for comparison.
- `PhoneProductDemoSquare` — original screen-recording template retained for comparison.

## Preview

```bash
npm run dev
```

Open `BulkSendFigmaUIOnlySquare` in Remotion Studio to preview the UI-only edit.
The reusable preset exposes the green click-dot color through
`tapColor`.

## Render

Render the screenshot-based social edit:

```bash
npm run render:test-flow
```

The result is written to `out/bulk-send-test-social.mp4`. Its scene timing,
screen scrolling, click positions, gradient, and logo outro are defined in
`src/test-flow/TestFlowComposition.tsx`.

Render the Bulk Copy Addresses edit:

```bash
npm run render:bulk-copy
```

The result is written to `out/bulk-copy-addresses-social.mp4`.
The latest rendered reference is included at
`examples/bulk-copy-addresses-social.mp4`.

Render the original Figma-based edit:

```bash
npm run render
```

The default result is written to `out/bulk-send-figma-ui-only.mp4`.

To render from the reusable preset:

```bash
npx remotion render BulkSendFigmaUIOnlySquare out/my-demo.mp4 \
  --props=presets/bulk-send-ui-only.json
```

The edit timing, Figma state transitions, in-screen scrolling, camera motion,
and pointer click cues live in `src/motion/UIOnlyComposition.tsx`. Buttons stay
inside the scrolling UI content instead of being fixed overlays.

The alternate rebuilt motion-design version is available with:

```bash
npm run render:motion
```

The legacy recording version is still available:

```bash
npm run render:recording
```
