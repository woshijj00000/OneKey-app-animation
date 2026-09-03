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
import {PRIVACY_MASK_COLOR, PRIVACY_MASK_RADIUS} from '../components/PrivacyMask';

const FPS = 60;
const DURATION = 1280;
const UI_LEFT = 144;
const UI_WIDTH = 792;
const UI_HEIGHT = 950;
const SOURCE_SCALE = UI_WIDTH / 900;
const SOURCE_SIZE = 1080 * SOURCE_SCALE;
const SOURCE_LEFT = (UI_WIDTH - SOURCE_SIZE) / 2;

type ScreenKind = 'home' | 'plain' | 'recent' | 'pasted' | 'address-book' | 'selected';

type ScreenStateProps = {
  name: string;
  src: string;
  inputRange: [number, number, number, number];
  kind?: ScreenKind;
  enterFrom?: string;
  exitTo?: string;
};

const sourceX = (value: number) => SOURCE_LEFT + value * SOURCE_SCALE;
const sourceY = (value: number) => value * SOURCE_SCALE;
const sourceLength = (value: number) => value * SOURCE_SCALE;

const PrivacyBar: React.FC<{
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
}> = ({name, left, top, width, height}) => (
  <div
    data-name={name}
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderRadius: PRIVACY_MASK_RADIUS,
      backgroundColor: PRIVACY_MASK_COLOR,
    }}
  />
);

const HomeCleanPatch: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: sourceX(90),
        top: sourceY(494),
        width: sourceLength(455),
        height: sourceLength(126),
        backgroundColor: '#FFFFFF',
      }}
    />
    {[
      {left: 136, label: '发送', icon: '↑'},
      {left: 342, label: '接收', icon: '↓'},
    ].map((button) => (
      <div
        key={button.label}
        style={{
          position: 'absolute',
          left: sourceX(button.left),
          top: sourceY(567),
          width: sourceLength(194),
          height: sourceLength(141),
          borderRadius: sourceLength(24),
          backgroundColor: '#F4F4F4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#222222',
          fontFamily: 'MiSans, sans-serif',
          fontWeight: 600,
        }}
      >
        <div style={{fontSize: sourceLength(54), lineHeight: 0.82, color: '#606060'}}>{button.icon}</div>
        <div style={{fontSize: sourceLength(26), marginTop: sourceLength(18)}}>{button.label}</div>
      </div>
    ))}
  </>
);

const ScreenPrivacy: React.FC<{kind: ScreenKind}> = ({kind}) => {
  if (kind === 'home') {
    return <HomeCleanPatch />;
  }

  if (kind === 'recent') {
    return (
      <>
        <PrivacyBar name="Recent address line 1" left={sourceX(249)} top={sourceY(840)} width={sourceLength(690)} height={sourceLength(52)} />
        <PrivacyBar name="Recent address line 2" left={sourceX(249)} top={sourceY(898)} width={sourceLength(190)} height={sourceLength(40)} />
        <PrivacyBar name="Recent address next row" left={sourceX(249)} top={sourceY(1053)} width={sourceLength(690)} height={sourceLength(40)} />
      </>
    );
  }

  if (kind === 'pasted') {
    return (
      <>
        <PrivacyBar name="Pasted recipient line 1" left={sourceX(165)} top={sourceY(386)} width={sourceLength(771)} height={sourceLength(46)} />
        <PrivacyBar name="Pasted recipient line 2" left={sourceX(165)} top={sourceY(430)} width={sourceLength(205)} height={sourceLength(43)} />
      </>
    );
  }

  if (kind === 'address-book') {
    return (
      <>
        <PrivacyBar name="Saved address line 1" left={sourceX(249)} top={sourceY(828)} width={sourceLength(690)} height={sourceLength(43)} />
        <PrivacyBar name="Saved address line 2" left={sourceX(249)} top={sourceY(879)} width={sourceLength(190)} height={sourceLength(41)} />
        <PrivacyBar name="Crypto address line 1" left={sourceX(249)} top={sourceY(1035)} width={sourceLength(690)} height={sourceLength(42)} />
      </>
    );
  }

  if (kind === 'selected') {
    return (
      <>
        <PrivacyBar name="Selected recipient line 1" left={sourceX(165)} top={sourceY(313)} width={sourceLength(771)} height={sourceLength(44)} />
        <PrivacyBar name="Selected recipient line 2" left={sourceX(165)} top={sourceY(356)} width={sourceLength(208)} height={sourceLength(43)} />
        <PrivacyBar name="Selected Crypto address line 1" left={sourceX(249)} top={sourceY(852)} width={sourceLength(690)} height={sourceLength(43)} />
        <PrivacyBar name="Selected Crypto address line 2" left={sourceX(249)} top={sourceY(899)} width={sourceLength(690)} height={sourceLength(40)} />
      </>
    );
  }

  return null;
};

