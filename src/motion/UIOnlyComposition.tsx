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
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const bulkSendUIOnlySchema = z.object({
  backgroundTop: zColor(),
  backgroundBottom: zColor(),
  tapColor: zColor(),
  tapRingColor: zColor(),
  interfaceScale: z.number().min(0.82).max(1.05),
  showTapEffects: z.boolean(),
  showLogoOutro: z.boolean(),
});

type BulkSendUIOnlyProps = z.infer<typeof bulkSendUIOnlySchema>;

const StateImage: React.FC<{
  src: string;
  name: string;
  inputRange: [number, number, number, number];
  translateFrom?: string;
  translateTo?: string;
  scaleFrom?: number;
  scaleTo?: number;
  clipTop?: number;
}> = ({
  src,
  name,
  inputRange,
  translateFrom = '0px 22px',
  translateTo = '0px 0px',
  scaleFrom = 1.018,
  scaleTo = 1,
  clipTop,
}) => {
  const frame = useCurrentFrame();

  return (
    <CanvasImage
      name={name}
      src={staticFile(src)}
      width={760}
      height={984}
      style={{
        position: 'absolute',
        inset: 0,
        width: 760,
        height: 984,
        opacity: interpolate(frame, inputRange, [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: [
            Easing.bezier(0.16, 1, 0.3, 1),
            Easing.linear,
            Easing.bezier(0.16, 1, 0.3, 1),
          ],
        }),
        scale: interpolate(frame, [inputRange[0], inputRange[1]], [scaleFrom, scaleTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          output: 'perceptual-scale',
        }),
        translate: interpolate(frame, [inputRange[0], inputRange[1]], [translateFrom, translateTo], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        clipPath:
          clipTop === undefined
            ? 'inset(0% 0% 0% 0%)'
            : `inset(${interpolate(frame, [inputRange[0], inputRange[1]], [clipTop, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}% 0% 0% 0%)`,
      }}
    />
  );
};

const PointerCue: React.FC<{clickAt: number; color: string; ringColor: string; x: number; y: number}> = ({
  clickAt,
  color,
  ringColor,
  x,
  y,
}) => {
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
  const pressScale = interpolate(
    frame,
    [clickAt - 5, clickAt, clickAt + 6, clickAt + 15],
    [1, 0.78, 1.09, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      output: 'perceptual-scale',
    },
  );
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
    <div
      style={{
        position: 'absolute',
        left: x - 2,
        top: y - 2,
        width: 1,
        height: 1,
        opacity: visibility,
        zIndex: 40,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -38,
          top: -38,
          width: 76,
          height: 76,
          opacity: burstOpacity,
          scale: burstScale,
        }}
      >
        {Array.from({length: 10}).map((_, index) => (
          <div
            // The rays are deliberately short and asymmetric, matching the snappy reference click.
            key={index}
            style={{
              position: 'absolute',
              left: 36,
              top: 2,
              width: index % 2 === 0 ? 4 : 3,
              height: index % 2 === 0 ? 15 : 10,
              borderRadius: 4,
              backgroundColor: color,
              transformOrigin: `2px ${36}px`,
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

const FigmaScrollState: React.FC<{
  topSrc: string;
  bottomSrc: string;
  name: string;
  inputRange: [number, number, number, number];
  scrollRange: [number, number];
}> = ({topSrc, bottomSrc, name, inputRange, scrollRange}) => {
  const frame = useCurrentFrame();
  const stateOpacity = interpolate(frame, inputRange, [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.16, 1, 0.3, 1)],
  });
  const scroll = interpolate(frame, scrollRange, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: stateOpacity,
      }}
    >
      <CanvasImage
        name={`${name} · top`}
        src={staticFile(topSrc)}
        width={760}
        height={984}
        style={{
          position: 'absolute',
          inset: 0,
          width: 760,
          height: 984,
          opacity: 1 - scroll,
          translate: `0px ${-70 * scroll}px`,
        }}
      />
      <CanvasImage
        name={`${name} · scrolled`}
        src={staticFile(bottomSrc)}
        width={760}
        height={984}
        style={{
          position: 'absolute',
          inset: 0,
          width: 760,
          height: 984,
          opacity: scroll,
          translate: `0px ${70 * (1 - scroll)}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: 180 + scroll * 560,
          width: 4,
          height: 82,
          borderRadius: 3,
          backgroundColor: 'rgba(94,94,94,0.28)',
          opacity: interpolate(scroll, [0, 0.15, 0.86, 1], [0, 0.75, 0.75, 0]),
        }}
      />
    </div>
  );
};

const ExtendedScrollState: React.FC<{
  src: string;
  name: string;
  inputRange: [number, number, number, number];
  scrollRange: [number, number];
  kind: 'amount' | 'review';
}> = ({src, name, inputRange, scrollRange, kind}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, inputRange, [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.bezier(0.16, 1, 0.3, 1)],
  });
  const offset = interpolate(frame, scrollRange, [0, kind === 'amount' ? -300 : -330], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const buttonLabel = kind === 'amount' ? 'Next' : 'Confirm';

  return (
    <div style={{position: 'absolute', inset: 0, opacity, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 760, height: 1360, translate: `0px ${offset}px`}}>
        <CanvasImage
          name={`${name} · full Figma top`}
          src={staticFile(src)}
          width={760}
          height={984}
          style={{position: 'absolute', inset: 0, width: 760, height: 984}}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 980,
            width: 760,
            height: 380,
            backgroundColor: '#FFFFFF',
            color: '#202124',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {kind === 'amount' ? (
            <>
              <div style={{position: 'absolute', left: 39, top: 8, fontSize: 28, color: '#656565'}}>0xd2e3...4f5E</div>
              <div style={{position: 'absolute', right: 39, top: 8, fontSize: 28, color: '#00895E'}}>+0.2 ETH</div>
              <div style={{position: 'absolute', left: 39, top: 70, fontSize: 24, color: '#656565'}}>Total amount</div>
              <div style={{position: 'absolute', right: 39, top: 70, fontSize: 27}}>0.2 ETH ($400)</div>
            </>
          ) : (
            <>
              <div style={{position: 'absolute', left: 39, top: 4, fontSize: 27, color: '#656565'}}>0x5e6f...7g8H</div>
              <div style={{position: 'absolute', right: 39, top: 4, fontSize: 27}}>-0.1 ETH</div>
              <div style={{position: 'absolute', left: 39, top: 66, fontSize: 30, fontWeight: 650}}>Receiving address (1)</div>
              <div style={{position: 'absolute', left: 39, top: 118, fontSize: 27, color: '#656565'}}>0xd2e3...4f5E</div>
              <div style={{position: 'absolute', right: 39, top: 118, fontSize: 27, color: '#00895E'}}>+0.2 ETH</div>
            </>
          )}
          <div
            style={{
              position: 'absolute',
              left: 39,
              top: 222,
              width: 682,
              height: 98,
              borderRadius: 49,
              backgroundColor: '#111111',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: '-0.3px',
            }}
          >
            {buttonLabel}
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: interpolate(-offset, [0, 330], [180, 740], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          width: 4,
          height: 82,
          borderRadius: 3,
          backgroundColor: 'rgba(94,94,94,0.28)',
          opacity: interpolate(-offset, [0, 35, 290, 330], [0, 0.75, 0.75, 0]),
        }}
      />
    </div>
  );
};

export const BulkSendUIOnly: React.FC<BulkSendUIOnlyProps> = ({
  backgroundTop,
  backgroundBottom,
  tapColor,
  tapRingColor,
  interfaceScale,
  showTapEffects,
  showLogoOutro,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

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
          width: 700,
          height: 700,
          borderRadius: '50%',
          left: -330,
          top: -360,
          backgroundColor: '#C8FF45',
          filter: 'blur(130px)',
          opacity: 0.2,
          translate: interpolate(frame, [0, durationInFrames], ['0px 0px', '160px 120px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 760,
          borderRadius: '50%',
          right: -390,
          bottom: -420,
          backgroundColor: '#00CFA0',
          filter: 'blur(140px)',
          opacity: 0.18,
        }}
      />

      <Interactive.Div
        name="Original Figma UI"
        style={{
          position: 'absolute',
          left: 160,
          bottom: 0,
          width: 760,
          height: 984,
          borderRadius: '92px 92px 0 0',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 -24px 90px rgba(0,98,55,0.18), 0 -5px 24px rgba(0,98,55,0.1)',
          transformOrigin: '50% 100%',
          scale:
            interfaceScale *
            interpolate(frame, [0, 45, durationInFrames - 45, durationInFrames], [0.94, 1, 1, 0.97], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: 'perceptual-scale',
            }),
          opacity: interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <StateImage
          name="Figma · Wallet home"
          src="figma/home.png"
          inputRange={[0, 30, 105, 135]}
          translateFrom="0px 0px"
          scaleFrom={1.04}
          scaleTo={1}
        />
        <StateImage
          name="Figma · Settings"
          src="figma/settings.png"
          inputRange={[105, 135, 195, 225]}
          translateFrom="34px 0px"
        />
        <StateImage
          name="Figma · Select bulk send type"
          src="figma/type.png"
          inputRange={[195, 230, 300, 335]}
          translateFrom="0px 34px"
          scaleFrom={1}
          scaleTo={1}
          clipTop={78}
        />
        <FigmaScrollState
          name="Figma · Address input"
          topSrc="figma/address-top-full.png"
          bottomSrc="figma/address-bottom-full.png"
          inputRange={[300, 335, 455, 495]}
          scrollRange={[382, 424]}
        />
        <ExtendedScrollState
          name="Figma · Amount input"
          src="figma/amount-full.png"
          inputRange={[455, 495, 610, 650]}
          scrollRange={[530, 572]}
          kind="amount"
        />
        <ExtendedScrollState
          name="Figma · Review transaction"
          src="figma/review-full.png"
          inputRange={[610, 650, 750, 790]}
          scrollRange={[675, 717]}
          kind="review"
        />
        <StateImage
          name="Figma · Send result"
          src="figma/result.png"
          inputRange={[750, 790, 885, 900]}
          translateFrom="0px 38px"
          scaleFrom={1.025}
          scaleTo={1}
        />

        {showTapEffects ? (
          <>
            <PointerCue clickAt={92} color={tapColor} ringColor={tapRingColor} x={700} y={174} />
            <PointerCue clickAt={184} color={tapColor} ringColor={tapRingColor} x={470} y={312} />
            <PointerCue clickAt={286} color={tapColor} ringColor={tapRingColor} x={380} y={694} />
            <PointerCue clickAt={440} color={tapColor} ringColor={tapRingColor} x={380} y={889} />
            <PointerCue clickAt={598} color={tapColor} ringColor={tapRingColor} x={380} y={878} />
            <PointerCue clickAt={738} color={tapColor} ringColor={tapRingColor} x={380} y={872} />
          </>
        ) : null}
      </Interactive.Div>

      {showLogoOutro ? (
        <AbsoluteFill
          name="OneKey Logo Outro"
          style={{
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
            opacity: interpolate(frame, [810, 840], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            }),
          }}
        >
          <CanvasImage
            name="User-provided OneKey Logo"
            src={staticFile('brand/onekey-user-outro.png')}
            width={720}
            height={290}
            style={{
              width: 720,
              height: 290,
              opacity: interpolate(frame, [833, 854], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              }),
              scale: interpolate(frame, [833, 854, 870], [0.82, 1.035, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                output: 'perceptual-scale',
              }),
              translate: interpolate(frame, [833, 854], ['0px 18px', '0px 0px'], {
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

export const BulkSendUIOnlyComposition: React.FC = () => (
  <Composition
    id="BulkSendFigmaUIOnlySquare"
    component={BulkSendUIOnly}
    durationInFrames={900}
    fps={60}
    width={1080}
    height={1080}
    schema={bulkSendUIOnlySchema}
    defaultProps={{
      backgroundTop: '#05E000',
      backgroundBottom: '#05D6A0',
      tapColor: '#00E000',
      tapRingColor: '#B9F4BA',
      interfaceScale: 1,
      showTapEffects: true,
      showLogoOutro: true,
    }}
  />
);
