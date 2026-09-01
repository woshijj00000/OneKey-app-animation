import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppSurface, Cursor, EthereumIcon, Header, PrimaryButton, SceneLabel, StatusBar, colors} from '../ui';

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export const AmountScene: React.FC<{
  durationInFrames: number;
  amountPerAddress: number;
  recipientCount: number;
}> = ({durationInFrames, amountPerAddress, recipientCount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const animatedAmount = interpolate(frame, [0.65 * fps, 1.55 * fps], [0, amountPerAddress], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

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
        eyebrow="Step 02 · Amount"
        title={'Set once.\nApply to all.'}
        body="The amount field, totals and action state update independently."
      />
      <AppSurface
        name="Amount entry interface"
        style={{
          position: 'absolute',
          left: 245,
          top: 380,
          translate: interpolate(frame, [0, 0.6 * fps], ['0px 90px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <StatusBar />
        <Header title="Set amount" subtitle="Per receiving address" />
        <div style={{padding: '24px 28px'}}>
          <div style={{fontSize: 15, color: colors.muted}}>Amount per address</div>
          <div
            style={{
              height: 126,
              borderRadius: 22,
              border: `2px solid ${frame > 0.4 * fps ? colors.blue : colors.line}`,
              marginTop: 10,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
            }}
          >
            <EthereumIcon size={52} />
            <div style={{marginLeft: 16, flex: 1}}>
              <div style={{fontSize: 38, fontWeight: 760, letterSpacing: -1.5}}>
                {animatedAmount.toFixed(2)} ETH
              </div>
              <div style={{fontSize: 16, color: colors.muted, marginTop: 6}}>
                ${(animatedAmount * 4000).toFixed(0)} per wallet
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: 12, marginTop: 18}}>
            <div style={{flex: 1, background: colors.soft, borderRadius: 18, padding: '17px 18px'}}>
              <div style={{fontSize: 14, color: colors.muted}}>Recipients</div>
              <div style={{fontSize: 24, fontWeight: 750, marginTop: 4}}>{recipientCount}</div>
            </div>
            <div style={{flex: 1.55, background: colors.soft, borderRadius: 18, padding: '17px 18px'}}>
              <div style={{fontSize: 14, color: colors.muted}}>Total amount</div>
              <div style={{fontSize: 24, fontWeight: 750, marginTop: 4}}>
                {(animatedAmount * recipientCount).toFixed(2)} ETH
              </div>
            </div>
          </div>

          <PrimaryButton
            active={frame >= 1.35 * fps}
            style={{marginTop: 18}}
          >
            Next
          </PrimaryButton>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 258,
            backgroundColor: '#D5D7DB',
            padding: '8px 12px 18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            translate: interpolate(frame, [0.25 * fps, 0.85 * fps], ['0px 270px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {keypad.map((key, index) => (
            <div
              key={key}
              style={{
                background: index === 11 ? 'transparent' : '#FFFFFF',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 25,
                fontWeight: 520,
                boxShadow: index === 11 ? 'none' : '0 2px 0 rgba(0,0,0,0.14)',
                scale: interpolate(frame, [0.82 * fps + index * 2, 0.88 * fps + index * 2, 1.02 * fps + index * 2], [1, 0.92, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  output: 'perceptual-scale',
                }),
              }}
            >
              {key}
            </div>
          ))}
        </div>
        <Cursor x={360} y={685} clickAt={1.08 * fps} fromX={470} fromY={720} />
      </AppSurface>
    </AbsoluteFill>
  );
};
