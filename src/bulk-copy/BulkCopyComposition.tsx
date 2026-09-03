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
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {PrivacyMask} from '../components/PrivacyMask';

const bulkCopySchema = z.object({
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  tapColor: zColor(),
  tapRingColor: zColor(),
  backgroundMusicVolume: z.number().min(0).max(1),
  clickSoundVolume: z.number().min(0).max(1),
  logoSoundVolume: z.number().min(0).max(1),
  showTapEffects: z.boolean(),
  showCallouts: z.boolean(),
  calloutSelectAccount: z.string(),
  calloutMoreOptions: z.string(),
  calloutBulkCopy: z.string(),
  showLogoOutro: z.boolean(),
});

type BulkCopyProps = z.infer<typeof bulkCopySchema>;

const ExportAddressMaskRows: React.FC = () => (
  <>
    <PrivacyMask name="Export address 1" left={116} top={305} width={590} height={76} />
    <PrivacyMask name="Export address 2" left={116} top={404} width={590} height={76} />
    <PrivacyMask name="Export address 3" left={116} top={503} width={590} height={76} />
    <PrivacyMask name="Export address 4" left={116} top={602} width={590} height={76} />
    <PrivacyMask name="Export address 5" left={116} top={701} width={590} height={76} />
  </>
);

const ExportAddressPrivacyLayer: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Export addresses · Privacy masks"
      style={{
        position: 'absolute',
        left: 0,
        top: interpolate(frame, [539, 620], [0, -650], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        }),
        width: 760,
        height: 1645,
        opacity: interpolate(frame, [515, 539, 712, 740], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.16, 1, 0.3, 1)],
        }),
        translate: interpolate(frame, [515, 539, 712, 740], ['34px 0px', '0px 0px', '0px 0px', '-24px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
        }),
        scale: interpolate(frame, [515, 539, 712, 740], [1.026, 1, 1, 0.986], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
          output: 'perceptual-scale',
        }),
        filter: `blur(${interpolate(frame, [515, 539, 712, 740], [8, 0, 0, 7], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.out(Easing.cubic), Easing.linear, Easing.in(Easing.cubic)],
        })}px)`,
        pointerEvents: 'none',
      }}
    >
      <ExportAddressMaskRows />
    </Interactive.Div>
  );
};

const ScreenState: React.FC<{
  src: string;
  name: string;
  imageHeight: number;
  inputRange: [number, number, number, number];
  offsetRange: [number, number];
  scrollRange?: [number, number];
  enterFrom?: string;
  exitTo?: string;
}> = ({src, name, imageHeight, inputRange, offsetRange, scrollRange, enterFrom = '42px 0px', exitTo = '-24px 0px'}) => {
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
        translate: interpolate(frame, inputRange, [enterFrom, '0px 0px', '0px 0px', exitTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
        }),
        scale: interpolate(frame, inputRange, [1.026, 1, 1, 0.986], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
          output: 'perceptual-scale',
        }),
        filter: `blur(${interpolate(frame, inputRange, [8, 0, 0, 7], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.out(Easing.cubic), Easing.linear, Easing.in(Easing.cubic)],
        })}px)`,
      }}
    />
  );
};

const ToastOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="06 · Addresses copied"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 760,
        height: 1645,
        opacity: interpolate(frame, [660, 672, 708, 728], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [660, 672], ['0px -18px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        pointerEvents: 'none',
      }}
    >
      <CanvasImage src={staticFile('bulk-copy/p6.png')} width={760} height={1645} style={{width: 760, height: 1645}} />
      <ExportAddressMaskRows />
    </Interactive.Div>
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
  const {fps} = useVideoConfig();
  const visibility = interpolate(frame, [clickAt - 20, clickAt - 12, clickAt + 8, clickAt + 18], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });
  const appearanceSpring = spring({
    frame: frame - (clickAt - 20),
    fps,
    durationInFrames: 14,
    config: {damping: 14, stiffness: 210, mass: 0.55},
  });
  const outerRelease = spring({
    frame: frame - clickAt,
    fps,
    durationInFrames: 18,
    config: {damping: 12, stiffness: 220, mass: 0.62},
  });
  const innerRelease = spring({
    frame: frame - (clickAt + 1),
    fps,
    durationInFrames: 17,
    config: {damping: 9, stiffness: 280, mass: 0.52},
  });
  const outerPressScale =
    frame <= clickAt
      ? interpolate(frame, [clickAt - 6, clickAt], [1, 0.9], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.quad),
        })
      : 0.9 + outerRelease * 0.1;
  const innerPressScale =
    frame <= clickAt
      ? interpolate(frame, [clickAt - 6, clickAt], [1, 0.86], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.quad),
        })
      : 0.86 + innerRelease * 0.14;
  return (
    <div style={{position: 'absolute', left: x - 2, top: y - 2, width: 1, height: 1, opacity: visibility, zIndex: 200}}>
      <div
        style={{
          position: 'absolute',
          left: -24,
          top: -24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: ringColor,
          boxShadow: '0 9px 22px rgba(12,91,55,0.2)',
          scale: (0.72 + appearanceSpring * 0.28) * outerPressScale,
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
            scale: innerPressScale,
          }}
        />
      </div>
    </div>
  );
};

const ClickLayer: React.FC<{color: string; ringColor: string}> = ({color, ringColor}) => (
  <>
    <ReferencePointerCue clickAt={110} color={color} ringColor={ringColor} x={342} y={360} />
    <ReferencePointerCue clickAt={234} color={color} ringColor={ringColor} x={858} y={282} />
    <ReferencePointerCue clickAt={358} color={color} ringColor={ringColor} x={412} y={870} />
    <ReferencePointerCue clickAt={510} color={color} ringColor={ringColor} x={540} y={1008} />
    <ReferencePointerCue clickAt={660} color={color} ringColor={ringColor} x={362} y={1008} />
  </>
);

