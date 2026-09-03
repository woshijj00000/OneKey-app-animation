# OneKey UI 社媒动画复用手册

这是一套基于 Remotion 的 OneKey UI 操作演示模板。当前主版本使用界面截图制作动画，不重绘或修改截图中的 UI，适合复用到 Bulk Send、Swap、Receive、设置流程等产品功能演示。

## 1. 当前模板规格

- 画布：1080 × 1080
- 帧率：60fps
- 当前时长：12 秒（720 帧）
- 背景：固定使用 `public/source/onekey-gradient-39db00-00c9a5.png`，由顶部 `#39DB00` 渐变到底部 `#00C9A5`
- 界面：水平居中，顶部距离画布 160px，顶部圆角 100px，无真实手机外框
- 点击效果：浅绿色外圆、绿色内圆、双层错峰弹簧回弹，无发散元素
- 重点气泡：点击前在目标附近 Q 弹出现，使用小尖角指向目标
- 结尾：OneKey Logo
- 主合成：`BulkSendTestSocialSquare`
- 主源码：`src/test-flow/TestFlowComposition.tsx`
- 默认输出：`out/bulk-send-test-social.mp4`

### 固定品牌版式规则

所有新 Composition 必须导入 `src/config/onekeyBrandRules.ts`，不要在各自文件中重新猜测或定义以下数值：

- 背景底图：`public/source/onekey-gradient-39db00-00c9a5.png`。
- UI：`left: 144px`、`top: 160px`、`width: 792px`、`height: 950px`、顶部圆角 `100px`。
- 结尾 Logo：`public/brand/onekey-app-user-fixed.png`，固定为 `left: 190px`、`top: 465px`、`width: 700px`、`height: 143px`。Logo 只能淡入淡出，不做位移和缩放。
- 气泡：底色及尖角统一为 `#031F00`，文字统一为 `#DBFFD7`；替换旧气泡时必须连同旧底色、尖角和阴影一起完全覆盖。

## 2. 项目中最重要的文件

```text
bulk-send-square-template/
├── public/
│   ├── test-flow/                  # 当前流程截图 p1.png～p7.png
│   ├── brand/
│   │   └── onekey-user-outro.png  # 结尾 Logo
│   └── audio/                      # 点击、背景音乐与 Logo 音效
├── src/
│   ├── test-flow/
│   │   └── TestFlowComposition.tsx # 主动画、滚动、点击和转场
│   ├── components/
│   │   └── PrivacyMask.tsx          # 浅灰色圆角隐私遮罩
│   └── Root.tsx                    # Remotion 合成注册入口
├── out/                            # 导出的视频
├── package.json                    # 预览和导出命令
└── REUSE_GUIDE_ZH.md               # 本文档
```

`public/figma/`、`src/motion/` 和其他合成是早期参考版本。制作新的截图流程时，优先修改 `public/test-flow/` 和 `src/test-flow/TestFlowComposition.tsx`。

## 3. 第一次使用

### 3.1 准备环境

安装以下软件：

- Node.js 当前 LTS 版本
- npm
- Chrome 或 Chromium（Remotion 渲染时使用）

### 3.2 安装依赖

在终端进入项目目录：

```bash
cd "/Users/jiangjie/Documents/ChatGPT/animation/bulk-send-square-template"
npm install
```

如果项目通过压缩包交给其他人，对方需要把上面的路径替换为自己的实际目录。

### 3.3 打开预览

```bash
npm run dev
```

浏览器打开 Remotion Studio 后，选择：

```text
BulkSendTestSocialSquare
```

可以拖动时间轴，检查每次页面切换、滚动和点击位置。

### 3.4 导出视频

先检查代码：

```bash
npm run lint
```

再导出：

```bash
npm run render:test-flow
```

导出结果：

```text
out/bulk-send-test-social.mp4
```

如果不想覆盖上一个版本，可以使用自定义文件名：

```bash
npx remotion render BulkSendTestSocialSquare out/bulk-send-v2.mp4
```

## 4. 制作一个新 UI 流程

### 第一步：准备完整截图

每个交互状态准备一张 PNG：

- 页面必须从顶部开始，不要提前裁到按钮附近。
- 长页面保留完整内容和底部按钮，模板会通过滚动显示按钮。
- 同一流程的截图保持相同宽度和比例。
- 不要把鼠标、点击圆点或说明文字画进截图。
- 图片尽量使用 Figma 原始导出，不要使用聊天软件压缩后的图片。

#### 隐私打码规则

当截图包含地址、账号、余额、姓名或其他不应公开的信息时，使用浅灰色圆角矩形完整覆盖敏感区域。

