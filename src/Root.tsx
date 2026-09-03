import "./index.css";
import { MyComposition } from "./Composition";
import {BulkSendMotionComposition} from './motion/MotionComposition';
import {BulkSendUIOnlyComposition} from './motion/UIOnlyComposition';
import {BulkSendTestSocialComposition} from './test-flow/TestFlowComposition';
import {BulkCopySocialComposition} from './bulk-copy/BulkCopyComposition';
import {TransferAddressbookPrivacyComposition} from './privacy-edit/TransferAddressbookPrivacyComposition';
import {TransferAddressbookFullSpecComposition} from './privacy-edit/TransferAddressbookFullSpecComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <TransferAddressbookFullSpecComposition />
      <TransferAddressbookPrivacyComposition />
      <BulkCopySocialComposition />
      <BulkSendTestSocialComposition />
      <BulkSendUIOnlyComposition />
      <BulkSendMotionComposition />
      <MyComposition />
    </>
  );
};
