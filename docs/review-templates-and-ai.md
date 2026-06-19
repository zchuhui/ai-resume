# 模板渲染 & AI Prompt 深度审查与升级方案

> 审查日期：2026-06-19
> 范围：前端简历模板渲染（`web/src/components/resume`）、Word/PDF 导出（`api/src/services/export.ts`、`web/src/pages/Download.tsx`）、AI 服务层（`api/src/services/ai.ts` 及相关路由）

---

## 一、模板渲染审查

### A. 前端 React 预览模板

#### 🔴 1. 百分比字号是根本性 bug（最严重）

所有模板和 `web/src/components/resume/shared/ResumeHelpers.tsx` 大量使用 `fontSize: '2.6%'`、`'5.5%'`、`'3.4%'` 这类写法（如 `TechTemplate.tsx:31`）。

**问题**：CSS 中 `font-size: X%` 是相对**父元素字号**，而非容器宽高。渲染链已逐层确认：

```
body(font-sans, 16px)
 → ResumePreview 容器（无 font-size）
   → 模板根（无 font-size）
     → h1 { font-size: 5.5% }   // = 16px × 5.5% ≈ 0.88px
       正文 2.6% ≈ 0.42px       // 几乎不可见
```

作者意图是"字号随容器缩放"，但用错了单位。

**修复**：改用容器查询单位 `cqw`。模板根加 `container-type: inline-size`，字号写成 `clamp(14px, 4.2cqw, 22px)` 形式。一次性解决 6 套模板的可读性与缩放。

#### 🔴 2. 字体几乎全部 fallback

`web/src/index.css:1` **只 import 了 Montserrat**。而 `design-tokens.ts` 为 6 套模板配置的 Inter / Playfair Display / Space Grotesk / Merriweather / JetBrains Mono **全部未加载**，统统退回系统字体。模板之间最重要的"气质差异"（衬线 / 等宽 / 几何无衬线）在字体层面**完全失效**，只剩颜色和布局在区分。

**修复**：在 `index.css` 引入全部字体；建议本地化打包 woff2 自托管（CloudBase 部署，避免 Google Fonts 在国内被墙）。

#### 🟠 3. 技能进度条是编造的假数据

`ResumeHelpers.tsx:278`：

```ts
const width = 60 + ((index * 17) % 40)   // 纯按索引编的"熟练度"
```

`ProgressSkill` 给每个技能画进度条，但分值是**按数组下标算出的假百分比**，与真实能力无关。这与 AI prompt "不要编造信息"自相矛盾，也会误导 HR。

**修复**：去掉 `width` 公式，改为纯标签（`SkillTag`），或由用户/AI 给出真实等级。

---

### B. 双重模板实现（架构层问题）

模板被**写了两遍**：前端 6 套 React 组件用于预览，后端 `api/src/services/export.ts` 又用 `docx` 重新实现 6 套用于 Word 导出。后果：

- **颜色重复且已漂移**：`export.ts:33` 的 `colorMap` 是手抄的 design-tokens，注释自承 "mirrors frontend"——单一数据源缺失，改一处必漏另一处。
- **字体不一致**：docx 硬编码 `Calibri`/`Georgia`，预览用 Inter/Playfair → **Word 导出和屏幕预览不是同一个东西**。
- **布局简化**：docx 版的 tech/creative 用表格模拟双栏，进度条、时间轴、卡片阴影全丢失。

---

### C. PDF 导出 = 位图截图

`web/src/pages/Download.tsx:46-340` 的 PDF 走 `html2canvas → JPEG(0.92) → jsPDF`：

- **生成的是图片，不是文字**：不可选中、不可搜索、**ATS 无法解析**——与后端 prompt 专门优化 ATS 关键词**直接冲突**，是整个产品最大的逻辑矛盾。
- 放大模糊、文件体积大、中文渲染依赖浏览器字体。
- 为截图分页写了 **200+ 行 `TreeWalker` 收集每行文本盒子找安全断点**的算法（`Download.tsx:101-269`）——极其脆弱，纯粹是在为"截图分页"这个错误方案打补丁。
- 后端 `export.ts:920` `generateHtmlForPdf` 是**死代码**：`format==='pdf'` 时后端返回 HTML，但前端 PDF 分支完全本地处理，从不调它。

---

## 二、AI Prompt 审查

### parseStructure（`ai.ts:47`）

