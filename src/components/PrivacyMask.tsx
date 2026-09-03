import {Interactive} from 'remotion';

export const PRIVACY_MASK_COLOR = '#F1F1F3';
export const PRIVACY_MASK_RADIUS = 10;

export type PrivacyMaskProps = {
  name?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius?: number;
};

export const PrivacyMask: React.FC<PrivacyMaskProps> = ({
  name = 'Privacy mask',
  left,
  top,
  width,
  height,
  borderRadius = PRIVACY_MASK_RADIUS,
}) => (
  <Interactive.Div
    name={name}
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius,
      backgroundColor: PRIVACY_MASK_COLOR,
      zIndex: 100,
      pointerEvents: 'none',
    }}
  />
);
