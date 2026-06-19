# 简历模板扩展方案（可落地）

> 编写日期：2026-06-19
> 目标：在现有 6 套模板基础上，新增 **12 套高质感模板**，覆盖更多行业与审美，并给出**可直接照做**的实现清单与配色/字体/布局规格。
> 现有模板：`minimalist` 极简 / `tech` 科技 / `elegant` 精美 / `business` 商务 / `creative` 创意 / `academic` 学术。

---

## 一、新增一个模板要改哪些文件（落地清单）

当前是"前端预览 + 后端 docx"双实现，新增一套模板需改 **8 处**。务必全改，否则会出现预览有、导出报错（enum 校验失败）等问题。

| # | 文件 | 改动 |
|---|------|------|
| 1 | `web/src/types/resume.ts` | `TemplateStyle` 联合类型加新 id |
| 2 | `web/src/components/resume/shared/design-tokens.ts` | `designTokens` 加一条 tokens（颜色/字体/布局/装饰） |
| 3 | `web/src/components/resume/<Name>Template.tsx` | 新建 React 预览组件 |
| 4 | `web/src/components/resume/ResumePreview.tsx` | 在 `templates` map 注册 + `export` |
| 5 | `web/src/lib/template-config.ts` | `templateRegistry` 加 meta（label/description/mood/recommended） |
| 6 | `api/src/types/resume.ts` | `TemplateStyle` 联合类型加新 id（与前端镜像） |
| 7 | `api/src/services/export.ts` | `colorMap` 加颜色 + 写 `generate<Name>Doc` + `switch` 加 case |
| 8 | `api/src/schemas/resume.ts` | `exportRequestSchema` 的 `template` enum 加新 id |

> ⚠️ 第 6/7/8 处是后端镜像，正是上一份审查里指出的"双实现"成本。**强烈建议先做下面的"地基重构"**，把每套新模板的改动从 8 处降到 3 处。

---

## 二、地基重构（强烈建议，先做一次，后续每套模板省一半工作）

做完这三步后，新增模板只需改 **3 处**（types 1 处 + design-tokens 1 处 + React 组件 1 处），后端零改动。

1. **template enum 单一来源**
   把 `TemplateStyle` 抽成一个数组常量并 `as const`，前后端 import 同一份；`exportRequestSchema` 用 `z.enum(TEMPLATE_IDS)` 自动派生，删掉手写枚举（`api/src/schemas/resume.ts:72`）。

2. **颜色单一来源**
   后端 `export.ts` 的 `colorMap`（`export.ts:33`，注释自承 "mirrors frontend"）删除，改为从共享 design-tokens 读取颜色。把 `design-tokens.ts` 的颜色部分抽到 `shared/` 同时被前后端引用。

3. **docx 布局按"布局族"归一**
   现有 docx 已是有限几种布局（单栏 / 双栏 / 左栏 sidebar / band 头）。把 `generate*Doc` 改成**按 `tokens.layout` 分发**的通用生成器：`generateByLayout(resume, tokens)`，根据 `layout.columns` 选单栏/双栏/sidebar。这样新模板只要在 tokens 里声明 layout，docx 自动适配，**无需为每套模板再写一个 docx 函数**。

> 若暂时不想动后端，也可先只做前端预览（改 1-5 处），导出沿用最接近的现有 docx 布局，后续再补。

---

## 三、12 套新模板总览

按落地成本分两批。Batch A 复用现有布局族，先上；Batch B 需要新布局/装饰，后上。

