# 简历模板产品化扩展规划

> 编写日期：2026-06-20
> 文档目标：把“增加更多精美模板”拆成可直接构建的产品方案、模板清单、数据结构、实施步骤和验收标准。
> 当前基线：项目已有 9 套模板：`minimalist` / `tech` / `elegant` / `business` / `creative` / `academic` / `cobalt` / `corporate` / `compact`。

---

## 1. 产品定位

模板扩展不应只是“换颜色”，而应升级为“按岗位场景选择模板”。

用户真正需要解决的是：

1. 我投这个岗位，用哪种简历视觉最合适？
2. 这个模板是否能体现我的专业度？
3. 导出的 PDF / Word 是否像一份可直接投递的成品？

因此模板体系的核心卖点应从：

> 选择一个喜欢的模板

升级为：

> 按目标岗位选择最合适的专业简历模板

每套模板必须同时具备：

- 独立视觉风格
- 对应岗位 demo
- 推荐岗位和不推荐岗位
- PDF / Word 导出适配
- 一页版或标准版密度策略

---

## 2. 产品原则

### 2.1 每套模板必须绑定岗位 demo

不能复用同一份“高级前端工程师”示例。

示例规则：

| 模板 | demo 岗位 |
|---|---|
| 金融模板 | 投资分析师 |
| 法律模板 | 法务经理 |
| 医疗模板 | 临床研究员 |
| 教师模板 | 中学语文教师 |
| 海外英文模板 | Business Analyst |
| 作品集模板 | UI/UX 设计师 |

### 2.2 模板分为三种投递策略

| 类型 | 目标 | 示例 | 默认推荐 |
|---|---|---|---|
| 投递型 | 稳、易读、ATS 友好 | 极简、钴蓝、金融蓝、国企红 | 是 |
| 展示型 | 更有视觉记忆点 | 杂志风、作品集、极光渐变 | 分岗位推荐 |
| 特殊型 | 强风格，适合特定人群 | 暗夜鎏金、瑞士网格、法律黑白 | 谨慎推荐 |

### 2.3 用户选择模板时展示“适合 / 不适合”

每个模板卡片应展示：

- 适合岗位
- 不适合岗位
- 风格关键词
- demo 岗位

示例：

```ts
{
  id: 'finance',
  label: '银行金融蓝',
  demoRole: '投资分析师',
  bestFor: ['银行', '券商', '审计', '财务', '风控'],
  avoidFor: ['视觉设计', '新媒体', '幼教'],
}
```

---

## 3. 模板矩阵

目标从当前 9 套扩展到 24 套，形成 6 个模板大类。

### 3.1 通用专业类

负责最大覆盖面和默认转化率。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `minimalist` | 极简风 | 战略咨询顾问 | 投行、咨询、高管、行政 | 已有 |
| `cobalt` | 钴蓝专业 | 运营项目经理 | 运营、项目、管培、行政 | 已有 |
| `warm` | 暖阳陶土 | HR 经理 | HR、教育、医护、客服 | 待建 |
| `sage` | 鼠尾草 | 可持续发展顾问 | 环保、健康、NGO、研究 | 待建 |
| `fresh` | 清爽蓝白 | 管培生 | 管培、行政、项目助理 | 待建 |

### 3.2 正式权威类

面向中国市场的高需求正式场景。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `corporate` | 中国红国企 | 国企综合管理岗 | 国企、央企、事业单位、党政 | 已有 |
| `finance` | 银行金融蓝 | 投资分析师 | 银行、券商、审计、财务、风控 | 待建 |
| `legal` | 法律黑白 | 法务经理 | 律师、法务、合规、知识产权 | 待建 |
| `executive` | 高管履历风 | 运营总监 | 总监、VP、负责人、顾问 | 待建 |
| `policy` | 政企公文风 | 政企事务专员 | 党政、协会、国企行政 | 待建 |

### 3.3 互联网科技类

覆盖开发、产品、数据、AI 等岗位。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `tech` | 科技风 | 高级前端工程师 | 前端、后端、算法、DevOps | 已有 |
| `aurora` | 极光渐变 | 产品增长经理 | 产品、增长、SaaS、创业 | 待建 |
| `data` | 数据仪表盘风 | 数据分析师 | 数据分析、BI、风控、商业分析 | 待建 |
| `ai` | AI 研究风 | 机器学习工程师 | 算法、AI、研究员、NLP | 待建 |
| `engineer` | 工程师极简风 | 后端架构师 | 后端、架构、平台工程 | 待建 |