type CalloutTail = 'left' | 'right' | 'bottom';

const ClickCallout: React.FC<{
  clickAt: number;
  text: string;
  left: number;
  top: number;
  tail: CalloutTail;
  tailOffset: number;
}> = ({clickAt, text, left, top, tail, tailOffset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const isChinese = /[\u3400-\u9fff]/u.test(text);
  const pop = spring({
    frame: frame - (clickAt - 94),
    fps,
    durationInFrames: 30,
    config: {damping: 13, stiffness: 165, mass: 0.72},
  });
  const exitScale = interpolate(frame, [clickAt - 36, clickAt - 26], [1, 0.86], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const opacity = interpolate(frame, [clickAt - 94, clickAt - 84, clickAt - 36, clickAt - 26], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });
  const tailPosition =
    tail === 'left'
      ? {left: -9, top: tailOffset}
      : tail === 'right'
        ? {right: -9, top: tailOffset}
        : {left: tailOffset, bottom: -9};

  return (
    <Interactive.Div
      name={`Callout · ${text}`}
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 180,
        opacity,
        scale: pop * exitScale,
        transformOrigin:
          tail === 'left' ? '0% 50%' : tail === 'right' ? '100% 50%' : `${tailOffset + 9}px 100%`,
        padding: '20px 28px 21px',
        borderRadius: 22,
        backgroundColor: '#000000',
        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.22)',
        color: '#FFFFFF',
        fontFamily: isChinese ? 'MiSans, sans-serif' : 'Roobert, Arial, sans-serif',
        fontSize: 34,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '-0.35px',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: 3,
          backgroundColor: '#000000',
          rotate: '45deg',
          ...tailPosition,
        }}
      />
      <span style={{position: 'relative'}}>{text}</span>
    </Interactive.Div>
  );
};

const CalloutLayer: React.FC<{
  selectAccount: string;
  moreOptions: string;
  bulkCopy: string;
}> = ({selectAccount, moreOptions, bulkCopy}) => (
  <>
    <ClickCallout clickAt={110} text={selectAccount} left={382} top={302} tail="left" tailOffset={24} />
    <ClickCallout clickAt={234} text={moreOptions} left={566} top={224} tail="right" tailOffset={24} />
    <ClickCallout clickAt={358} text={bulkCopy} left={276} top={762} tail="bottom" tailOffset={126} />
  </>
);

const AudioLayer: React.FC<{
  backgroundMusicVolume: number;
  clickSoundVolume: number;
  logoSoundVolume: number;
}> = ({backgroundMusicVolume, clickSoundVolume, logoSoundVolume}) => {
  const clickFrames = [110, 234, 358, 510, 660];

  return (
    <>
      <Audio
        name="Dynamic electronic background music"
        src={staticFile('audio/dynamic-bed.wav')}
        durationInFrames={810}
        volume={(audioFrame) =>
          backgroundMusicVolume *
          interpolate(audioFrame, [0, 45, 670, 740], [0, 1, 1, 0], {
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
      <Sequence name="Logo reveal sound" from={718} durationInFrames={92}>
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
  showCallouts,
  calloutSelectAccount,
  calloutMoreOptions,
  calloutBulkCopy,
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
          opacity: interpolate(frame, [0, 18, 708, 740], [0, 1, 1, 0], {
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
          inputRange={[0, 18, 115, 139]}
          offsetRange={[0, 0]}
          enterFrom="0px 22px"
        />
        <ScreenState
          name="02 · Account list"
          src="bulk-copy/p2.png"
          imageHeight={1645}
          inputRange={[115, 139, 239, 263]}
          offsetRange={[0, 0]}
        />
        <ScreenState
          name="03 · Account more menu"
          src="bulk-copy/p3.png"
          imageHeight={1645}
          inputRange={[239, 263, 363, 387]}
          offsetRange={[-650, -650]}
          enterFrom="0px 48px"
        />
        <ScreenState
          name="04 · Bulk copy addresses"
          src="bulk-copy/p4.png"
          imageHeight={1650}
          inputRange={[363, 387, 515, 539]}
          offsetRange={[0, -650]}
          scrollRange={[387, 484]}
        />
        <ScreenState
          name="05 · Export addresses"
          src="bulk-copy/p5.png"
          imageHeight={1645}
          inputRange={[515, 539, 712, 740]}
          offsetRange={[0, -650]}
          scrollRange={[539, 620]}
          enterFrom="34px 0px"
        />
        <ExportAddressPrivacyLayer />
        <ToastOverlay />
      </Interactive.Div>

      {showCallouts ? (
        <CalloutLayer
          selectAccount={calloutSelectAccount}
          moreOptions={calloutMoreOptions}
          bulkCopy={calloutBulkCopy}
        />
      ) : null}

      {showTapEffects ? <ClickLayer color={tapColor} ringColor={tapRingColor} /> : null}

      {showLogoOutro ? (
        <AbsoluteFill
          name="OneKey App outro"
          style={{
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
            opacity: interpolate(frame, [712, 740], [0, 1], {
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
              opacity: interpolate(frame, [728, 750], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              }),
              scale: interpolate(frame, [728, 750, 766], [0.82, 1.035, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                output: 'perceptual-scale',
              }),
              translate: interpolate(frame, [728, 750], ['0px 18px', '0px 0px'], {
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
    durationInFrames={810}
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
      showCallouts: true,
      calloutSelectAccount: 'Select an account',
      calloutMoreOptions: 'More options',
      calloutBulkCopy: 'Bulk copy addresses',
      showLogoOutro: true,
    }}
  />
);
