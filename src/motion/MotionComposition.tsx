import {zColor} from '@remotion/zod-types';
import {
  AbsoluteFill,
  Composition,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {AddressScene} from './scenes/AddressScene';
import {AmountScene} from './scenes/AmountScene';
import {EntryScene} from './scenes/EntryScene';
import {OutroScene} from './scenes/OutroScene';
import {ProgressScene} from './scenes/ProgressScene';
import {ReviewScene} from './scenes/ReviewScene';

export const bulkSendMotionSchema = z.object({
  title: z.string(),
  recipientCount: z.number().int().min(1).max(4),
  amountPerAddress: z.number().min(0.01).max(100),
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  accentColor: zColor(),
  reducedMotion: z.boolean(),
});

type BulkSendMotionProps = z.infer<typeof bulkSendMotionSchema>;

const ReducedMotionPoster: React.FC<Pick<BulkSendMotionProps, 'title'>> = ({title}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 116, height: 116, borderRadius: 36, background: '#101114', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 43, fontWeight: 820}}>1K</div>
    <div style={{fontSize: 86, fontWeight: 800, letterSpacing: -4.5, color: '#101114', marginTop: 40}}>{title}</div>
    <div style={{fontSize: 28, color: '#777983', marginTop: 14}}>Many transfers. One simple flow.</div>
  </AbsoluteFill>
);

export const BulkSendMotion: React.FC<BulkSendMotionProps> = ({
  title,
  recipientCount,
  amountPerAddress,
  backgroundTop,
  backgroundBottom,
  accentColor,
  reducedMotion,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundImage: `linear-gradient(150deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      }}
    >
      <Interactive.Div
        name="Blue ambient glow"
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          borderRadius: '50%',
          left: -230,
          top: -250,
          backgroundColor: accentColor,
          filter: 'blur(110px)',
          opacity: 0.14,
          translate: interpolate(frame, [0, durationInFrames], ['0px 0px', '160px 110px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [0, durationInFrames], [0.9, 1.18], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            output: 'perceptual-scale',
          }),
        }}
      />
      <Interactive.Div
        name="Violet ambient glow"
        style={{
          position: 'absolute',
          width: 720,
          height: 720,
          borderRadius: '50%',
          right: -310,
          bottom: -330,
          backgroundColor: '#8C78FF',
          filter: 'blur(120px)',
          opacity: 0.15,
          translate: interpolate(frame, [0, durationInFrames], ['0px 0px', '-130px -110px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(55,63,125,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.23,
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />

      {reducedMotion ? (
        <ReducedMotionPoster title={title} />
      ) : (
        <>
          <Sequence name="Scene 1 · Entry and type" durationInFrames={210}>
            <EntryScene durationInFrames={210} />
          </Sequence>
          <Sequence name="Scene 2 · Recipient addresses" from={180} durationInFrames={240}>
            <AddressScene durationInFrames={240} recipientCount={recipientCount} />
          </Sequence>
          <Sequence name="Scene 3 · Amount input" from={390} durationInFrames={210}>
            <AmountScene
              durationInFrames={210}
              amountPerAddress={amountPerAddress}
              recipientCount={recipientCount}
            />
          </Sequence>
          <Sequence name="Scene 4 · Review transaction" from={570} durationInFrames={210}>
            <ReviewScene
              durationInFrames={210}
              amountPerAddress={amountPerAddress}
              recipientCount={recipientCount}
            />
          </Sequence>
          <Sequence name="Scene 5 · Transfer progress" from={750} durationInFrames={240}>
            <ProgressScene durationInFrames={240} />
          </Sequence>
          <Sequence name="Scene 6 · Outro" from={960} durationInFrames={150}>
            <OutroScene durationInFrames={150} title={title} />
          </Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};

export const BulkSendMotionComposition: React.FC = () => (
  <Composition
    id="BulkSendMotionSquare"
    component={BulkSendMotion}
    durationInFrames={1110}
    fps={60}
    width={1080}
    height={1080}
    schema={bulkSendMotionSchema}
    defaultProps={{
      title: 'Bulk send',
      recipientCount: 4,
      amountPerAddress: 0.1,
      backgroundTop: '#F0F1FF',
      backgroundBottom: '#F9F7FF',
      accentColor: '#2F6BFF',
      reducedMotion: false,
    }}
  />
);