const ScreenState: React.FC<ScreenStateProps> = ({
  name,
  src,
  inputRange,
  kind = 'plain',
  enterFrom = '34px 0px',
  exitTo = '-22px 0px',
}) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name={name}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: interpolate(frame, inputRange, [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
        }),
        translate: interpolate(frame, inputRange, [enterFrom, '0px 0px', '0px 0px', exitTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
        }),
        scale: interpolate(frame, inputRange, [1.018, 1, 1, 0.988], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.4, 0, 0.2, 1)],
          output: 'perceptual-scale',
        }),
        filter: `blur(${interpolate(frame, inputRange, [5, 0, 0, 4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}px)`,
      }}
    >
      <CanvasImage
        src={staticFile(src)}
        width={1080}
        height={1080}
        style={{
          position: 'absolute',
          left: SOURCE_LEFT,
          top: 0,
          width: SOURCE_SIZE,
          height: SOURCE_SIZE,
        }}
      />
      <ScreenPrivacy kind={kind} />
    </Interactive.Div>
  );
};

type Tail = 'left' | 'right' | 'bottom' | 'top';

const MixedFontText: React.FC<{children: string}> = ({children}) => (
  <>
    {children.split(/([A-Za-z0-9][A-Za-z0-9 .#/+-]*)/u).map((part, index) => (
      <span
        // The text is static and the index remains stable for every render.
        key={`${part}-${index}`}
        style={{fontFamily: /[A-Za-z0-9]/u.test(part) ? 'Roobert, Arial, sans-serif' : 'MiSans, sans-serif'}}
      >
        {part}
      </span>
    ))}
  </>
);

const BubbleShell: React.FC<{
  name: string;
  text: React.ReactNode;
  left: number;
  top: number;
  opacity: number;
  scale: number;
  tail: Tail;
  tailOffset: number;
  width?: number;
  fontSize?: number;
}> = ({name, text, left, top, opacity, scale, tail, tailOffset, width, fontSize = 34}) => {
  const tailPosition =
    tail === 'left'
      ? {left: -9, top: tailOffset}
      : tail === 'right'
        ? {right: -9, top: tailOffset}
        : tail === 'top'
          ? {left: tailOffset, top: -9}
          : {left: tailOffset, bottom: -9};

  return (
    <Interactive.Div
      name={name}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        zIndex: 180,
        opacity,
        scale,
        transformOrigin:
          tail === 'left'
            ? '0% 50%'
            : tail === 'right'
              ? '100% 50%'
              : tail === 'top'
                ? `${tailOffset + 9}px 0%`
                : `${tailOffset + 9}px 100%`,
        padding: '20px 28px 21px',
        borderRadius: 22,
        backgroundColor: '#000000',
        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.22)',
        color: '#FFFFFF',
        fontFamily: 'MiSans, sans-serif',
        fontSize,
        fontWeight: 600,
        lineHeight: 1.18,
        letterSpacing: '-0.35px',
        textAlign: 'center',
        whiteSpace: width ? 'normal' : 'nowrap',
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
      <span style={{position: 'relative'}}>{typeof text === 'string' ? <MixedFontText>{text}</MixedFontText> : text}</span>
    </Interactive.Div>
  );
};

const ClickCallout: React.FC<{
  clickAt: number;
  text: string;
  left: number;
  top: number;
  tail: Tail;
  tailOffset: number;
}> = ({clickAt, text, left, top, tail, tailOffset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = clickAt - 74;
  const pop = spring({
    frame: frame - start,
    fps,
    durationInFrames: 24,
    config: {damping: 13, stiffness: 165, mass: 0.72},
  });

  return (
    <BubbleShell
      name={`Click callout · ${text}`}
      text={text}
      left={left}
      top={top}
      tail={tail}
      tailOffset={tailOffset}
      opacity={interpolate(frame, [start, start + 10, clickAt - 16, clickAt - 6], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
      })}
      scale={
        pop *
        interpolate(frame, [clickAt - 16, clickAt - 6], [1, 0.88], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.quad),
        })
      }
    />
  );
};