### 3.4 创意作品类

负责明显的“精美感”和差异化。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `creative` | 创意风 | UI/UX 设计师 | UI/UX、市场、品牌、运营 | 已有 |
| `editorial` | 杂志风 | 品牌内容策划 | 品牌、内容、PR、媒体 | 待建 |
| `portfolio` | 作品集网格 | 产品设计师 | 设计师、摄影、插画、自由职业 | 待建 |
| `mono` | 瑞士网格 | 艺术指导 | 平面设计、建筑、艺术总监 | 待建 |
| `noir` | 暗夜鎏金 | 私人银行顾问 | 奢侈品、私行、高端顾问、高管 | 待建 |

### 3.5 学术教育类

强调严谨、成果、研究路径。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `academic` | 学术风 | 生物医学研究员 | 高校、研究院、PhD、教师 | 已有 |
| `paper` | 论文 CV 风 | 博士后研究员 | 博士、科研、高校、论文型 CV | 待建 |
| `teacher` | 教师教培风 | 中学语文教师 | 教师、教研、培训、课程顾问 | 待建 |
| `medical` | 医疗科研风 | 临床研究员 | 医生、药企、实验室、CRA | 待建 |

### 3.6 应届海投类

强调信息密度、快速筛选和校招场景。

| id | 名称 | demo 岗位 | 适合岗位 | 当前状态 |
|---|---|---|---|---|
| `compact` | 紧凑单页 | 应届数据分析师 | 应届、海投、技术、销售 | 已有 |
| `campus` | 校招清新版 | 市场管培生 | 应届、实习、管培、校招 | 待建 |
| `competition` | 竞赛项目风 | 算法竞赛选手 | 学生、科研、竞赛经历多 | 待建 |
| `overseas` | 海外英文风 | Business Analyst | 留学、外企、英文简历 | 待建 |
| `bilingual` | 双语国际风 | 跨境电商运营 | 外贸、跨境、电商、国际业务 | 待建 |

---

## 4. 优先级路线图

### Phase 1：6 套精品模板，先补商业价值最高的缺口

目标：让用户明显感知“模板更丰富、更精美、更按岗位”。

| 优先级 | id | 名称 | 原因 |
|---|---|---|---|
| P0 | `warm` | 暖阳陶土 | 补 HR、教育、医护、客服等亲和型岗位 |
| P0 | `finance` | 银行金融蓝 | 金融、财务、审计是高频正式投递场景 |
| P0 | `editorial` | 杂志风 | 提升品牌、内容、市场类模板质感 |
| P0 | `aurora` | 极光渐变 | 补现代互联网、产品、增长风格 |
| P1 | `portfolio` | 作品集网格 | 补设计和自由职业项目展示场景 |
| P1 | `noir` | 暗夜鎏金 | 提供强视觉高级感，适合展示型简历 |

### Phase 2：6 套行业深水区模板

| 优先级 | id | 名称 |
|---|---|---|
| P1 | `legal` | 法律黑白 |
| P1 | `teacher` | 教师教培风 |
| P1 | `medical` | 医疗科研风 |
| P2 | `mono` | 瑞士网格 |
| P2 | `campus` | 校招清新版 |
| P2 | `overseas` | 海外英文风 |

### Phase 3：完善推荐和个性化

功能目标：

- 按 JD 自动推荐模板
- 模板支持密度切换：`compact` / `standard` / `showcase`
- 模板支持有限色彩变体
- 模板卡片展示“适合 / 不适合”
- 导出前展示 ATS 友好度提示

---

## 5. 模板数据结构扩展

当前 `TemplateMeta` 只有基础字段：

```ts
export interface TemplateMeta {
  id: TemplateStyle
  label: string
  description: string
  mood: string
  recommended: string[]
}
```

建议扩展为：

```ts
export type TemplateCategory =
  | 'general'
  | 'formal'
  | 'tech'
  | 'creative'
  | 'academic'
  | 'campus'

export type TemplateStrategy = 'application' | 'showcase' | 'special'
export type TemplateDensity = 'compact' | 'standard' | 'spacious'

export interface TemplateMeta {
  id: TemplateStyle
  label: string
  description: string
  mood: string
  recommended: string[]
  category: TemplateCategory
  strategy: TemplateStrategy
  density: TemplateDensity
  demoRole: string
  bestFor: string[]
  avoidFor: string[]
  visualTags: string[]
}
```

