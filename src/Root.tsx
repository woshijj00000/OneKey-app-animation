import "./index.css";
import { MyComposition } from "./Composition";
import {BulkSendMotionComposition} from './motion/MotionComposition';
import {BulkSendUIOnlyComposition} from './motion/UIOnlyComposition';
import {BulkSendTestSocialComposition} from './test-flow/TestFlowComposition';
import {BulkCopySocialComposition} from './bulk-copy/BulkCopyComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <BulkCopySocialComposition />
      <BulkSendTestSocialComposition />
      <BulkSendUIOnlyComposition />
      <BulkSendMotionComposition />
      <MyComposition />
    </>
  );
};
