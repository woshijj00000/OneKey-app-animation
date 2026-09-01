import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppSurface, Cursor, EthereumIcon, Header, PrimaryButton, SceneLabel, StatusBar, colors} from '../ui';

const reviewRows = [
  ['0x85e8…34eed3', '0.10 ETH'],
  ['0x09ac…7f21bf', '0.10 ETH'],
  ['0xc242…c4a871', '0.10 ETH'],
  ['0x77b1…02eade', '0.10 ETH'],
];

export const ReviewScene: React.FC<{
  durationInFrames: number;
  amountPerAddress: number;
  recipientCount: number;
}> = ({durationInFrames, amountPerAddress, recipientCount}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = amountPerAddress * recipientCount;

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
        eyebrow="Step 03 · Review"
        title={'See the whole\ntransaction.'}
        body="Summary, fee and recipient cards reorganize into a clear final review."
      />
      <AppSurface
        name="Transaction review interface"
        style={{
          position: 'absolute',
          left: 245,
          top: 380,
          scale: interpolate(frame, [0, 0.65 * fps], [1.08, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
        }}
      >
        <StatusBar />
        <Header title="Review transaction" />
        <div style={{padding: '22px 28px 24px'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(frame, [0.15 * fps, 0.65 * fps], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              translate: interpolate(frame, [0.15 * fps, 0.65 * fps], ['0px 35px', '0px 0px'], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <div style={{fontSize: 15, color: colors.muted}}>Sending amount</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
              <EthereumIcon size={38} />
              <span style={{fontSize: 36, fontWeight: 780, letterSpacing: -1.2}}>-{total.toFixed(2)} ETH</span>
            </div>
            <div style={{fontSize: 18, color: colors.muted, marginTop: 4}}>${(total * 4000).toFixed(0)}</div>
          </div>

          <div
            style={{
              marginTop: 24,
              background: colors.soft,
              borderRadius: 20,
              padding: '18px 20px',
              opacity: interpolate(frame, [0.45 * fps, 0.9 * fps], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              translate: interpolate(frame, [0.45 * fps, 0.9 * fps], ['0px 28px', '0px 0px'], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15}}>
              <span style={{color: colors.muted}}>Est. network fee</span>
              <span style={{fontWeight: 700}}>0.0021 ETH ($4.97)</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, marginTop: 15}}>
              <span style={{color: colors.muted}}>Interval</span>
              <span style={{fontWeight: 700}}>15 – 50 seconds</span>
            </div>
          </div>

          <div style={{fontSize: 20, fontWeight: 750, marginTop: 22}}>Transaction details</div>
          <div style={{marginTop: 8}}>
            {reviewRows.map(([address, amount], index) => (
              <div
                key={address}
                style={{
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${colors.line}`,
                  fontSize: 15,
                  opacity: interpolate(frame, [0.7 * fps + index * 7, 1.05 * fps + index * 7], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  translate: interpolate(frame, [0.7 * fps + index * 7, 1.05 * fps + index * 7], ['26px 0px', '0px 0px'], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                <span style={{color: colors.muted}}>{address}</span>
                <span style={{fontWeight: 680}}>{amount}</span>
              </div>
            ))}
          </div>
          <PrimaryButton
            style={{
              marginTop: 20,
              scale: interpolate(frame, [1.8 * fps, 1.96 * fps, 2.18 * fps], [1, 0.965, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: 'perceptual-scale',
              }),
            }}
          >
            Confirm
          </PrimaryButton>
        </div>
        <Cursor x={475} y={705} clickAt={1.98 * fps} fromX={520} fromY={620} />
      </AppSurface>
    </AbsoluteFill>
  );
};