示例：

```ts
finance: {
  id: 'finance',
  label: '银行金融蓝',
  description: '深蓝顶栏、细线分区、数字成果突出，适合金融和财务类正式投递',
  mood: '稳重、可信、数字化、金融感',
  recommended: ['银行', '券商', '审计', '财务', '风控'],
  category: 'formal',
  strategy: 'application',
  density: 'standard',
  demoRole: '投资分析师',
  bestFor: ['银行', '券商', '基金', '审计', '财务', '风控'],
  avoidFor: ['UI/UX', '新媒体', '幼教', '插画'],
  visualTags: ['深蓝', '细线', '数字成果', '正式'],
}
```

---

## 6. Phase 1 模板规格

### 6.1 `warm` 暖阳陶土

定位：亲和、温暖、有人情味。

推荐岗位：HR、教育、医护、客服、社工、心理咨询。

demo 岗位：HR 经理。

视觉规格：

```ts
warm: {
  name: '暖阳陶土',
  mood: '温暖亲和、有人情味',
  colors: {
    bg: '#fffdf9',
    surface: '#fff7ed',
    text: '#1c1917',
    textMuted: '#78716c',
    textInverse: '#ffffff',
    accent: '#c2410c',
    accent2: '#ea580c',
    accent3: '#fdba74',
    border: '#fed7aa',
    borderLight: '#ffedd5',
    highlight: '#fff7ed',
  },
  fonts: {
    heading: "'Inter', 'Noto Sans SC', sans-serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'left',
    columns: 'two',
    spacing: 'normal',
    maxDensity: 'medium',
  },
  decoration: {
    style: 'line',
    borderRadius: 'medium',
    useIcons: true,
    usePatterns: false,
    useShadows: false,
  },
}
```

### 6.2 `finance` 银行金融蓝

定位：稳重、可信、数字成果突出。

推荐岗位：银行、券商、基金、审计、财务、风控。

demo 岗位：投资分析师。

视觉规格：

```ts
finance: {
  name: '银行金融蓝',
  mood: '稳重可信、数字化、金融感',
  colors: {
    bg: '#ffffff',
    surface: '#f8fafc',
    text: '#172033',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    accent: '#123c69',
    accent2: '#1f6feb',
    accent3: '#d4af37',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',
    highlight: '#eff6ff',
  },
  fonts: {
    heading: "'Montserrat', 'Noto Sans SC', sans-serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'band',
    columns: 'two',
    spacing: 'normal',
    maxDensity: 'high',
  },
  decoration: {
    style: 'line',
    borderRadius: 'small',
    useIcons: false,
    usePatterns: false,
    useShadows: false,
  },
}
```

### 6.3 `editorial` 杂志风

定位：杂志式大标题、非对称留白、内容质感强。

推荐岗位：品牌、内容、PR、媒体、编辑、市场。

demo 岗位：品牌内容策划。

视觉规格：

```ts
editorial: {
  name: '杂志风',
  mood: '杂志感、大衬线标题、非对称',
  colors: {
    bg: '#fcfbf8',
    surface: '#ffffff',
    text: '#1a1a1a',
    textMuted: '#6b6b6b',
    textInverse: '#ffffff',
    accent: '#1e40af',
    accent2: '#9d174d',
    accent3: '#d6d3d1',
    border: '#e7e5e4',
    borderLight: '#f5f5f4',
    highlight: '#fef3c7',
  },
  fonts: {
    heading: "'Playfair Display', 'Noto Serif SC', serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'band',
    columns: 'asymmetric',
    spacing: 'editorial',
    maxDensity: 'medium',
  },
  decoration: {
    style: 'geometric',
    borderRadius: 'medium',
    useIcons: true,
    usePatterns: false,
    useShadows: false,
  },
}
```

### 6.4 `aurora` 极光渐变

定位：现代科技、增长感、适合互联网。

推荐岗位：产品、增长、SaaS、创业、市场。

demo 岗位：产品增长经理。

视觉规格：

```ts
aurora: {
  name: '极光渐变',
  mood: '现代科技、增长感、玻璃拟态',
  colors: {
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    accent: '#6366f1',
    accent2: '#06b6d4',
    accent3: '#a855f7',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    highlight: '#eef2ff',
  },
  fonts: {
    heading: "'Space Grotesk', 'Noto Sans SC', sans-serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'band',
    columns: 'asymmetric',
    spacing: 'normal',
    maxDensity: 'medium',
  },
  decoration: {
    style: 'geometric',
    borderRadius: 'large',
    useIcons: true,
    usePatterns: true,
    useShadows: true,
  },
}
```