const InfoCallout: React.FC<{
  name: string;
  start: number;
  left: number;
  top: number;
  width?: number;
  tail: Tail;
  tailOffset: number;
  fontSize?: number;
  children: React.ReactNode;
}> = ({name, start, left, top, width, tail, tailOffset, fontSize, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const end = start + 68;
  const pop = spring({
    frame: frame - start,
    fps,
    durationInFrames: 24,
    config: {damping: 13, stiffness: 165, mass: 0.72},
  });

  return (
    <BubbleShell
      name={name}
      text={children}
      left={left}
      top={top}
      width={width}
      fontSize={fontSize}
      tail={tail}
      tailOffset={tailOffset}
      opacity={interpolate(frame, [start, start + 10, start + 58, end], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
      })}
      scale={
        pop *
        interpolate(frame, [start + 58, end], [1, 0.88], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.quad),
        })
      }
    />
  );
};

const QTap: React.FC<{clickAt: number; x: number; y: number}> = ({clickAt, x, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({
    frame: frame - (clickAt - 10),
    fps,
    durationInFrames: 10,
    config: {damping: 15, stiffness: 260, mass: 0.5},
  });
  const release = spring({
    frame: frame - clickAt,
    fps,
    durationInFrames: 18,
    config: {damping: 10, stiffness: 250, mass: 0.58},
  });
  const innerRelease = spring({
    frame: frame - (clickAt + 1),
    fps,
    durationInFrames: 17,
    config: {damping: 8, stiffness: 300, mass: 0.5},
  });
  const press = frame <= clickAt
    ? interpolate(frame, [clickAt - 5, clickAt], [1, 0.86], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad),
      })
    : 0.86 + release * 0.14;
  const innerPress = frame <= clickAt
    ? interpolate(frame, [clickAt - 5, clickAt], [1, 0.8], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.quad),
      })
    : 0.8 + innerRelease * 0.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        zIndex: 200,
        opacity: interpolate(frame, [clickAt - 10, clickAt - 6, clickAt + 10, clickAt + 18], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        scale: (0.68 + appear * 0.32) * press,
        borderRadius: '50%',
        backgroundColor: '#B9F4BA',
        boxShadow: '0 9px 22px rgba(12, 91, 55, 0.20)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 8,
          borderRadius: '50%',
          backgroundColor: '#00E000',
          scale: innerPress,
        }}
      />
    </div>
  );
};

