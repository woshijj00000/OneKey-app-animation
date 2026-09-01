import {zColor} from '@remotion/zod-types';
import {
  AbsoluteFill,
  CanvasImage,
  Composition,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {z} from 'zod';

const testFlowSchema = z.object({
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  tapColor: zColor(),
  tapRingColor: zColor(),
  showTapEffects: z.boolean(),
  showLogoOutro: z.boolean(),
});

type TestFlowProps = z.infer<typeof testFlowSchema>;

const ScreenState: React.FC<{
  src: string;
  name: string;
  imageHeight: number;
  inputRange: [number, number, number, number];
  offsetRange: [number, number];
  scrollRange?: [number, number];
  enterFrom?: string;
}> = ({src, name, imageHeight, inputRange, offsetRange, scrollRange, enterFrom = '28px 0px'}) => {
  const frame = useCurrentFrame();
  const scrollOffset = scrollRange
    ? interpolate(frame, scrollRange, offsetRange, {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    : offsetRange[0];

  return (
    <CanvasImage
      name={name}
      src={staticFile(src)}
      width={760}
      height={imageHeight}
      style={{
        position: 'absolute',
        left: 0,
        top: scrollOffset,
        width: 760,
        height: imageHeight,
        opacity: interpolate(frame, inputRange, [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.16, 1, 0.3, 1)],
        }),
        translate: interpolate(frame, [inputRange[0], inputRange[1]], [enterFrom, '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [inputRange[0], inputRange[1]], [1.018, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          output: 'perceptual-scale',
        }),
      }}
    />
  );
};

const ReferencePointerCue: React.FC<{
  clickAt: number;
  color: string;
  ringColor: string;
  x: number;
  y: number;
}> = ({clickAt, color, ringColor, x, y}) => {
  const frame = useCurrentFrame();

  const visibility = interpolate(frame, [clickAt - 28, clickAt - 21, clickAt + 22, clickAt + 34], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(frame, [clickAt - 28, clickAt - 5], [76, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const cursorY = interpolate(frame, [clickAt - 28, clickAt - 5], [86, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const pressScale = interpolate(frame, [clickAt - 5, clickAt, clickAt + 6, clickAt + 15], [1, 0.78, 1.09, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    output: 'perceptual-scale',
  });
  const burstOpacity = interpolate(frame, [clickAt - 2, clickAt + 2, clickAt + 14], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const burstScale = interpolate(frame, [clickAt - 2, clickAt + 14], [0.45, 1.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
    output: 'perceptual-scale',
  });

  return (
    <div style={{position: 'absolute', left: x - 2, top: y - 2, width: 1, height: 1, opacity: visibility, zIndex: 200}}>
      <div style={{position: 'absolute', left: -38, top: -38, width: 76, height: 76, opacity: burstOpacity, scale: burstScale}}>
        {Array.from({length: 10}).map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: 36,
              top: 2,
              width: index % 2 === 0 ? 4 : 3,
              height: index % 2 === 0 ? 15 : 10,
              borderRadius: 4,
              backgroundColor: color,
              transformOrigin: '2px 36px',
              rotate: `${index * 36}deg`,
              boxShadow: `0 2px 8px ${color}55`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: -12,
          top: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 8px 22px ${color}66, inset 0 2px 3px rgba(255,255,255,0.62)`,
          opacity: interpolate(frame, [clickAt - 4, clickAt, clickAt + 18], [0, 0.95, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [clickAt - 4, clickAt + 12], [0.25, 1.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.quad),
            output: 'perceptual-scale',
          }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cursorX - 24,
          top: cursorY - 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: ringColor,
          boxShadow: '0 9px 22px rgba(12,91,55,0.2)',
          scale: pressScale,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

const ReferenceClickLayer: React.FC<{color: string; ringColor: string}> = ({color, ringColor}) => (
  <>
    <ReferencePointerCue clickAt={55} color={color} ringColor={ringColor} x={860} y={266} />
    <ReferencePointerCue clickAt={132} color={color} ringColor={ringColor} x={630} y={926} />
    <ReferencePointerCue clickAt={210} color={color} ringColor={ringColor} x={420} y={671} />
    <ReferencePointerCue clickAt={350} color={color} ringColor={ringColor} x={540} y={966} />
    <ReferencePointerCue clickAt={474} color={color} ringColor={ringColor} x={540} y={966} />
    <ReferencePointerCue clickAt={610} color={color} ringColor={ringColor} x={540} y={971} />
  </>
);

export const BulkSendTestSocial: React.FC<TestFlowProps> = ({
  backgroundTop,
  backgroundBottom,
  tapColor,
  tapRingColor,
  showTapEffects,
  showLogoOutro,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 680,
          height: 680,
          left: -300,
          top: -360,
          borderRadius: '50%',
          backgroundColor: '#C8FF45',
          filter: 'blur(135px)',
          opacity: 0.2,
        }}
      />

      <Interactive.Div
        name="Bulk Send test UI flow"
        style={{
          position: 'absolute',
          left: 160,
          bottom: 0,
          width: 760,
          height: 984,
          overflow: 'hidden',
          borderRadius: '92px 92px 0 0',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 -24px 90px rgba(0,98,55,0.18), 0 -5px 24px rgba(0,98,55,0.1)',
          transformOrigin: '50% 100%',
          opacity: interpolate(frame, [0, 18, 616, 640], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [0, 24], [0.94, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: 'perceptual-scale',
          }),
        }}
      >
        <ScreenState
          name="01 · Wallet home"
          src="test-flow/p1.png"
          imageHeight={1643}
          inputRange={[0, 18, 55, 70]}
          offsetRange={[0, 0]}
          enterFrom="0px 22px"
        />
        <ScreenState
          name="02 · Settings"
          src="test-flow/p2.png"
          imageHeight={1645}
          inputRange={[55, 70, 118, 132]}
          offsetRange={[0, -160]}
          scrollRange={[70, 118]}
        />
        <ScreenState
          name="03 · Settings after scroll"
          src="test-flow/p3.png"
          imageHeight={1645}
          inputRange={[118, 126, 132, 146]}
          offsetRange={[-160, -160]}
          enterFrom="0px 0px"
        />
        <ScreenState
          name="04 · Select Many-to-One"
          src="test-flow/p4.png"
          imageHeight={1645}
          inputRange={[132, 146, 210, 224]}
          offsetRange={[-660, -660]}
          enterFrom="0px 48px"
        />
        <ScreenState
          name="05 · Address form"
          src="test-flow/p5.png"
          imageHeight={1645}
          inputRange={[210, 224, 350, 364]}
          offsetRange={[0, -650]}
          scrollRange={[224, 336]}
          enterFrom="34px 0px"
        />
        <ScreenState
          name="06 · Amount and details"
          src="test-flow/p6.png"
          imageHeight={1645}
          inputRange={[350, 364, 474, 488]}
          offsetRange={[0, -650]}
          scrollRange={[364, 460]}
          enterFrom="0px 12px"
        />
        <ScreenState
          name="07 · Review and confirm"
          src="test-flow/p7.png"
          imageHeight={1645}
          inputRange={[474, 488, 616, 640]}
          offsetRange={[0, -650]}
          scrollRange={[488, 588]}
          enterFrom="34px 0px"
        />

      </Interactive.Div>

      {showTapEffects ? <ReferenceClickLayer color={tapColor} ringColor={tapRingColor} /> : null}

      {showLogoOutro ? (
        <AbsoluteFill
          name="OneKey App outro"
          style={{
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
            opacity: interpolate(frame, [616, 640], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }),
          }}
        >
          <CanvasImage
            name="OneKey App logo"
            src={staticFile('brand/onekey-user-outro.png')}
            width={720}
            height={290}
            style={{
              width: 720,
              height: 290,
              opacity: interpolate(frame, [630, 648], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              }),
              scale: interpolate(frame, [630, 648, 662], [0.82, 1.035, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                output: 'perceptual-scale',
              }),
              translate: interpolate(frame, [630, 648], ['0px 18px', '0px 0px'], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              }),
            }}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const BulkSendTestSocialComposition: React.FC = () => (
  <Composition
    id="BulkSendTestSocialSquare"
    component={BulkSendTestSocial}
    durationInFrames={720}
    fps={60}
    width={1080}
    height={1080}
    schema={testFlowSchema}
    defaultProps={{
      backgroundTop: '#05E000',
      backgroundBottom: '#05D6A0',
      tapColor: '#00E000',
      tapRingColor: '#B9F4BA',
      showTapEffects: true,
      showLogoOutro: true,
    }}
  />
);