| # | id | 名称 | 气质 | 目标人群 | 布局族 | 批次 |
|---|----|------|------|----------|--------|------|
| 1 | `cobalt` | 钴蓝专业 | 干净、可信、通用首选 | 通用/运营/项目/管培 | 左栏 sidebar | A |
| 2 | `warm` | 暖阳陶土 | 亲和、温暖、有人情味 | HR/教育/医护/客服 | 左头+双栏 | A |
| 3 | `sage` | 鼠尾草 | 自然、沉静、可持续 | 环保/健康/NGO/研究 | 左头+双栏(衬线) | A |
| 4 | `corporate` | 中国红国企 | 稳重、正式、权威 | 国企/事业单位/央企/党政 | band 头+双栏 | A |
| 5 | `noir` | 暗夜鎏金 | 高级、克制、奢华 | 法律/私行/奢侈品/高管 | 深色 band/单栏 | A |
| 6 | `aurora` | 极光渐变 | 现代、科技、增长感 | SaaS/产品/增长/创业 | 渐变 band+玻璃卡 | B |
| 7 | `mono` | 瑞士国际主义 | 理性、网格、设计感 | 设计/建筑/艺术总监 | 严格网格双栏 | B |
| 8 | `editorial` | 杂志风 | 杂志感、大衬线标题 | 媒体/PR/内容/品牌 | 非对称双栏 | B |
| 9 | `timeline` | 时间轴 | 履历清晰、年限突出 | 资深/长工龄/PM | 左侧主时间轴 | B |
| 10 | `portfolio` | 作品集网格 | 项目优先、卡片网格 | 设计师/自由职业/作品多 | 卡片网格 | B |
| 11 | `pastel` | 马卡龙 | 柔和、年轻、活力 | 应届/新媒体/运营/幼教 | 居中头+双栏卡 | B |
| 12 | `compact` | 紧凑单页 | 高密度、塞满一页 | 应届/海投/信息密集 | 紧凑双栏 | B |

---

## 四、各模板详细规格（可直接粘贴）

每条都给出可直接填进 `design-tokens.ts` 的 tokens，以及 `template-config.ts` 的 meta。字段严格对齐现有接口（`ColorScheme` / `FontScheme` / `LayoutScheme` / `DecorationScheme`）。

> 字体说明见第六节"字体加载"，所有列出的字体需在 `index.css` 引入，否则会 fallback。

### 1. cobalt 钴蓝专业（Batch A）

```ts
cobalt: {
  name: '钴蓝专业', mood: '干净可信、左栏信息、通用首选',
  colors: {
    bg: '#ffffff', surface: '#f1f5f9', text: '#0f172a', textMuted: '#64748b',
    textInverse: '#ffffff', accent: '#2563eb', accent2: '#1d4ed8', accent3: '#93c5fd',
    border: '#e2e8f0', borderLight: '#f1f5f9', highlight: '#eff6ff',
  },
  fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'sidebar', columns: 'sidebar-left', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'line', borderRadius: 'small', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '浅灰左栏 + 钴蓝点缀，结构清晰，适配几乎所有岗位'`，`recommended: ['通用','运营','项目','管培','行政']`
布局：左侧浅灰栏放头像位/联系方式/技能/语言，右侧主栏放经历。复用 `tech` 的 sidebar-left 布局但浅色化。

### 2. warm 暖阳陶土（Batch A）

```ts
warm: {
  name: '暖阳陶土', mood: '温暖亲和、有人情味',
  colors: {
    bg: '#fffdf9', surface: '#fff7ed', text: '#1c1917', textMuted: '#78716c',
    textInverse: '#ffffff', accent: '#c2410c', accent2: '#ea580c', accent3: '#fdba74',
    border: '#fed7aa', borderLight: '#ffedd5', highlight: '#fff7ed',
  },
  fonts: { heading: "'Poppins', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'two', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'line', borderRadius: 'medium', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '陶土暖橙、圆润标题，亲和有温度，适合与人打交道的岗位'`，`recommended: ['HR','教育','医护','客服','社工']`
布局：复用 `business` 左头+双栏。

### 3. sage 鼠尾草（Batch A）

```ts
sage: {
  name: '鼠尾草', mood: '自然沉静、衬线书卷、可持续',
  colors: {
    bg: '#fbfdfa', surface: '#f0f4ec', text: '#1a2e1a', textMuted: '#5a6b57',
    textInverse: '#ffffff', accent: '#4d7c0f', accent2: '#65a30d', accent3: '#bbf7d0',
    border: '#d9e2d0', borderLight: '#ecf1e6', highlight: '#f0f4ec',
  },
  fonts: { heading: "'Lora', Georgia, serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'two', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'line', borderRadius: 'medium', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '鼠尾草绿 + 衬线标题，沉静自然，适合环保健康与研究方向'`，`recommended: ['环保','健康','NGO','可持续','研究']`

