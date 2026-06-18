# RedeemLoop v0.9.3 Release Notes

## English

RedeemLoop v0.9.3 applies the supplied VI assets to the official website.

### Changed

- Added the original VI images to `apps/site/public/vi`.
- Extracted the supplied logo mark and wordmark as transparent SVG site assets without recoloring or redrawing them.
- Split the static website into pure-language pages: `/` for Chinese and `/en` for English.
- Kept the English website free of Chinese visible text and Chinese-bearing VI board imagery.
- Updated the official website to use the VI palette:
  - `#0D1B2A`
  - `#0A7B6E`
  - `#DFF3EF`
  - `#F3F6F9`
- Updated website typography to an Inter-first system font stack, matching the provided VI board without depending on a remote font fetch during build.
- Reworked the navigation, hero, scenario model, readiness table, developer block, and footer to follow the provided RedeemLoop VI language.

### Status

No protocol or payment behavior changes. This release is a visual identity update for the static official website.

## 中文

RedeemLoop v0.9.3 将你提供的 VI 素材应用到官网。

### 变更

- 将原始 VI 图片加入 `apps/site/public/vi`。
- 从提供的素材中提取透明底 SVG logo mark 和 wordmark，未重新上色，未重绘。
- 官网拆成纯语种页面：`/` 为中文，`/en` 为英文。
- 英文官网不显示中文文字，也不显示带中文内容的 VI 版式图。
- 官网使用 VI 色板：
  - `#0D1B2A`
  - `#0A7B6E`
  - `#DFF3EF`
  - `#F3F6F9`
- 官网字体更新为 Inter 优先的系统字体栈，保持 VI 方向，同时避免构建依赖远程字体下载。
- 导航、首屏、场景模型、可用度表格、开发者区块和页脚都按 RedeemLoop VI 语言装修。

### 状态

没有协议或支付行为变更。该版本是静态官网的视觉识别更新。