- 统一使用 `src/components/PrivacyMask.tsx`。
- 默认填充色为 `#F1F1F3`，默认圆角为 `10px`。
- 遮罩必须完全不透明，不使用模糊、马赛克、黑条、描边、阴影或渐变。
- 遮罩四周至少比敏感文字多覆盖 `6px`，避免字形边缘或末尾字符泄露。
- 单行信息使用一个圆角矩形；多行信息应按行分别覆盖，不要无意义地遮住大面积 UI。
- 遮罩应位于 UI 截图之上、点击圆点和气泡之下。
- 页面滚动时，遮罩必须与被遮挡内容保持相同位移，不能固定在画布上漂移。
- 页面转场时，遮罩跟随所属页面一起进入和退出，不单独做动画。

基础用法：

```tsx
import {PrivacyMask} from '../components/PrivacyMask';

<PrivacyMask
  name="Mask · Wallet address"
  left={324}
  top={524}
  width={562}
  height={28}
/>
```

如果页面存在滚动，应把遮罩与截图放进同一个带有 `scrollOffset` 的容器，或让遮罩的 `top` 使用完全相同的滚动偏移。遮罩坐标以截图原始内容为准，不要在滚动结束后重新猜测画布坐标。

当前 Bulk Send 流程：

| 文件 | 页面状态 | 操作 |
|---|---|---|
| `p1.png` | Wallet 首页 | 点击右上角九宫格 |
| `p2.png` | 设置页顶部 | 向下滚动 |
| `p3.png` | 设置页 Bulk Send 区域 | 点击 Bulk Send |
| `p4.png` | Bulk Send 类型选择 | 点击 One to Many |
| `p5.png` | 地址输入页面 | 从顶部滚到 Next，点击 Next |
| `p6.png` | 金额与交易详情 | 从顶部滚到 Next，点击 Next |
| `p7.png` | Review transaction | 从顶部滚到 Confirm，点击 Confirm |

### 第二步：替换素材

把新截图放入：

```text
public/test-flow/
```

最简单的方式是继续使用 `p1.png`～`p7.png` 命名并覆盖旧截图。这样不需要修改图片路径。

如果页面数量不同，需要在 `TestFlowComposition.tsx` 中增加或删除对应的 `<ScreenState />`。

### 第三步：检查图片显示尺寸

每个 `<ScreenState />` 都有：

```tsx
imageHeight={1645}
```

它表示截图在 760px 宽界面容器中的显示高度。新截图比例改变时，需要按下面公式计算：

```text
显示高度 = 760 × 原图高度 ÷ 原图宽度
```

例如原图为 544 × 1178：

```text
760 × 1178 ÷ 544 ≈ 1645
```

### 第四步：设置页面出现和退出时间

每个页面都有四个时间点：

```tsx
inputRange={[进入开始, 完全显示, 退出开始, 完全退出]}
```

例如：

```tsx
inputRange={[210, 224, 350, 364]}
```

含义：

- 210 帧：页面开始进入
- 224 帧：页面完全显示
- 350 帧：点击发生，同时开始退出
- 364 帧：页面完全退出

注意：四个数字必须严格递增，不能出现相同数字，否则 Remotion 会报 `inputRange must be strictly monotonically increasing`。

60fps 下的换算方式：

```text
帧数 = 秒数 × 60
```

### 第五步：设置从顶部到按钮的滚动

长页面使用：

```tsx
offsetRange={[0, -650]}
scrollRange={[224, 336]}
```

含义：

- `offsetRange` 的 `0` 表示从截图顶部开始。
- `-650` 表示最终向上移动 650px，露出下方按钮。
- `scrollRange` 表示滚动从 224 帧开始，到 336 帧结束。

对应点击应放在滚动结束之后，例如：

```tsx
clickAt={350}
```

推荐规则：

- 页面完全显示后立即开始滚动。
- 根据页面内容长度分配滚动时间，不必套用固定秒数。
- 按钮完整进入画面后再点击。
- 滚动结束与点击之间保留约 6～14 帧即可，避免明显停顿。
- 不要通过裁掉截图顶部来直接显示按钮。

### 第六步：设置点击位置和时间

所有点击配置集中在：

```tsx
const ReferenceClickLayer = ...
```

示例：

```tsx
<ReferencePointerCue
  clickAt={350}
  color={color}
  ringColor={ringColor}
  x={540}
  y={966}
/>
```

参数说明：

- `clickAt`：发生点击的帧数。
- `x`：点击在 1080px 画布中的横坐标。
- `y`：点击在 1080px 画布中的纵坐标。
- `color`：内圆和短射线颜色。
- `ringColor`：外圆颜色。

界面容器从画布左侧 160px 开始，宽度为 760px。如果先在截图内部测量坐标，可以使用：