- 用了 `response_format: json_object` 但**没传 JSON schema**，字段名/嵌套结构全靠模型自觉，靠 Zod 事后兜（`parse-structure.ts:26`）。
- **无长文本处理**：超长简历整段塞进 prompt，可能超 context；又**没设 `max_tokens`**，输出被截断即成非法 JSON。
- 无 few-shot 示例；日期 `YYYY-MM` 等格式仅靠自然语言要求，无后处理归一化。
- **JSON.parse 失败不重试**：`ai.ts:17` 的 `retries` 只兜网络异常，解析在 route 层，模型偶发返回坏 JSON 时直接 500。

### optimizeResume（`ai.ts:72`）

- 返回 `{resume, changes}` 混合结构，但 `Resume` 类型和 `resumeSchema` **都不含 changes**，route 靠 `raw.resume || raw` + `raw.changes` 猜（`optimize.ts:36-39`）——模型把 changes 嵌错位置就丢失。
- **Prompt 注入风险**：JD 和简历 JSON 直接拼进 user prompt（`ai.ts:111`），恶意 JD 可指挥模型越权。
- 解析和优化**共用 temperature 0.3**：对解析合适，对改写偏保守。
- 宣称优化 ATS 但**不输出关键词匹配度/缺口分析**，无法量化优化效果。
- "不要编造"仅靠提示，无验证层（如对比 input 字段做幻觉检测）。

### AI 层通用

- 默认 `gpt-4o-mini` 硬编码（`ai.ts:3`）。readme 宣称"支持 Claude"，但走 OpenAI `chat.completions`——接 Claude 需兼容端点。**建议默认换最新 Claude**（`claude-opus-4-8` 做优化、`claude-haiku-4-5` 做解析降本），质量与 JSON 稳定性更好。
- **无流式输出**：优化是最慢一步，用户只能干等（有 LoadingOverlay 但无进度反馈）。
- **无"校验失败→回灌错误重试"自愈环**：Zod 校验失败直接 fallback 回原始简历（`optimize.ts:45`），优化静默失效。

---

## 三、升级方案（按优先级）

### P0 — 立刻修（低成本、高收益）

1. **修字号**：模板里所有 `fontSize: 'X%'` 换成容器查询单位。模板根加 `container-type: inline-size`，字号用 `cqw`（如 `5.5%` → `clamp(14px, 4.2cqw, 22px)`）。
2. **补字体**：`index.css` `@import` 引入 Playfair / Inter / Space Grotesk / Merriweather / JetBrains Mono；建议本地化打包 woff2 自托管。
3. **删假进度条**：去掉 `ProgressSkill` 的 `width` 公式，改纯标签或真实等级。
4. **删死代码**：移除后端 `generateHtmlForPdf` 和 export route 的 PDF 分支，或真正复用它。
5. **JSON 解析重试**：把 `JSON.parse` 移进 `callLLM` 重试圈，坏 JSON 触发重试而非 500。

### P1 — 架构重构（消除双实现 + 真 PDF）

6. **PDF 改服务端矢量渲染**：用 `@react-pdf/renderer`（package.json 已装但未用）或 Puppeteer 渲染**真矢量 PDF**——文本可选、ATS 可读、清晰、体积小，并删掉 200 行截图分页算法。
7. **模板单一数据源**：前端预览和导出共用一套模板定义。两条路线：
   - 全量用 `@react-pdf/renderer` 写模板，预览=导出同源；或
   - 用 Puppeteer 把现有 React 模板（HTML/CSS）直接打印成 PDF，预览=导出像素级一致。
8. **design-tokens 共享**：tokens 抽到 `shared/`，前后端都 import，删掉 export.ts 手抄的 colorMap。

### P2 — AI 能力增强

9. **结构化输出**：解析/优化改用 JSON Schema 约束（Claude tool use / OpenAI structured outputs），从源头保证字段。
10. **优化结果带 ATS 报告**：optimize 额外返回 `{ matchScore, matchedKeywords[], missingKeywords[] }`，Preview 页展示"岗位匹配度"，把 ATS 优化变成可见卖点。
11. **流式 + 进度**：optimize 改 streaming，前端实时展示生成进度。
12. **分任务调参/选模型**：解析用低温 + Haiku 降本，优化用 Opus + 略高温度；JD/简历用分隔符包裹防注入。
13. **自愈环**：Zod 校验失败时把错误信息回灌模型重试 1 次，再 fallback。

---

### 建议落地顺序

先做 **P0**（半天，肉眼可见质量提升）→ **P1#6 真 PDF**（解决与 ATS 的核心矛盾）→ **P1#7 消除双实现** → 最后 **P2 增强**。
</content>
</invoke>
