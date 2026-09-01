import {Video} from '@remotion/media';
import {zColor} from '@remotion/zod-types';
import {AbsoluteFill, CalculateMetadataFunction, Composition, Easing, Interactive, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';

const segmentSchema = z.object({start: z.number().min(0), end: z.number().positive(), speed: z.number().min(0.25).max(8)});
const tapSchema = z.object({time: z.number().min(0), x: z.number().min(0).max(1), y: z.number().min(0).max(1)});

export const phoneDemoSchema = z.object({
  videoSrc: z.string(),
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  tapColor: zColor(),
  phoneScale: z.number().min(0.72).max(1.05),
  volume: z.number().min(0).max(1),
  showTapEffects: z.boolean(),
  segments: z.array(segmentSchema).min(1),
  taps: z.array(tapSchema),
});

type PhoneDemoProps = z.infer<typeof phoneDemoSchema>;

const getSegmentFrames = (segment: z.infer<typeof segmentSchema>, fps: number) =>
  Math.max(1, Math.round(((segment.end - segment.start) / segment.speed) * fps));

const calculateMetadata: CalculateMetadataFunction<PhoneDemoProps> = ({props}) => ({
  durationInFrames: props.segments.reduce((sum, segment) => sum + getSegmentFrames(segment, 60), 0),
  defaultOutName: 'bulk-send-square-demo.mp4',
});

const EditedRecording: React.FC<Pick<PhoneDemoProps, 'segments' | 'videoSrc' | 'volume'>> = ({segments, videoSrc, volume}) => {
  const {fps} = useVideoConfig();
  let cursor = 0;

  return <>{segments.map((segment, index) => {
    const durationInFrames = getSegmentFrames(segment, fps);
    const from = cursor;
    cursor += durationInFrames;
    return (
      <Sequence key={`${segment.start}-${segment.end}-${index}`} name={`Recording segment ${index + 1}`} from={from} durationInFrames={durationInFrames}>
        <Video
          name="App screen recording"
          src={staticFile(videoSrc)}
          trimBefore={Math.round(segment.start * fps)}
          playbackRate={segment.speed}
          volume={volume}
          objectFit="cover"
          style={{width: '100%', height: '100%'}}
        />
      </Sequence>
    );
  })}</>;
};

const TapEffect: React.FC<z.infer<typeof tapSchema> & {color: string}> = ({time, x, y, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - time * fps;
  if (localFrame < 0 || localFrame > 0.42 * fps) return null;

  return (
    <div style={{
      position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`,
      width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: '50%',
      boxShadow: '0 0 0 26px rgba(69, 167, 255, 0.16), 0 6px 18px rgba(31, 111, 202, 0.2)',
      backgroundColor: color, pointerEvents: 'none',
      opacity: interpolate(localFrame, [0, 0.08 * fps, 0.42 * fps], [0, 0.92, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
      scale: interpolate(localFrame, [0, 0.12 * fps, 0.42 * fps], [0.35, 1.15, 0.82], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1), output: 'perceptual-scale',
      }),
    }} />
  );
};

export const PhoneDemo: React.FC<PhoneDemoProps> = ({backgroundBottom, backgroundTop, tapColor, phoneScale, segments, showTapEffects, taps, videoSrc, volume}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundImage: `linear-gradient(150deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Interactive.Div name="App interface" style={{
          position: 'relative', width: 440, height: 1000, borderRadius: 56, overflow: 'hidden',
          backgroundColor: '#fff',
          border: '1px solid rgba(82, 89, 150, 0.11)',
          boxShadow: '0 32px 76px rgba(76, 82, 154, 0.18), 0 8px 24px rgba(76, 82, 154, 0.1)',
          opacity: interpolate(frame, [0, 0.5 * fps, durationInFrames - 0.45 * fps, durationInFrames - 1], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: phoneScale * interpolate(frame, [0, 0.7 * fps, durationInFrames - 0.5 * fps, durationInFrames - 1], [0.88, 1, 1, 0.94], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1), output: 'perceptual-scale',
          }),
          translate: interpolate(frame, [0, durationInFrames - 1], ['0px 10px', '0px -10px'], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.37, 0, 0.63, 1),
          }),
        }}>
          <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#fff'}}>
            <EditedRecording segments={segments} videoSrc={videoSrc} volume={volume} />
            {showTapEffects ? taps.map((tap, index) => <TapEffect key={index} {...tap} color={tapColor} />) : null}
          </div>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition
    id="PhoneProductDemoSquare"
    component={PhoneDemo}
    durationInFrames={2286}
    fps={60}
    width={1080}
    height={1080}
    schema={phoneDemoSchema}
    calculateMetadata={calculateMetadata}
    defaultProps={{
      videoSrc: 'recordings/bulk-send-h264.mp4',
      backgroundTop: '#eef0ff', backgroundBottom: '#dfe3ff', tapColor: '#53a9ff',
      phoneScale: 0.94, volume: 0, showTapEffects: true,
      segments: [
        {start: 0, end: 34.4, speed: 2.5},
        {start: 34.4, end: 79.4, speed: 3},
        {start: 79.4, end: 85.2, speed: 1.5},
        {start: 109, end: 119.9, speed: 2},
      ],
      taps: [
        {time: 1.2, x: 0.82, y: 0.16}, {time: 6.8, x: 0.5, y: 0.89},
        {time: 9.7, x: 0.5, y: 0.89}, {time: 11.8, x: 0.5, y: 0.89},
        {time: 16.7, x: 0.78, y: 0.59}, {time: 20.7, x: 0.64, y: 0.35},
        {time: 23.1, x: 0.5, y: 0.89}, {time: 25.4, x: 0.5, y: 0.89},
        {time: 27.7, x: 0.5, y: 0.89}, {time: 33.2, x: 0.77, y: 0.89},
      ],
    }}
  />
);
