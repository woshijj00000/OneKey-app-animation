/**
 * OneKey social animation fixed brand rules.
 *
 * New compositions must import these values instead of recreating the
 * background, UI placement, outro logo, or callout colors locally.
 */
export const ONEKEY_BRAND_RULES = {
  canvas: {
    width: 1080,
    height: 1080,
    fps: 60,
  },
  background: {
    asset: 'source/onekey-gradient-39db00-00c9a5.png',
    topColor: '#39DB00',
    bottomColor: '#00C9A5',
  },
  ui: {
    left: 144,
    top: 160,
    width: 792,
    height: 950,
    borderRadius: 100,
  },
  outroLogo: {
    asset: 'brand/onekey-app-user-fixed.png',
    left: 190,
    top: 465,
    width: 700,
    height: 143,
  },
  callout: {
    backgroundColor: '#031F00',
    textColor: '#DBFFD7',
  },
} as const;