### 4. corporate 中国红国企（Batch A）⭐ 国内市场刚需

```ts
corporate: {
  name: '中国红国企', mood: '稳重正式、权威、党政国企',
  colors: {
    bg: '#ffffff', surface: '#fef2f2', text: '#1f2937', textMuted: '#6b7280',
    textInverse: '#ffffff', accent: '#b91c1c', accent2: '#dc2626', accent3: '#fca5a5',
    border: '#e5e7eb', borderLight: '#f3f4f6', highlight: '#fef2f2',
  },
  fonts: { heading: "'Noto Serif SC', serif", body: "'Noto Sans SC', sans-serif" },
  layout: { header: 'band', columns: 'two', spacing: 'normal', maxDensity: 'high' },
  decoration: { style: 'line', borderRadius: 'none', useIcons: false, usePatterns: false, useShadows: false },
},
```
meta：`description: '红色顶栏 + 思源宋体，端正权威，专为国企/事业单位/央企/党政'`，`recommended: ['国企','事业单位','央企','党政','银行']`
要点：用思源宋体（Noto Serif SC）才有正式感；不用图标、直角，强调端正。

### 5. noir 暗夜鎏金（Batch A，深色）

```ts
noir: {
  name: '暗夜鎏金', mood: '高级克制、奢华、衬线 + 金',
  colors: {
    bg: '#0c0a09', surface: '#1c1917', text: '#f5f5f4', textMuted: '#a8a29e',
    textInverse: '#0c0a09', accent: '#d4af37', accent2: '#b8860b', accent3: '#57534e',
    border: '#292524', borderLight: '#44403c', highlight: '#1c1917',
  },
  fonts: { heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  layout: { header: 'band', columns: 'single', spacing: 'loose', maxDensity: 'low' },
  decoration: { style: 'line', borderRadius: 'small', useIcons: true, usePatterns: false, useShadows: true },
},
```
meta：`description: '深黑底鎏金线条 + 衬线标题，奢华克制，适合高端与高管'`，`recommended: ['法律','私人银行','奢侈品','高管','顾问']`
要点：深色模板导出 PDF 时注意背景色铺满（参考 tech 的处理）；打印友好性差，标注"建议屏幕投递/电子版"。

### 6. aurora 极光渐变（Batch B）

```ts
aurora: {
  name: '极光渐变', mood: '现代科技、增长感、玻璃拟态',
  colors: {
    bg: '#f8fafc', surface: '#ffffff', text: '#0f172a', textMuted: '#64748b',
    textInverse: '#ffffff', accent: '#6366f1', accent2: '#06b6d4', accent3: '#a855f7',
    border: '#e2e8f0', borderLight: '#f1f5f9', highlight: '#eef2ff',
  },
  fonts: { heading: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'band', columns: 'asymmetric', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'geometric', borderRadius: 'large', useIcons: true, usePatterns: true, useShadows: true },
},
```
meta：`description: '靛蓝→青色渐变顶栏 + 玻璃卡片，现代有增长感，适合互联网产品'`，`recommended: ['SaaS','产品','增长','创业','市场']`
新布局：顶部 `linear-gradient` band + 半透明 `backdrop-blur` 卡片。docx 端用纯色近似（取 accent）。

### 7. mono 瑞士国际主义（Batch B）

