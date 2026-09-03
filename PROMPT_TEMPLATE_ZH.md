# OneKey App Animation · Codex 任务模板

请先完整阅读 `README.md`、`REUSE_GUIDE_ZH.md`、`REVIEW_CHECKLIST_ZH.md` 和根目录 `AGENTS.md`，然后检查现有 Remotion 项目。

我要基于当前 OneKey UI 社媒动画模板制作一个新流程。

## 固定要求

- 输出 1080 × 1080、60fps。
- 固定使用 `public/source/onekey-gradient-39db00-00c9a5.png` 作为背景底图，其颜色由顶部 `#39DB00` 渐变到底部 `#00C9A5`，不要用近似 CSS 渐变或其他图片替代。
- UI 固定为 `left: 144px`、`top: 160px`、`width: 792px`、`height: 950px`，水平居中，顶部圆角固定为 `100px`，不添加真实手机外框。
- 不重绘或改变截图中的 UI 样式。
- 如截图包含敏感信息，使用 `PrivacyMask` 以 `#F1F1F3` 不透明浅灰色圆角矩形完整覆盖；不使用模糊、马赛克、黑条、描边或阴影，遮罩必须跟随所属页面滚动和转场。
- 按钮不在可视区域时，从页面顶部连续滚动到可点击位置。
- 沿用现有绿色圆形点击动画。
- 在需要强调的点击位置加入重点文案气泡：短句、单行优先、小尖角指向目标、Q 弹进出场，且不遮挡按钮。
- 动画顺序必须是“气泡出现并完全消失 → 绿色圆点在点击位置原地显现并点击”；圆点不得从屏幕边缘或底部移动进入，点击发生时不显示气泡。
- 点击后不显示放射线、扩散圆环或外溢光圈，仅保留圆点自身的按压回弹与消失。
- 点击圆点使用双层错峰弹簧：外圈轻压、内圈更深压缩并稍晚回弹，避免僵硬的同步线性缩放。
- 气泡完整显示后停留 0.8 秒，完全消失后等待 0.1 秒再启动点击动作；`Export` 和 `Copy` 点击不显示气泡文案。
- 英文气泡使用 Roobert SemiBold，中文气泡使用 MiSans SemiBold。
- 气泡底色及尖角统一为 `#031F00`，文字统一为 `#DBFFD7`；必须完全覆盖旧气泡颜色、尖角和阴影，不能出现双色重叠。
- 点击后保留短促的按压反馈，再用约 0.4 秒的缩放、轻微运动模糊和交叉滑入切换页面；延长运动过程，但不要增加静止停顿。
- 点击音效沿用 `public/audio/click-user.mp3`。
- 背景音乐沿用 `public/audio/dynamic-bed.wav`。
- 结尾固定使用 `public/brand/onekey-app-user-fixed.png`，位置和尺寸固定为 `left: 190px`、`top: 465px`、`width: 700px`、`height: 143px`。Logo 只做透明度动画，不允许位移或缩放，并保留 Logo 出现音效。
- 页面切换保持连续流畅，不添加静止停顿。

## 强制 Review Gate

- 正式渲染前，必须按照 `REVIEW_CHECKLIST_ZH.md` 完成 Gate A：渲染并检查每个页面、滚动、气泡、点击、转场、隐私遮罩和 Logo 的代表性关键帧。
- 任一适用项目为 `FAIL` 时，先修正并重新 Review；不能带着已知问题继续交付。
- Gate A 全部通过后才渲染完整 MP4。
- 完整渲染后，必须完成 Gate B：检查媒体规格、音轨，并从头到尾观看实际导出的 MP4。
- 只有 Gate A 和 Gate B 都为 `PASS` 时才算完成。
- 交付时必须附上 Review 结果、Composition、输出路径、分辨率、帧率、时长、音轨状态、`N/A` 项及修正记录。

## 本次素材

截图位于：

```text
public/new-flow/
```

交互顺序：

```text
点击【按钮名称】跳转 p2
点击【按钮名称】跳转 p3
点击【按钮名称】跳转 p4
```

请为本次流程创建一个新的 Remotion Composition，不要覆盖已有合成。先完成 Gate A，全部通过后再渲染 MP4；随后完成 Gate B。只有两道 Review 都通过后才能交付视频和 Review 结果。