```text
画布 x = 160 + 截图容器内 x
```

页面转场的退出帧和 `clickAt` 应使用同一时间点。这样点击发生时新页面立即开始进入，不会产生“点完以后画面停住”的感觉。

### 第七步：设置重点文案气泡

重点气泡用于解释即将点击的功能。默认样式为 OneKey 黑底、白字、Roobert SemiBold，并与绿色点击效果形成对比。

规则：

- 每个气泡只写一个重点，英文优先控制在 2～4 个词。
- 气泡应放在点击目标附近，但不能覆盖目标本身。
- 小尖角必须指向对应点击位置。
- 优先放在目标上方；上方空间不足时再放到左侧或右侧。
- 气泡必须先于点击动作独立出现，并在点击前完成回弹退场。
- 点击发生时画面中不得保留气泡；气泡完全消失后，绿色圆点直接在点击位置显现并完成点击。
- 气泡完整显示后停留 0.8 秒，让观众能看清内容，再进入消失阶段。
- 气泡完全消失后等待 0.1 秒，再让绿色圆点在点击位置原地显现、点击并消失。
- 点击后不添加放射线、扩散圆环或外溢光圈，只保留圆点自身的按压回弹。
- 点击圆点使用双层错峰弹簧：外圈轻压，内圈压缩更深并延迟 1 帧回弹，使触感更自然、Q 弹。
- `Export` 与 `Copy` 属于连续操作步骤，本示例不显示气泡，直接执行点击特效。
- 画面同时只显示一个气泡。
- 气泡文案不得重复截图中已经非常清楚的长段说明。
- 英文气泡统一使用 Roobert SemiBold，中文气泡统一使用 MiSans SemiBold；组件会按文案内容自动选择字体。
- 点击后先保留 4～5 帧按压反馈，再以约 0.4 秒的轻微缩放、运动模糊和交叉滑入完成页面切换。
- 延长的是运动过程，不增加点击前后的静止等待。

Bulk Copy Addresses 的气泡文案可以直接在 Remotion Studio 中修改：

```tsx
showCallouts: true,
calloutSelectAccount: 'Select an account',
calloutMoreOptions: 'More options',
calloutBulkCopy: 'Bulk copy addresses',
```

不需要气泡时，将 `showCallouts` 设置为 `false`。位置与尖角方向集中在 `CalloutLayer` 中，通过 `left`、`top`、`tail` 和 `tailOffset` 调整。

### 第八步：更换结尾 Logo

替换文件：

```text
public/brand/onekey-user-outro.png
```

建议使用透明背景 PNG，并保留文件名。Logo 的大小和进场时间在 `OneKey App outro` 代码区域修改。

### 第九步：修改颜色

在 `BulkSendTestSocialComposition` 的 `defaultProps` 中修改：

```tsx
backgroundTop: '#05E000',
backgroundBottom: '#05D6A0',
tapColor: '#00E000',
tapRingColor: '#B9F4BA',
```

分别对应背景上方颜色、背景下方颜色、点击内圆颜色、点击外圆颜色。

Bulk Copy Addresses 合成还提供三项音量参数：

```tsx
backgroundMusicVolume: 0.50,
clickSoundVolume: 0.72,
logoSoundVolume: 0.72,
```

声音素材位于 `public/audio/`。当前点击音效为 `click-user.mp3`，动感背景音乐为 `dynamic-bed.wav`，Logo 出现音效为 `logo-reveal.wav`。将某项音量设为 `0` 即可关闭该声音。

### 第十步：修改总时长

主合成当前设置：

```tsx
durationInFrames={720}
fps={60}
```

720 帧 ÷ 60fps = 12 秒。

修改时要确保总帧数晚于最后一个 Logo 动画关键帧，否则结尾会被截断。

## 5. 推荐的工作顺序

每次制作新流程都按下面顺序操作：

1. 确认界面跳转顺序。
2. 导出每个完整页面状态。
3. 替换 `public/test-flow/` 中的截图。
4. 在 Remotion Studio 中先检查页面是否完整。
5. 设置每个页面的进入和退出时间。
6. 为长页面设置从顶部开始的滚动。
7. 按滚动后按钮的实际位置校准点击坐标。
8. 检查点击与页面转场是否同帧发生。
9. 校对每个气泡的文案、位置和尖角方向。
10. 检查敏感信息遮罩是否完整覆盖并正确跟随滚动。
11. 检查 Logo 结尾。
12. 运行 `npm run lint`。
13. 按 `REVIEW_CHECKLIST_ZH.md` 渲染代表性关键帧并完成 Review Gate A。
14. 任一项目失败时修正并重新执行 Gate A。
15. Gate A 全部通过后运行 `npm run render:test-flow`，或运行当前 Composition 对应的渲染命令。
16. 检查视频媒体信息，并用普通播放器从头到尾观看实际导出文件。
17. 完成 Review Gate B；两道 Gate 全部通过后才交付。
18. 在交付信息中附上 Review 结果和修正记录。