```ts
mono: {
  name: '瑞士网格', mood: '理性网格、极致排版、红黑',
  colors: {
    bg: '#ffffff', surface: '#f5f5f5', text: '#111111', textMuted: '#555555',
    textInverse: '#ffffff', accent: '#e4002b', accent2: '#111111', accent3: '#999999',
    border: '#111111', borderLight: '#e5e5e5', highlight: '#f5f5f5',
  },
  fonts: { heading: "'Inter', 'Helvetica Neue', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'two', spacing: 'editorial', maxDensity: 'high' },
  decoration: { style: 'geometric', borderRadius: 'none', useIcons: false, usePatterns: true, useShadows: false },
},
```
meta：`description: '严格网格、红黑配色、超大字号层级，设计感极强'`，`recommended: ['平面设计','建筑','艺术总监','UX','摄影']`
要点：靠强网格线（`usePatterns`）和字号对比制造冲击；只用一个红做强调。

### 8. editorial 杂志风（Batch B）

```ts
editorial: {
  name: '杂志风', mood: '杂志感、大衬线标题、非对称',
  colors: {
    bg: '#fcfbf8', surface: '#ffffff', text: '#1a1a1a', textMuted: '#6b6b6b',
    textInverse: '#ffffff', accent: '#1e40af', accent2: '#9d174d', accent3: '#d6d3d1',
    border: '#e7e5e4', borderLight: '#f5f5f4', highlight: '#fef3c7',
  },
  fonts: { heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  layout: { header: 'band', columns: 'asymmetric', spacing: 'editorial', maxDensity: 'medium' },
  decoration: { style: 'geometric', borderRadius: 'medium', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '杂志式大标题 + 非对称留白，内容有质感，适合内容与品牌岗'`，`recommended: ['媒体','PR','内容','品牌','编辑']`

### 9. timeline 时间轴（Batch B）

```ts
timeline: {
  name: '时间轴', mood: '履历清晰、年限突出',
  colors: {
    bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b',
    textInverse: '#ffffff', accent: '#0ea5e9', accent2: '#0284c7', accent3: '#bae6fd',
    border: '#e2e8f0', borderLight: '#f1f5f9', highlight: '#f0f9ff',
  },
  fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'single', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'timeline', borderRadius: 'small', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '左侧竖向时间轴贯穿经历，年限与成长路径一目了然'`，`recommended: ['资深','项目经理','运营','工程经理','顾问']`
复用：已有 `TimelineItem` 组件（`ResumeHelpers.tsx:308`），直接拿来主打。

### 10. portfolio 作品集网格（Batch B）

```ts
portfolio: {
  name: '作品集', mood: '项目优先、卡片网格',
  colors: {
    bg: '#fafafa', surface: '#ffffff', text: '#18181b', textMuted: '#71717a',
    textInverse: '#ffffff', accent: '#7c3aed', accent2: '#db2777', accent3: '#c4b5fd',
    border: '#e4e4e7', borderLight: '#f4f4f5', highlight: '#f5f3ff',
  },
  fonts: { heading: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'two', spacing: 'compact', maxDensity: 'high' },
  decoration: { style: 'card', borderRadius: 'large', useIcons: true, usePatterns: false, useShadows: true },
},
```
meta：`description: '项目以卡片网格优先呈现，适合作品多的设计与自由职业者'`，`recommended: ['设计师','自由职业','插画','摄影','创意']`
复用：已有 `Card` 组件；projects 用网格卡片置顶。

### 11. pastel 马卡龙（Batch B）

```ts
pastel: {
  name: '马卡龙', mood: '柔和年轻、活力多彩',
  colors: {
    bg: '#fffdfd', surface: '#fdf2f8', text: '#3b0764', textMuted: '#6b7280',
    textInverse: '#ffffff', accent: '#db2777', accent2: '#8b5cf6', accent3: '#38bdf8',
    border: '#fbcfe8', borderLight: '#fce7f3', highlight: '#fdf2f8',
  },
  fonts: { heading: "'Quicksand', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'center', columns: 'two', spacing: 'normal', maxDensity: 'medium' },
  decoration: { style: 'card', borderRadius: 'large', useIcons: true, usePatterns: false, useShadows: true },
},
```
meta：`description: '柔和马卡龙撞色 + 圆润字体，年轻有活力，适合应届与新媒体'`，`recommended: ['应届','新媒体','运营','幼教','活动']`

### 12. compact 紧凑单页（Batch B）