### 6.5 `portfolio` 作品集网格

定位：项目优先、卡片网格、适合作品多的人。

推荐岗位：UI/UX、产品设计、摄影、插画、自由职业。

demo 岗位：产品设计师。

视觉规格：

```ts
portfolio: {
  name: '作品集网格',
  mood: '项目优先、卡片网格、展示型',
  colors: {
    bg: '#fafafa',
    surface: '#ffffff',
    text: '#18181b',
    textMuted: '#71717a',
    textInverse: '#ffffff',
    accent: '#7c3aed',
    accent2: '#db2777',
    accent3: '#c4b5fd',
    border: '#e4e4e7',
    borderLight: '#f4f4f5',
    highlight: '#f5f3ff',
  },
  fonts: {
    heading: "'Space Grotesk', 'Noto Sans SC', sans-serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'left',
    columns: 'two',
    spacing: 'compact',
    maxDensity: 'high',
  },
  decoration: {
    style: 'card',
    borderRadius: 'large',
    useIcons: true,
    usePatterns: false,
    useShadows: true,
  },
}
```

### 6.6 `noir` 暗夜鎏金

定位：高级、克制、奢华，适合展示型电子简历。

推荐岗位：奢侈品、私人银行、高端顾问、高管、法律。

demo 岗位：私人银行顾问。

注意：深色模板打印友好性较差，应在模板卡片标注“更适合电子版投递”。

视觉规格：

```ts
noir: {
  name: '暗夜鎏金',
  mood: '高级克制、奢华、衬线加金色',
  colors: {
    bg: '#0c0a09',
    surface: '#1c1917',
    text: '#f5f5f4',
    textMuted: '#a8a29e',
    textInverse: '#0c0a09',
    accent: '#d4af37',
    accent2: '#b8860b',
    accent3: '#57534e',
    border: '#292524',
    borderLight: '#44403c',
    highlight: '#1c1917',
  },
  fonts: {
    heading: "'Playfair Display', 'Noto Serif SC', serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
  },
  layout: {
    header: 'band',
    columns: 'single',
    spacing: 'loose',
    maxDensity: 'low',
  },
  decoration: {
    style: 'line',
    borderRadius: 'small',
    useIcons: true,
    usePatterns: false,
    useShadows: true,
  },
}
```

---

## 7. 实施清单

当前项目已经把模板 id 和设计 token 放到 `shared/design-tokens.ts`，后端 schema 也可从共享 `TEMPLATE_IDS` 派生。因此新增模板的基础改动应控制在以下文件。

### 7.1 每新增一套模板必须改

| 文件 | 任务 |
|---|---|
| `shared/design-tokens.ts` | 在 `TEMPLATE_IDS` 加 id，并在 `designTokens` 增加颜色、字体、布局、装饰 |
| `web/src/lib/template-config.ts` | 增加模板展示元信息 |
| `web/src/lib/mock-resume.ts` | 增加该模板专属岗位 demo |
| `web/src/components/resume/ExpandedTemplates.tsx` | 新增或复用模板组件 |
| `web/src/components/resume/ResumePreview.tsx` | 注册模板组件 |
| `api/src/services/pdf-renderer.ts` | 映射 PDF 渲染模板，如果复用布局则指向最近布局族 |

### 7.2 如需新增字体

1. 安装字体包，例如：

```bash
cd web
npm install @fontsource/lora @fontsource/quicksand
```

2. 在 `web/src/main.tsx` 引入字体。

3. 运行构建，观察 CSS 体积。中文字体会显著增加资源体积，优先复用已有 `Noto Sans SC` / `Noto Serif SC`。

### 7.3 如需新增布局族

只有当现有布局无法表达时才新增布局族。

建议先复用：

| 布局族 | 适合模板 |
|---|---|
| `single` | 极简、暗夜鎏金、论文 CV |
| `two` | 商务、暖阳、金融、教师 |
| `sidebar-left` | 钴蓝、科技、清爽蓝白 |
| `asymmetric` | 杂志风、极光渐变 |
| `card` 风格 | 作品集、校招项目 |
| `timeline` 风格 | 学术、履历时间轴 |

---