## 6. 交付前检查清单

以下为快速清单；正式 Review 必须使用 `REVIEW_CHECKLIST_ZH.md`，并同时通过正式渲染前的 Gate A 与正式渲染后的 Gate B。

- [ ] 输出为 1080 × 1080。
- [ ] 帧率为 60fps。
- [ ] 没有额外介绍文字。
- [ ] 没有真实手机外框。
- [ ] UI 截图没有被重新设计或变形。
- [ ] 所有长页面都从顶部开始。
- [ ] 按钮完整出现后才点击。
- [ ] 点击位置准确。
- [ ] 点击后页面立即切换，没有明显停顿。
- [ ] 点击效果颜色为 OneKey 绿色。
- [ ] 气泡文案简短，并且没有遮挡点击目标。
- [ ] 气泡尖角准确指向对应点击位置。
- [ ] 所有敏感信息都使用不透明浅灰色圆角矩形完整覆盖。
- [ ] 遮罩在滚动和转场中始终跟随对应内容，没有漂移或露出原文。
- [ ] 结尾 Logo 正确。
- [ ] 视频在 QuickTime、IINA 或 VLC 中能完整播放。
- [ ] 已附上 Review 结果、媒体规格、音轨状态、`N/A` 项和修正记录。

## 7. 常见问题

### 按钮只显示一半

检查以下三项：

1. 截图是否保留完整页面和底部按钮。
2. `offsetRange` 的负值是否足够大。
3. 点击时间是否晚于 `scrollRange` 的结束时间。

### 页面直接从中间出现

进入时的 `offsetRange` 必须从 `0` 开始：

```tsx
offsetRange={[0, -650]}
```

不要把两个值都写成负数，也不要提前裁掉截图顶部。

### 视频看起来停顿

检查：

- 滚动结束与点击之间是否留了过多帧。
- 点击后旧页面是否立即退出。
- 下一页面是否在相同的 `clickAt` 帧开始进入。
- 点击层是否在目标位置直接显现并及时触发。

当前模板的原则是：圆点在目标位置显现、点击、旧页面退出、新页面进入连续衔接，不添加跨屏移动。

### 点击位置不准确

点击坐标使用整个 1080 × 1080 画布，不是原始截图坐标。界面左边距是 160px，需要加到截图容器内的横坐标上。

### 替换截图后比例变形

重新计算 `imageHeight`，不要强行沿用 1645。所有截图的 `width` 保持 760。

### 导出覆盖了旧视频

使用不同输出名：

```bash
npx remotion render BulkSendTestSocialSquare out/功能名-v2.mp4
```

## 8. 可直接复制给 Codex 的任务模板

```text
读取这个文件夹里的完整 UI 截图，并基于现有
BulkSendTestSocialSquare 模板制作一个新的 OneKey 1080×1080 社媒动画。

要求：
1. 不重新设计 UI，直接使用截图。
2. 不使用真实手机外框，不出现说明文字。
3. 界面底部对齐，背景保持 OneKey 绿色渐变。
4. 长页面必须从顶部开始，连续滚动到按钮完整出现后再点击。
5. 点击效果沿用 ReferencePointerCue：浅绿外圆、绿色内圆、双层错峰弹簧回弹，不使用发散元素。
6. 点击发生时旧页面立即退出，新页面立即进入，不要加入停顿。
7. 结尾使用 public/brand/onekey-user-outro.png。
8. 根据截图内容安排节奏，不强制套用其他参考视频的秒数。
9. 敏感信息使用 #F1F1F3 不透明圆角矩形覆盖，遮罩跟随对应页面滚动和转场。
10. 完成后先按照 REVIEW_CHECKLIST_ZH.md 完成 Gate A；全部通过后才能渲染完整 MP4。
11. 渲染后从头到尾观看成品并完成 Gate B，检查 1080×1080、60fps、完整时长和音轨。
12. 只有两道 Gate 都通过后才交付，并附上 Review 结果和修正记录。

界面顺序：
[在这里填写 p1 → p2 → p3 的点击和跳转逻辑]
```

## 9. 建议的交付内容

交给下一位制作者时，建议包含：

- 完整的 `bulk-send-square-template` 项目文件夹
- 本复用手册
- 最新截图原文件
- 已导出的 MP4 示例
- 一份文字版交互顺序
- Logo 和品牌颜色说明

不要只发送 MP4；MP4 不能直接修改页面顺序、滚动距离和点击位置。
