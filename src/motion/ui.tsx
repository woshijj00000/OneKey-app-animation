import type {CSSProperties, ReactNode} from 'react';
import {
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const colors = {
  ink: '#101114',
  muted: '#777983',
  line: '#E9E9EC',
  soft: '#F5F5F7',
  blue: '#2F6BFF',
  green: '#1FC77A',
  yellow: '#FFF8DB',
};

export const AppSurface: React.FC<{
  children: ReactNode;
  name?: string;
  style?: CSSProperties;
}> = ({children, name = 'App interface', style}) => (
  <Interactive.Div
    name={name}
    style={{
      position: 'relative',
      width: 590,
      height: 760,
      overflow: 'hidden',
      borderRadius: 44,
      backgroundColor: '#FFFFFF',
      boxShadow:
        '0 42px 110px rgba(63, 70, 135, 0.17), 0 14px 34px rgba(63, 70, 135, 0.10)',
      border: '1px solid rgba(88, 93, 145, 0.09)',
      ...style,
    }}
  >
    {children}
  </Interactive.Div>
);

export const FigmaScreen: React.FC<{
  src: string;
  name: string;
  opacity?: number;
  scale?: number;
  translate?: string;
}> = ({src, name, opacity = 1, scale = 1, translate = '0px 0px'}) => (
  <CanvasImage
    name={name}
    src={staticFile(src)}
    width={590}
    height={760}
    style={{
      position: 'absolute',
      inset: 0,
      width: 590,
      height: 760,
      opacity,
      scale,
      translate,
    }}
  />
);

export const StatusBar: React.FC = () => (
  <div
    style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      color: colors.ink,
      fontSize: 18,
      fontWeight: 650,
    }}
  >
    <span>9:41</span>
    <span style={{fontSize: 16, letterSpacing: 3}}>▮▮ ◒ ▰</span>
  </div>
);

export const Header: React.FC<{title: string; subtitle?: string}> = ({
  title,
  subtitle,
}) => (
  <div
    style={{
      height: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      borderBottom: `1px solid ${colors.line}`,
    }}
  >
    <div style={{position: 'absolute', left: 28, fontSize: 35, fontWeight: 300}}>‹</div>
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 22, fontWeight: 700, color: colors.ink}}>{title}</div>
      {subtitle ? (
        <div style={{fontSize: 14, color: colors.muted, marginTop: 2}}>{subtitle}</div>
      ) : null}
    </div>
  </div>
);

export const PrimaryButton: React.FC<{
  children: ReactNode;
  active?: boolean;
  style?: CSSProperties;
}> = ({children, active = true, style}) => (
  <div
    style={{
      height: 64,
      borderRadius: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: active ? colors.ink : '#E2E2E5',
      color: active ? '#FFFFFF' : '#9A9BA1',
      fontSize: 20,
      fontWeight: 650,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Cursor: React.FC<{
  x: number;
  y: number;
  clickAt: number;
  fromX?: number;
  fromY?: number;
}> = ({x, y, clickAt, fromX = x - 90, fromY = y + 90}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: interpolate(frame, [0.25 * fps, clickAt], [fromX, x], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        top: interpolate(frame, [0.25 * fps, clickAt], [fromY, y], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        width: 18,
        height: 18,
        marginLeft: -9,
        marginTop: -9,
        borderRadius: '50%',
        backgroundColor: colors.blue,
        boxShadow: `0 0 0 ${interpolate(
          frame,
          [clickAt - 3, clickAt + 9, clickAt + 25],
          [0, 28, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        )}px rgba(47,107,255,0.18), 0 8px 22px rgba(47,107,255,0.35)`,
        opacity: interpolate(frame, [0, 10, clickAt + 36, clickAt + 48], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        scale: interpolate(
          frame,
          [clickAt - 4, clickAt + 5, clickAt + 14],
          [1, 0.58, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          },
        ),
        zIndex: 30,
      }}
    />
  );
};

export const SceneLabel: React.FC<{eyebrow: string; title: string; body: string}> = ({
  eyebrow,
  title,
  body,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{position: 'absolute', left: 90, top: 92, width: 800, zIndex: 20}}>
      <Interactive.Div
        name="Scene eyebrow"
        style={{
          fontSize: 18,
          fontWeight: 750,
          letterSpacing: 2.8,
          textTransform: 'uppercase',
          color: colors.blue,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 0.4 * fps], ['0px 22px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {eyebrow}
      </Interactive.Div>
      <Interactive.Div
        name="Scene headline"
        style={{
          marginTop: 15,
          fontSize: 68,
          lineHeight: 0.98,
          letterSpacing: -3.6,
          fontWeight: 780,
          color: colors.ink,
          whiteSpace: 'pre-line',
          opacity: interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0.1 * fps, 0.6 * fps], ['0px 28px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Scene description"
        style={{
          marginTop: 22,
          maxWidth: 430,
          fontSize: 24,
          lineHeight: 1.35,
          color: colors.muted,
          opacity: interpolate(frame, [0.25 * fps, 0.75 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {body}
      </Interactive.Div>
    </div>
  );
};

export const EthereumIcon: React.FC<{size?: number}> = ({size = 34}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #678BFF, #5B67D7)',
      color: 'white',
      fontSize: size * 0.48,
      fontWeight: 750,
    }}
  >
    ◆
  </div>
);
