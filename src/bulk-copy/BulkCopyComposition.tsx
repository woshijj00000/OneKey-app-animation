import {zColor} from '@remotion/zod-types';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  CanvasImage,
  Composition,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {z} from 'zod';

const bulkCopySchema = z.object({
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  tapColor: zColor(),
  tapRingColor: zColor(),
  backgroundMusicVolume: z.number().min(0).max(1),
  clickSoundVolume: z.number().min(0).max(1),
  logoSoundVolume: z.number().min(0).max(1),
  showTapEffects: z.boolean(),
  showLogoOutro: z.boolean(),
});

type BulkCopyProps = z.infer<typeof bulkCopySchema>;

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

const ToastOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <CanvasImage
      name="06 · Addresses copied"
      src={staticFile('bulk-copy/p6.png')}
      width={760}
      height={1645}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 760,
        height: 1645,
        opacity: interpolate(frame, [500, 512, 548, 568], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [500, 512], ['0px -18px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
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
        <div style={{position: 'absolute', left: 8, top: 8, width: 32, height: 32, borderRadius: '50%', backgroundColor: color}} />
      </div>
    </div>
  );
};

const ClickLayer: React.FC<{color: string; ringColor: string}> = ({color, ringColor}) => (
  <>
    <ReferencePointerCue clickAt={55} color={color} ringColor={ringColor} x={342} y={360} />
    <ReferencePointerCue clickAt={130} color={color} ringColor={ringColor} x={858} y={282} />
    <ReferencePointerCue clickAt={210} color={color} ringColor={ringColor} x={412} y={870} />
    <ReferencePointerCue clickAt={365} color={color} ringColor={ringColor} x={540} y={1008} />
    <ReferencePointerCue clickAt={500} color={color} ringColor={ringColor} x={362} y={1008} />
  </>
);

const AudioLayer: React.FC<{
  backgroundMusicVolume: number;
  clickSoundVolume: number;
  logoSoundVolume: number;
}> = ({backgroundMusicVolume, clickSoundVolume, logoSoundVolume}) => {
  const clickFrames = [55, 130, 210, 365, 500];

  return (
    <>
      <Audio
        name="Dynamic electronic background music"
        src={staticFile('audio/dynamic-bed.wav')}
        durationInFrames={650}
        volume={(audioFrame) =>
          backgroundMusicVolume *
          interpolate(audioFrame, [0, 45, 510, 570], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {clickFrames.map((clickFrame, index) => (
        <Sequence key={clickFrame} name={`Click sound ${index + 1}`} from={clickFrame} durationInFrames={31}>
          <Audio src={staticFile('audio/click-user.mp3')} volume={clickSoundVolume} />
        </Sequence>
      ))}
      <Sequence name="Logo reveal sound" from={558} durationInFrames={92}>
        <Audio src={staticFile('audio/logo-reveal.wav')} volume={logoSoundVolume} />
      </Sequence>
    </>
  );
};

export const BulkCopySocial: React.FC<BulkCopyProps> = ({
  backgroundTop,
  backgroundBottom,
  tapColor,
  tapRingColor,
  backgroundMusicVolume,
  clickSoundVolume,
  logoSoundVolume,
  showTapEffects,
  showLogoOutro,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`}}>
      <AudioLayer
        backgroundMusicVolume={backgroundMusicVolume}
        clickSoundVolume={clickSoundVolume}
        logoSoundVolume={logoSoundVolume}
      />
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
        name="Bulk copy addresses UI flow"
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
          opacity: interpolate(frame, [0, 18, 548, 580], [0, 1, 1, 0], {
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
          src="bulk-copy/p1.png"
          imageHeight={1645}
          inputRange={[0, 18, 55, 70]}
          offsetRange={[0, 0]}
          enterFrom="0px 22px"
        />
        <ScreenState
          name="02 · Account list"
          src="bulk-copy/p2.png"
          imageHeight={1645}
          inputRange={[55, 70, 130, 144]}
          offsetRange={[0, 0]}
        />
        <ScreenState
          name="03 · Account more menu"
          src="bulk-copy/p3.png"
          imageHeight={1645}
          inputRange={[130, 144, 210, 224]}
          offsetRange={[-650, -650]}
          enterFrom="0px 48px"
        />
        <ScreenState
          name="04 · Bulk copy addresses"
          src="bulk-copy/p4.png"
          imageHeight={1650}
          inputRange={[210, 224, 365, 379]}
          offsetRange={[0, -650]}
          scrollRange={[224, 353]}
        />
        <ScreenState
          name="05 · Export addresses"
          src="bulk-copy/p5.png"
          imageHeight={1645}
          inputRange={[365, 379, 552, 580]}
          offsetRange={[0, -650]}
          scrollRange={[379, 480]}
          enterFrom="34px 0px"
        />
        <ToastOverlay />
      </Interactive.Div>

      {showTapEffects ? <ClickLayer color={tapColor} ringColor={tapRingColor} /> : null}

      {showLogoOutro ? (
        <AbsoluteFill
          name="OneKey App outro"
          style={{
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
            opacity: interpolate(frame, [552, 580], [0, 1], {
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
              opacity: interpolate(frame, [568, 590], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              }),
              scale: interpolate(frame, [568, 590, 606], [0.82, 1.035, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                output: 'perceptual-scale',
              }),
              translate: interpolate(frame, [568, 590], ['0px 18px', '0px 0px'], {
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

export const BulkCopySocialComposition: React.FC = () => (
  <Composition
    id="BulkCopyAddressesSocialSquare"
    component={BulkCopySocial}
    durationInFrames={650}
    fps={60}
    width={1080}
    height={1080}
    schema={bulkCopySchema}
    defaultProps={{
      backgroundTop: '#05E000',
      backgroundBottom: '#05D6A0',
      tapColor: '#00E000',
      tapRingColor: '#B9F4BA',
      backgroundMusicVolume: 0.5,
      clickSoundVolume: 0.72,
      logoSoundVolume: 0.72,
      showTapEffects: true,
      showLogoOutro: true,
    }}
  />
);
