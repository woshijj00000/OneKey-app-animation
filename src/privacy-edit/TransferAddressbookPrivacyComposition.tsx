import {Video} from '@remotion/media';
import {AbsoluteFill, Composition, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PRIVACY_MASK_COLOR, PRIVACY_MASK_RADIUS} from '../components/PrivacyMask';

const fps = 60;

type MaskRectangleProps = {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
};

const MaskRectangle: React.FC<MaskRectangleProps> = ({name, left, top, width, height, opacity}) => (
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
      opacity,
      pointerEvents: 'none',
    }}
  />
);

const PrivacyOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const recentListOpacity = interpolate(frame, [258, 268, 348, 356], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });

  // Starts after the old paste callout has cleared the address field.
  const pastedAddressOpacity = interpolate(frame, [354, 358, 646, 655], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });

  const largeComparisonCallout = interpolate(frame, [461, 468, 552, 563], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The address-book view gently pans upward, so the bars follow the rows.
  const addressBookListOpacity = interpolate(frame, [651, 658, 736, 744], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });
  const addressBookRowY = interpolate(frame, [658, 724], [828, 784], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const cryptoRowY = interpolate(frame, [658, 724], [1035, 991], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const savedAddressCallout = interpolate(frame, [678, 688, 731, 741], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const selectedAddressOpacity = interpolate(frame, [738, 747, 973, 982], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: [Easing.out(Easing.quad), Easing.linear, Easing.in(Easing.quad)],
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* Recent-address list: cover every visible line, including wrapped suffixes. */}
      <MaskRectangle
        name="Recent address · line 1"
        left={249}
        top={840}
        width={690}
        height={52}
        opacity={recentListOpacity}
      />
      <MaskRectangle
        name="Recent address · line 2"
        left={249}
        top={898}
        width={190}
        height={40}
        opacity={recentListOpacity}
      />
      <MaskRectangle
        name="Recent address · next row"
        left={249}
        top={1053}
        width={690}
        height={40}
        opacity={recentListOpacity}
      />

      {/* Pasted recipient: two bars match the wrapped address without covering callouts. */}
      <MaskRectangle
        name="Pasted recipient · line 1"
        left={165}
        top={386}
        width={771}
        height={44 - largeComparisonCallout * 12}
        opacity={pastedAddressOpacity}
      />
      <MaskRectangle
        name="Pasted recipient · line 2"
        left={165}
        top={430}
        width={205}
        height={40}
        opacity={pastedAddressOpacity * (1 - largeComparisonCallout)}
      />

      {/* Address-book list. During the green callout, only the exposed right side is covered. */}
      <MaskRectangle
        name="Saved address · line 1"
        left={249}
        top={addressBookRowY}
        width={690}
        height={41}
        opacity={addressBookListOpacity * (1 - savedAddressCallout)}
      />
      <MaskRectangle
        name="Saved address · callout top strip"
        left={249}
        top={addressBookRowY}
        width={690}
        height={32}
        opacity={addressBookListOpacity * savedAddressCallout}
      />
      <MaskRectangle
        name="Saved address · exposed right side"
        left={670}
        top={addressBookRowY}
        width={269}
        height={41}
        opacity={addressBookListOpacity * savedAddressCallout}
      />
      <MaskRectangle
        name="Saved address · line 2"
        left={249}
        top={addressBookRowY + 51}
        width={190}
        height={40}
        opacity={addressBookListOpacity * (1 - savedAddressCallout)}
      />
      <MaskRectangle
        name="Crypto address · list"
        left={249}
        top={cryptoRowY}
        width={690}
        height={41}
        opacity={addressBookListOpacity}
      />
      <MaskRectangle
        name="Crypto address · list line 2"
        left={249}
        top={cryptoRowY + 47}
        width={690}
        height={40}
        opacity={addressBookListOpacity}
      />

      {/* Selected address screen. */}
      <MaskRectangle
        name="Selected recipient · line 1"
        left={165}
        top={313}
        width={771}
        height={43}
        opacity={selectedAddressOpacity}
      />
      <MaskRectangle
        name="Selected recipient · line 2"
        left={165}
        top={356}
        width={208}
        height={42}
        opacity={selectedAddressOpacity}
      />
      <MaskRectangle
        name="Selected Crypto address · line 1"
        left={249}
        top={852}
        width={690}
        height={42}
        opacity={selectedAddressOpacity}
      />
      <MaskRectangle
        name="Selected Crypto address · line 2"
        left={249}
        top={899}
        width={690}
        height={39}
        opacity={selectedAddressOpacity}
      />

      {/* Re-create the original click ring above the new solid mask. */}
      <div
        style={{
          position: 'absolute',
          left: 390 - 29,
          top: 994 - 29,
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: '4px solid #00E40B',
          boxSizing: 'border-box',
          opacity: interpolate(frame, [716, 722, 741, 749], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [716, 725, 739, 749], [0.62, 0.82, 1.08, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          }),
          boxShadow: '0 0 0 10px rgba(0, 228, 11, 0.10)',
        }}
      />
    </AbsoluteFill>
  );
};

const TransferAddressbookPrivacyEdit: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#00E79B'}}>
    <Video
      name="Original OneKey transfer video"
      src={staticFile('source/onekey-transfer-addressbook-zh-v22-final.mp4')}
      style={{width: '100%', height: '100%'}}
    />
    <PrivacyOverlay />
  </AbsoluteFill>
);

export const TransferAddressbookPrivacyComposition: React.FC = () => (
  <Composition
    id="OneKeyTransferAddressbookPrivacySquare"
    component={TransferAddressbookPrivacyEdit}
    durationInFrames={1083}
    fps={fps}
    width={1080}
    height={1080}
  />
);