## 8. 推荐开发顺序

### Sprint 1

目标：完成 Phase 1 的前 3 套投递价值最高模板。

1. `finance` 银行金融蓝
2. `warm` 暖阳陶土
3. `editorial` 杂志风

交付物：

- 3 套前端预览
- 3 份专属 demo resume
- 首页和模板列表展示正确
- PDF / Word 导出不报错

### Sprint 2

目标：补视觉冲击力和互联网模板。

1. `aurora` 极光渐变
2. `portfolio` 作品集网格
3. `noir` 暗夜鎏金

交付物：

- 展示型模板标识
- 深色模板导出检查
- 作品集项目卡片排版检查

### Sprint 3

目标：做模板选择体验。

1. 模板分类筛选
2. 模板卡片展示 demo 岗位
3. 模板卡片展示适合 / 不适合
4. JD 上传后推荐模板

---

## 9. 页面体验改造

### 9.1 首页

首页主张应突出：

> AI 按目标岗位，推荐并生成专业简历模板

首屏展示不应只展示一个岗位，而应至少展示 3 个不同岗位模板：

- 国企综合管理岗
- 产品增长经理
- 投资分析师

### 9.2 模板列表页

模板列表应支持分类：

- 全部
- 通用专业
- 正式权威
- 互联网科技
- 创意作品
- 学术教育
- 应届海投

模板卡片信息：

```text
模板名称
demo 岗位
适合岗位标签
视觉关键词
投递型 / 展示型 / 特殊型
```

### 9.3 模板详情预览

点击模板后展示：

- 大图预览
- 适合岗位
- 不适合岗位
- 设计风格说明
- PDF / Word 导出支持情况
- 使用该模板开始制作

---

## 10. 验收标准

### 10.1 单模板验收

每套模板完成后必须满足：

- `TEMPLATE_IDS` 中包含模板 id
- `designTokens` 中包含模板 token
- `templateRegistry` 中有完整 meta
- `templateDemoResumes` 中有专属岗位 demo
- `ResumePreview` 能正常渲染
- 模板列表能显示岗位标题
- PDF 导出不报错
- Word 导出不报错
- 桌面端无明显遮挡
- 移动端无横向溢出

### 10.2 Phase 1 验收

Phase 1 完成后应达到：

- 总模板数达到 15 套
- 至少 6 个模板大类都有代表模板
- 首页展示不同岗位模板 demo
- 模板列表可按类别筛选
- 所有模板均可导出 PDF / Word
- 生产构建通过

### 10.3 验证命令

```bash
cd web
npm run lint
npm run build
```

```bash
cd api
npm run build
```

建议额外做浏览器检查：

```bash
# 启动前端
cd web
npm run dev
```

检查项：

- 首页首屏是否展示多岗位模板
- 模板列表是否能看到新模板
- 点击模板是否能进入制作流程
- PDF 导出是否成功
- Word 导出是否成功
- 控制台是否有 error
- 移动端是否横向溢出

---

## 11. 风险与约束

### 11.1 中文字体体积

当前项目引入中文字体后，CSS 和字体资源体积会明显增加。新增模板尽量复用已有字体：

- `Noto Sans SC`
- `Noto Serif SC`
- `Inter`
- `Montserrat`
- `Playfair Display`
- `Space Grotesk`

除非某套模板必须依赖特殊字体，否则不建议继续大量新增字体包。

### 11.2 深色模板打印问题

`noir` 这类深色模板适合电子版投递，但不适合打印。

产品层面应标注：

> 更适合 PDF 电子版投递，不建议打印。

### 11.3 Word 导出与前端预览不可能完全一致

复杂装饰、渐变、玻璃拟态在 Word 中应降级：

- 渐变降级为主色块
- 阴影降级为边框
- 复杂图案降级为细线
- 卡片布局保留信息层级，不强求完全一致

### 11.4 模板越多，选择成本越高

当模板超过 15 套后，必须引入分类和推荐，否则用户会被选择压力拖慢。

---

## 12. 最终目标

模板体系最终应成为产品的核心竞争力：

1. 用户上传简历和 JD。
2. 系统识别岗位类型。
3. 自动推荐 3 套最适合模板。
4. 每套模板展示不同岗位 demo 和预览。
5. 用户选择模板后导出 PDF / Word。

最终体验应是：

> 用户不是在模板库里挑颜色，而是在为目标岗位挑一份更容易被认可的成品简历。