const AudioLayer: React.FC = () => {
  const clickFrames = [100, 220, 340, 460, 884, 1004];

  return (
    <>
      <Audio
        name="Dynamic background music"
        src={staticFile('audio/dynamic-bed.wav')}
        durationInFrames={DURATION}
        volume={(frame) =>
          0.5 *
          interpolate(frame, [0, 45, 1170, 1220], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {clickFrames.map((clickFrame, index) => (
        <Sequence key={clickFrame} name={`Click sound ${index + 1}`} from={clickFrame} durationInFrames={31}>
          <Audio src={staticFile('audio/click-user.mp3')} volume={0.72} />
        </Sequence>
      ))}
      <Sequence name="Logo reveal sound" from={1204} durationInFrames={76}>
        <Audio src={staticFile('audio/logo-reveal.wav')} volume={0.72} />
      </Sequence>
    </>
  );
};

const TransferAddressbookFullSpec: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(180deg, #05E000 0%, #05D6A0 100%)',
      }}
    >
      <AudioLayer />
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
        name="Transfer address-book UI flow"
        style={{
          position: 'absolute',
          left: UI_LEFT,
          bottom: 0,
          width: UI_WIDTH,
          height: UI_HEIGHT,
          overflow: 'hidden',
          borderRadius: '92px 92px 0 0',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 -24px 90px rgba(0, 98, 55, 0.18), 0 -5px 24px rgba(0, 98, 55, 0.10)',
          transformOrigin: '50% 100%',
          opacity: interpolate(frame, [0, 18, 1198, 1224], [0, 1, 1, 0], {
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
        <ScreenState name="01 · Wallet home" src="transfer-addressbook/source-0.png" kind="home" inputRange={[0, 18, 106, 126]} enterFrom="0px 22px" />
        <ScreenState name="02 · Select asset" src="transfer-addressbook/source-1.5.png" inputRange={[106, 126, 226, 246]} />
        <ScreenState name="03 · Select network" src="transfer-addressbook/source-3.png" inputRange={[226, 246, 346, 366]} />
        <ScreenState name="04 · Recent addresses" src="transfer-addressbook/source-4.44.png" kind="recent" inputRange={[346, 366, 466, 486]} />
        <ScreenState name="05 · Pasted recipient" src="transfer-addressbook/source-6.png" kind="pasted" inputRange={[466, 486, 620, 638]} />
        <ScreenState name="06 · Address comparison" src="transfer-addressbook/source-7.5.png" kind="pasted" inputRange={[620, 638, 772, 790]} />
        <ScreenState name="07 · Open address book" src="transfer-addressbook/source-6.png" kind="pasted" inputRange={[772, 790, 890, 908]} />
        <ScreenState name="08 · Address book" src="transfer-addressbook/source-10.95.png" kind="address-book" inputRange={[890, 908, 1010, 1028]} />
        <ScreenState name="09 · Selected address" src="transfer-addressbook/source-12.5.png" kind="selected" inputRange={[1010, 1028, 1198, 1224]} />
      </Interactive.Div>

      <ClickCallout clickAt={100} text="发起一笔转账" left={140} top={552} tail="bottom" tailOffset={104} />
      <ClickCallout clickAt={220} text="选择 USDC" left={266} top={448} tail="left" tailOffset={24} />
      <ClickCallout clickAt={340} text="选择 BNB Chain" left={266} top={448} tail="left" tailOffset={24} />
      <ClickCallout clickAt={460} text="粘贴收款地址" left={578} top={495} tail="bottom" tailOffset={184} />
      <ClickCallout clickAt={884} text="试试地址簿功能" left={570} top={786} tail="bottom" tailOffset={190} />
      <ClickCallout clickAt={1004} text="找到保存的正确地址" left={198} top={860} tail="bottom" tailOffset={190} />

      <InfoCallout name="Insight · Similar address" start={510} left={250} top={550} tail="bottom" tailOffset={250}>
        看起来像同一个地址
      </InfoCallout>
      <InfoCallout name="Insight · One character differs" start={665} left={170} top={400} width={740} tail="bottom" tailOffset={360} fontSize={31}>
        <>
          <div>其实中间差了一位</div>
          <div style={{fontSize: 24, marginTop: 7}}>帮你检查粘贴或填写的地址有没有出错</div>
        </>
      </InfoCallout>
      <InfoCallout name="Insight · Address history" start={1050} left={560} top={420} tail="left" tailOffset={25}>
        地址簿 · 转账过
      </InfoCallout>
      <InfoCallout name="Insight · Whitelist" start={1128} left={174} top={650} width={732} tail="top" tailOffset={520} fontSize={30}>
        开启白名单后，只能转给账户和地址簿
      </InfoCallout>

      <QTap clickAt={100} x={264} y={691} />
      <QTap clickAt={220} x={228} y={556} />
      <QTap clickAt={340} x={225} y={560} />
      <QTap clickAt={460} x={786} y={613} />
      <QTap clickAt={884} x={786} y={900} />
      <QTap clickAt={1004} x={408} y={1005} />

      <AbsoluteFill
        name="OneKey App outro"
        style={{
          zIndex: 300,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(180deg, #05E000 0%, #05D6A0 100%)',
          opacity: interpolate(frame, [1198, 1224], [0, 1], {
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
            opacity: interpolate(frame, [1210, 1232], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }),
            scale: interpolate(frame, [1210, 1232, 1248], [0.82, 1.035, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              output: 'perceptual-scale',
            }),
            translate: interpolate(frame, [1210, 1232], ['0px 18px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TransferAddressbookFullSpecComposition: React.FC = () => (
  <Composition
    id="OneKeyTransferAddressbookFullSpecSquare"
    component={TransferAddressbookFullSpec}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1080}
  />
);
