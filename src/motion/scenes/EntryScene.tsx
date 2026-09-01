import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppSurface, Cursor, FigmaScreen, SceneLabel, colors} from '../ui';

export const EntryScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [0, 0.35 * fps, durationInFrames - 0.45 * fps, durationInFrames],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        ),
      }}
    >
      <SceneLabel
        eyebrow="OneKey · Bulk send"
        title={'One flow.\nMany destinations.'}
        body="Move funds to multiple wallets without repeating the same transaction."
      />

      <AppSurface
        name="Figma app entry"
        style={{
          position: 'absolute',
          left: 245,
          top: 380,
          scale: interpolate(frame, [0, 0.8 * fps], [0.86, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
          translate: interpolate(frame, [0, 0.8 * fps], ['0px 80px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <FigmaScreen
          name="Figma wallet home"
          src="figma/home.png"
          opacity={interpolate(frame, [0, 1.15 * fps, 1.55 * fps], [1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
          scale={interpolate(frame, [0, 1.4 * fps], [1.04, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          })}
        />
        <FigmaScreen
          name="Figma settings screen"
          src="figma/settings.png"
          opacity={interpolate(frame, [1.15 * fps, 1.55 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(12,13,18,0.18)',
            opacity: interpolate(frame, [1.85 * fps, 2.25 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 330,
            borderRadius: '34px 34px 0 0',
            backgroundColor: '#FFFFFF',
            padding: '24px 28px 26px',
            translate: interpolate(frame, [1.9 * fps, 2.65 * fps], ['0px 350px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div style={{width: 50, height: 5, borderRadius: 4, background: '#D9D9DE', margin: '0 auto 22px'}} />
          <div style={{fontSize: 25, fontWeight: 750, color: colors.ink}}>Select bulk send type</div>
          {[
            ['One-to-Many', 'Send one asset to many wallets'],
            ['Many-to-One', 'Consolidate from several addresses'],
            ['Many-to-Many', 'Create a custom distribution'],
          ].map(([title, subtitle], index) => (
            <div
              key={title}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 78,
                borderRadius: 18,
                padding: '0 16px',
                marginTop: index === 0 ? 12 : 2,
                backgroundColor:
                  index === 1
                    ? `rgba(47,107,255,${interpolate(frame, [2.7 * fps, 3.05 * fps], [0, 0.09], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      })})`
                    : 'transparent',
                opacity: interpolate(
                  frame,
                  [2.25 * fps + index * 7, 2.65 * fps + index * 7],
                  [0, 1],
                  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
                ),
                translate: interpolate(
                  frame,
                  [2.25 * fps + index * 7, 2.65 * fps + index * 7],
                  ['30px 0px', '0px 0px'],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: index === 1 ? colors.blue : colors.soft,
                  color: index === 1 ? 'white' : colors.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 750,
                }}
              >
                {index === 0 ? '1→' : index === 1 ? '→1' : '↔'}
              </div>
              <div style={{marginLeft: 14, flex: 1}}>
                <div style={{fontSize: 19, fontWeight: 700, color: colors.ink}}>{title}</div>
                <div style={{fontSize: 14, color: colors.muted, marginTop: 3}}>{subtitle}</div>
              </div>
              <div style={{fontSize: 28, color: '#B0B1B7'}}>›</div>
            </div>
          ))}
        </div>
        <Cursor x={445} y={570} clickAt={3.05 * fps} fromX={520} fromY={690} />
      </AppSurface>
    </AbsoluteFill>
  );
};
