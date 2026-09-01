import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const OutroScene: React.FC<{durationInFrames: number; title: string}> = ({
  durationInFrames,
  title,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [0, 0.35 * fps, durationInFrames - 0.4 * fps, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <Interactive.Div
        name="OneKey logo mark"
        style={{
          width: 112,
          height: 112,
          borderRadius: 34,
          backgroundColor: '#101114',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 42,
          fontWeight: 820,
          letterSpacing: -3,
          boxShadow: '0 30px 70px rgba(35,39,84,0.19)',
          scale: interpolate(frame, [0, 0.65 * fps], [0.5, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
          rotate: interpolate(frame, [0, 0.65 * fps], ['-9deg', '0deg'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        1K
      </Interactive.Div>
      <Interactive.Div
        name="Outro title"
        style={{
          marginTop: 38,
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: -4,
          color: '#101114',
          opacity: interpolate(frame, [0.35 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: interpolate(frame, [0.35 * fps, 0.9 * fps], ['0px 32px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Outro subtitle"
        style={{
          marginTop: 15,
          fontSize: 27,
          color: '#777983',
          opacity: interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Many transfers. One simple flow.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
