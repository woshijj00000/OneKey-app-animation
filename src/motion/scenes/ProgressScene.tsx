import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppSurface, Header, SceneLabel, StatusBar, colors} from '../ui';

const transfers = [
  ['0x1a2b…3c4D', '0x85e8…34eed3'],
  ['0x5e6f…7g8H', '0x09ac…7f21bf'],
  ['0x8c1a…1b7E', '0xc242…c4a871'],
  ['0x2f91…0dA2', '0x77b1…02eade'],
];

const confetti: Array<[number, number, string]> = [
  [68, 90, '#2F6BFF'],
  [126, 58, '#8E70FF'],
  [490, 82, '#1FC77A'],
  [522, 144, '#F8C64E'],
  [82, 208, '#F56E80'],
  [470, 232, '#2F6BFF'],
  [148, 278, '#1FC77A'],
  [514, 320, '#8E70FF'],
];

export const ProgressScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const completed = Math.min(
    transfers.length,
    Math.max(0, Math.floor(interpolate(frame, [0.55 * fps, 2.1 * fps], [0, transfers.length + 0.99], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }))),
  );

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
        eyebrow="Step 04 · Send"
        title={'Watch every\ntransfer land.'}
        body="Status updates happen row by row, then resolve into one clear completion state."
      />
      <AppSurface
        name="Bulk send progress interface"
        style={{
          position: 'absolute',
          left: 245,
          top: 380,
          translate: interpolate(frame, [0, 0.65 * fps], ['0px 90px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <StatusBar />
        <Header title="Bulk send" subtitle="Many-to-One" />
        <div style={{padding: '20px 28px'}}>
          <div
            style={{
              minHeight: 72,
              borderRadius: 18,
              backgroundColor: colors.yellow,
              border: '1px solid #F5E5A6',
              padding: '14px 17px',
              display: 'flex',
              alignItems: 'center',
              color: '#695F39',
              fontSize: 15,
              lineHeight: 1.35,
            }}
          >
            <span style={{fontSize: 24, marginRight: 12}}>ⓘ</span>
            Please keep the page active while transactions are processing.
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22}}>
            <span style={{fontSize: 19, fontWeight: 750}}>Transfers</span>
            <span style={{fontSize: 15, color: completed === transfers.length ? colors.green : colors.muted}}>
              {completed}/{transfers.length} complete
            </span>
          </div>

          <div style={{marginTop: 8}}>
            {transfers.map(([from, to], index) => {
              const rowStart = 0.45 * fps + index * 18;
              const isDone = completed > index;
              return (
                <div
                  key={to}
                  style={{
                    height: 96,
                    borderBottom: `1px solid ${colors.line}`,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: interpolate(frame, [rowStart, rowStart + 24], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                    translate: interpolate(frame, [rowStart, rowStart + 24], ['34px 0px', '0px 0px'], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    }),
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isDone ? colors.green : '#E6E7EA',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 800,
                      scale: isDone ? 1 : 0.8,
                      boxShadow: isDone ? '0 0 0 8px rgba(31,199,122,0.10)' : 'none',
                    }}
                  >
                    {isDone ? '✓' : ''}
                  </div>
                  <div style={{marginLeft: 14, flex: 1}}>
                    <div style={{fontSize: 16, fontWeight: 700}}>{from}</div>
                    <div style={{fontSize: 14, color: colors.muted, marginTop: 5}}>to {to}</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: 16, fontWeight: 700}}>0.10 ETH</div>
                    <div style={{fontSize: 14, color: colors.muted, marginTop: 5}}>$400</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(12px)',
            opacity: interpolate(frame, [2.35 * fps, 2.7 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: 190,
            minHeight: 310,
            borderRadius: 34,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 34px 90px rgba(45,53,110,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [2.45 * fps, 2.8 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            scale: interpolate(frame, [2.45 * fps, 2.82 * fps, 3.05 * fps], [0.72, 1.06, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            }),
          }}
        >
          <div style={{width: 76, height: 76, borderRadius: '50%', background: '#E7FBF2', color: colors.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 850}}>✓</div>
          <div style={{fontSize: 31, fontWeight: 790, marginTop: 22}}>4 transfers complete</div>
          <div style={{fontSize: 17, color: colors.muted, marginTop: 10}}>0.40 ETH sent successfully</div>
          {confetti.map(([x, y, color], index) => (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: index % 2 === 0 ? 9 : 7,
                height: index % 2 === 0 ? 9 : 16,
                borderRadius: 9,
                backgroundColor: color,
                rotate: `${index % 2 === 0 ? -28 : 35}deg`,
                opacity: interpolate(frame, [2.65 * fps + index * 2, 2.95 * fps + index * 2, 3.35 * fps + index * 2], [0, 1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                translate: interpolate(frame, [2.65 * fps + index * 2, 3.35 * fps + index * 2], ['0px -35px', '0px 42px'], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            />
          ))}
        </div>
      </AppSurface>
    </AbsoluteFill>
  );
};
