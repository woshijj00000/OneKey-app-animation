# OneKey App Animation · Codex 任务模板

请先完整阅读 `README.md` 和 `REUSE_GUIDE_ZH.md`，然后检查现有 Remotion 项目。

我要基于当前 OneKey UI 社媒动画模板制作一个新流程。

## 固定要求

- 输出 1080 × 1080、60fps。
- 保持绿色到浅绿色的品牌渐变背景。
- UI 界面置底，不添加真实手机外框。
- 不重绘或改变截图中的 UI 样式。
- 按钮不在可视区域时，从页面顶部连续滚动到可点击位置。
- 沿用现有绿色圆形点击动画。
- 点击音效沿用 `public/audio/click-user.mp3`。
- 背景音乐沿用 `public/audio/dynamic-bed.wav`。
- 结尾沿用 OneKey Logo 和 Logo 出现音效。
- 页面切换保持连续流畅，不添加静止停顿。

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

请为本次流程创建一个新的 Remotion Composition，不要覆盖已有合成。完成后运行代码检查、渲染 MP4，并验证视频分辨率、帧率和音轨。
