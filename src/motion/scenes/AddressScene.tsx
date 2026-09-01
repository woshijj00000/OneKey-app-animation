import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppSurface, Cursor, EthereumIcon, Header, PrimaryButton, SceneLabel, StatusBar, colors} from '../ui';

const addressRows = [
  '0x85e8…34eed3',
  '0x09ac…7f21bf',
  '0xc242…c4a871',
  '0x77b1…02eade',
];

export const AddressScene: React.FC<{durationInFrames: number; recipientCount: number}> = ({
  durationInFrames,
  recipientCount,
}) => {
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
        eyebrow="Step 01 · Recipients"
        title={'Add every\ndestination.'}
        body="Recipient rows become reusable data, not a flattened screen recording."
      />
      <AppSurface
        name="Recipient entry interface"
        style={{
          position: 'absolute',
          left: 245,
          top: 380,
          translate: interpolate(frame, [0, 0.7 * fps], ['90px 80px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 0.7 * fps], [0.94, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
        }}
      >
        <StatusBar />
        <Header title="Bulk send" subtitle="Many-to-One" />
        <div style={{padding: '20px 28px 24px'}}>
          <div style={{fontSize: 15, color: colors.muted, marginBottom: 8}}>Asset</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 72,
              borderRadius: 18,
              padding: '0 18px',
              backgroundColor: colors.soft,
            }}
          >
            <EthereumIcon size={40} />
            <div style={{marginLeft: 12, flex: 1}}>
              <div style={{fontSize: 18, fontWeight: 700}}>ETH</div>
              <div style={{fontSize: 14, color: colors.muted}}>Ethereum</div>
            </div>
            <div style={{fontSize: 26, color: '#A4A5AA'}}>›</div>
          </div>

          <div style={{fontSize: 15, color: colors.muted, marginTop: 19, marginBottom: 8}}>Sending address</div>
          <div
            style={{
              minHeight: 82,
              border: `1px solid ${colors.line}`,
              borderRadius: 17,
              padding: '16px 18px',
              fontSize: 16,
              lineHeight: 1.45,
              color: colors.ink,
              background: '#FFFFFF',
            }}
          >
            0x1a2b80525383ab4E3d94b7689e3146bF899A3c4D
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 19, marginBottom: 8}}>
            <span style={{fontSize: 15, color: colors.muted}}>Receiving addresses</span>
            <span style={{fontSize: 14, color: colors.blue, fontWeight: 700}}>{recipientCount} wallets</span>
          </div>
          <div style={{border: `1px solid ${colors.line}`, borderRadius: 19, overflow: 'hidden'}}>
            {addressRows.map((address, index) => (
              <div
                key={address}
                style={{
                  height: 58,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 17px',
                  borderBottom: index === addressRows.length - 1 ? 'none' : `1px solid ${colors.line}`,
                  opacity: interpolate(
                    frame,
                    [0.65 * fps + index * 8, 1.05 * fps + index * 8],
                    [0, 1],
                    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
                  ),
                  translate: interpolate(
                    frame,
                    [0.65 * fps + index * 8, 1.05 * fps + index * 8],
                    ['42px 0px', '0px 0px'],
                    {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                <div style={{width: 28, height: 28, borderRadius: 9, background: '#EEF1FF', color: colors.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800}}>
                  {index + 1}
                </div>
                <div style={{marginLeft: 12, flex: 1, fontSize: 16, fontWeight: 580}}>{address}</div>
                <div style={{color: colors.muted, fontSize: 18}}>×</div>
              </div>
            ))}
          </div>
          <PrimaryButton
            active={frame >= 1.45 * fps}
            style={{
              marginTop: 18,
              scale: interpolate(frame, [1.8 * fps, 1.95 * fps, 2.15 * fps], [1, 0.97, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                output: 'perceptual-scale',
              }),
            }}
          >
            Continue
          </PrimaryButton>
        </div>
        <Cursor x={475} y={700} clickAt={2 * fps} fromX={520} fromY={620} />
      </AppSurface>
    </AbsoluteFill>
  );
};