```ts
compact: {
  name: '紧凑单页', mood: '高密度、一页装满',
  colors: {
    bg: '#ffffff', surface: '#f9fafb', text: '#111827', textMuted: '#6b7280',
    textInverse: '#ffffff', accent: '#2563eb', accent2: '#1f2937', accent3: '#9ca3af',
    border: '#e5e7eb', borderLight: '#f3f4f6', highlight: '#f9fafb',
  },
  fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  layout: { header: 'left', columns: 'two', spacing: 'compact', maxDensity: 'high' },
  decoration: { style: 'line', borderRadius: 'none', useIcons: true, usePatterns: false, useShadows: false },
},
```
meta：`description: '高密度双栏，信息塞满一页不浪费，适合海投与信息量大的应届'`，`recommended: ['应届','海投','技术','销售','多经历']`

---

## 五、分批落地计划

**前置（一次性）**：完成上一份审查里的 P0 字号修复（`%` → `cqw`）与字体加载，再批量做模板，否则新模板同样会糊。建议同时做第二节"地基重构"。

- **第 0 批｜地基**：P0 字号 + 字体加载 + enum/颜色单一来源 + docx 按布局族归一。（约 1 天）
- **第 1 批｜Batch A 5 套**：`cobalt`/`warm`/`sage`/`corporate`/`noir`，全部复用现有布局族，主要是配色 + tokens + 组件微调。（约 1-1.5 天）
- **第 2 批｜Batch B 7 套**：`aurora`/`mono`/`editorial`/`timeline`/`portfolio`/`pastel`/`compact`，含新布局/装饰。（约 2-3 天）

完成后模板总数：**6 + 12 = 18 套**。

---

## 六、美观与质量要点（务必遵守）

1. **字体加载**：在 `web/src/index.css` 顶部统一引入以下字体（建议自托管 woff2，CloudBase 上避免 Google Fonts 被墙）：
   `Inter, Poppins, Space Grotesk, Playfair Display, Lora, Quicksand, Merriweather, Montserrat, JetBrains Mono, Noto Sans SC, Noto Serif SC`。
2. **字号单位**：模板根 `container-type: inline-size`，所有字号用 `cqw`/`clamp()`，确保缩略图、放大预览、PDF 三种尺寸都清晰。
3. **对比度**：正文与背景对比度 ≥ 4.5:1。深色模板（`noir`/`tech`）导出时确认背景铺满整页。
4. **A4 比例**：预览容器保持 `aspect-[1/1.414]`，设计时按 794×1123px @96dpi 校对。
5. **真实数据**：删除"假进度条"（`ProgressSkill` 的 `width` 公式），技能用真实标签或等级。
6. **降级**：渐变/玻璃/网格等效果在 docx 端用纯色近似，保证 Word 导出不崩。
7. **PDF 矢量化**（强烈建议）：配合上一份审查的 P1#6，把 PDF 从"html2canvas 截图"换成 `@react-pdf/renderer`/Puppeteer 矢量渲染，新模板才能保证清晰且 ATS 可读。

---

## 七、单套模板实现 Checklist（复制即用）

```
[ ] types/resume.ts          —— TemplateStyle 加 '<id>'
[ ] api/types/resume.ts      —— TemplateStyle 加 '<id>'（若已做 enum 单一来源则跳过）
[ ] design-tokens.ts         —— 粘贴本文档对应 tokens
[ ] <Name>Template.tsx       —— 新建组件（可从最接近布局族的现有模板复制改色）
[ ] ResumePreview.tsx        —— templates map 注册 + export
[ ] template-config.ts       —— 粘贴 meta（label/description/mood/recommended）
[ ] export.ts                —— colorMap + generate<Name>Doc + switch case（若已做布局族归一则只加 colorMap）
[ ] schemas/resume.ts        —— exportRequestSchema 的 template enum 加 '<id>'（若已 enum 单一来源则跳过）
[ ] index.css                —— 确认所需字体已引入
[ ] 自测：预览缩略图 / 放大 / PDF 导出 / Word 导出 四处均正常
```
</content>
