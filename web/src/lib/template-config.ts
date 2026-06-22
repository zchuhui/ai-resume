import type { TemplateStyle } from '@/types/resume'

export type TemplateCategory =
  | 'general'
  | 'formal'
  | 'tech'
  | 'creative'
  | 'academic'
  | 'campus'

export type TemplateStrategy = 'application' | 'showcase' | 'special'

export interface TemplateMeta {
  id: TemplateStyle
  label: string
  description: string
  mood: string
  recommended: string[]
  category: TemplateCategory
  strategy: TemplateStrategy
  demoRole: string
  bestFor: string[]
  avoidFor: string[]
  visualTags: string[]
}

// 分类与策略的展示文案
export const categoryLabels: Record<TemplateCategory, string> = {
  general: '通用专业',
  formal: '正式权威',
  tech: '互联网科技',
  creative: '创意作品',
  academic: '学术教育',
  campus: '应届海投',
}

export const strategyLabels: Record<TemplateStrategy, string> = {
  application: '投递型',
  showcase: '展示型',
  special: '特殊型',
}

// 用于筛选栏：全部 + 6 大类
export const categoryFilters: { id: 'all' | TemplateCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'general', label: categoryLabels.general },
  { id: 'formal', label: categoryLabels.formal },
  { id: 'tech', label: categoryLabels.tech },
  { id: 'creative', label: categoryLabels.creative },
  { id: 'academic', label: categoryLabels.academic },
  { id: 'campus', label: categoryLabels.campus },
]

export const templateRegistry: Record<TemplateStyle, TemplateMeta> = {
  minimalist: {
    id: 'minimalist',
    label: '极简风',
    description: '超大留白、纯文字、克制线条，适合投行、咨询、高管岗位',
    mood: '克制、留白、信息密度低',
    recommended: ['通用', '投行', '咨询', '高管', '行政'],
    category: 'general',
    strategy: 'application',
    demoRole: '战略咨询顾问',
    bestFor: ['投行', '咨询', '高管', '行政', '通用'],
    avoidFor: ['UI/UX', '新媒体', '插画'],
    visualTags: ['留白', '极简', '黑白', '纯文字'],
  },
  tech: {
    id: 'tech',
    label: '科技风',
    description: '深色终端、技能进度条、代码感卡片，适合开发者、算法、数据',
    mood: '深色终端、数据感、技能突出',
    recommended: ['前端', '后端', '算法', '数据', 'DevOps'],
    category: 'tech',
    strategy: 'showcase',
    demoRole: '高级前端工程师',
    bestFor: ['前端', '后端', '算法', '数据', 'DevOps'],
    avoidFor: ['行政', '教师', '国企'],
    visualTags: ['深色', '终端', '技能条', '等宽字体'],
  },
  elegant: {
    id: 'elegant',
    label: '精美风',
    description: '杂志感、衬线标题、非对称留白，适合产品、设计、品牌',
    mood: '杂志感、衬线标题、非对称留白',
    recommended: ['产品', '设计', '品牌', '管理', '市场'],
    category: 'creative',
    strategy: 'showcase',
    demoRole: '资深产品经理',
    bestFor: ['产品', '设计', '品牌', '管理', '市场'],
    avoidFor: ['国企', '公务员', '风控'],
    visualTags: ['杂志感', '衬线', '非对称', '留白'],
  },
  business: {
    id: 'business',
    label: '商务风',
    description: '藏青暖金、结构清晰、稳重专业，适合金融、销售、传统名企',
    mood: '稳重、结构化、金融咨询',
    recommended: ['金融', '咨询', '销售', '财务', '管理'],
    category: 'formal',
    strategy: 'application',
    demoRole: '财务经理',
    bestFor: ['金融', '咨询', '销售', '财务', '管理'],
    avoidFor: ['UI/UX', '插画', '新媒体'],
    visualTags: ['藏青', '结构化', '稳重', '双栏'],
  },
  creative: {
    id: 'creative',
    label: '创意风',
    description: '大胆撞色、几何装饰、彩色胶囊，适合 UI/UX、市场、创意岗',
    mood: '大胆撞色、个性、设计市场',
    recommended: ['UI/UX', '产品', '市场', '品牌', '运营'],
    category: 'creative',
    strategy: 'showcase',
    demoRole: 'UI/UX 设计师',
    bestFor: ['UI/UX', '产品', '市场', '品牌', '运营'],
    avoidFor: ['金融', '法律', '国企'],
    visualTags: ['撞色', '几何', '个性', '胶囊'],
  },
  academic: {
    id: 'academic',
    label: '学术风',
    description: '暖白墨绿、衬线字体、时间轴，适合科研、高校、研究院',
    mood: '严谨、书卷气、时间轴',
    recommended: ['高校', '研究院', 'PhD', '教师', '研发'],
    category: 'academic',
    strategy: 'application',
    demoRole: '生物医学研究员',
    bestFor: ['高校', '研究院', 'PhD', '教师', '研发'],
    avoidFor: ['互联网运营', '销售'],
    visualTags: ['衬线', '严谨', '时间轴', '书卷气'],
  },
  cobalt: {
    id: 'cobalt',
    label: '钴蓝专业',
    description: '浅灰左栏 + 钴蓝点缀，结构清晰，适配几乎所有岗位',
    mood: '干净可信、左栏信息、通用首选',
    recommended: ['通用', '运营', '项目', '管培', '行政'],
    category: 'general',
    strategy: 'application',
    demoRole: '运营项目经理',
    bestFor: ['通用', '运营', '项目', '管培', '行政'],
    avoidFor: [],
    visualTags: ['钴蓝', '左栏', '干净', '通用'],
  },
  corporate: {
    id: 'corporate',
    label: '中国红国企',
    description: '红色顶栏 + 思源宋体，端正权威，专为国企/事业单位/央企/党政',
    mood: '稳重正式、权威、党政国企',
    recommended: ['国企', '事业单位', '央企', '党政', '银行'],
    category: 'formal',
    strategy: 'application',
    demoRole: '国企综合管理岗',
    bestFor: ['国企', '事业单位', '央企', '党政', '银行'],
    avoidFor: ['UI/UX', '新媒体', '创意设计'],
    visualTags: ['中国红', '宋体', '端正', '权威'],
  },
  compact: {
    id: 'compact',
    label: '紧凑单页',
    description: '高密度双栏，信息塞满一页不浪费，适合海投与信息量大的应届',
    mood: '高密度、一页装满',
    recommended: ['应届', '海投', '技术', '销售', '多经历'],
    category: 'campus',
    strategy: 'application',
    demoRole: '应届数据分析师',
    bestFor: ['应届', '海投', '技术', '销售', '多经历'],
    avoidFor: ['高管', '总监'],
    visualTags: ['高密度', '单页', '双栏', '信息全'],
  },
  finance: {
    id: 'finance',
    label: '银行金融蓝',
    description: '深蓝顶栏、细线分区、数字成果突出，适合金融和财务类正式投递',
    mood: '稳重、可信、数字化、金融感',
    recommended: ['银行', '券商', '审计', '财务', '风控'],
    category: 'formal',
    strategy: 'application',
    demoRole: '投资分析师',
    bestFor: ['银行', '券商', '基金', '审计', '财务', '风控'],
    avoidFor: ['UI/UX', '新媒体', '幼教', '插画'],
    visualTags: ['深蓝', '细线', '数字成果', '正式'],
  },
  warm: {
    id: 'warm',
    label: '暖阳陶土',
    description: '暖色调亲和布局、有人情味，适合 HR、教育、医护等与人打交道的岗位',
    mood: '温暖、亲和、有人情味',
    recommended: ['HR', '教育', '医护', '客服', '社工'],
    category: 'general',
    strategy: 'application',
    demoRole: 'HR 经理',
    bestFor: ['HR', '教育', '医护', '客服', '社工', '心理咨询'],
    avoidFor: ['投行', '法律', '风控'],
    visualTags: ['暖橙', '亲和', '圆润', '有温度'],
  },
  editorial: {
    id: 'editorial',
    label: '杂志风',
    description: '杂志式大标题、非对称留白、内容质感强，适合品牌、内容、媒体岗',
    mood: '杂志感、大衬线标题、非对称留白',
    recommended: ['品牌', '内容', 'PR', '媒体', '市场'],
    category: 'creative',
    strategy: 'showcase',
    demoRole: '品牌内容策划',
    bestFor: ['品牌', '内容', 'PR', '媒体', '市场', '编辑'],
    avoidFor: ['国企', '技术', '风控'],
    visualTags: ['杂志', '大标题', '衬线', '留白'],
  },
  aurora: {
    id: 'aurora',
    label: '极光渐变',
    description: '紫蓝渐变顶栏 + 玻璃拟态装饰，现代科技感，适合互联网产品与增长岗',
    mood: '现代科技、增长感、玻璃拟态',
    recommended: ['产品', '增长', 'SaaS', '创业', '市场'],
    category: 'tech',
    strategy: 'showcase',
    demoRole: '产品增长经理',
    bestFor: ['产品', '增长', 'SaaS', '创业', '市场'],
    avoidFor: ['国企', '法律', '公务员'],
    visualTags: ['渐变', '玻璃拟态', '现代', '科技感'],
  },
  portfolio: {
    id: 'portfolio',
    label: '作品集网格',
    description: '卡片式项目网格布局，项目优先展示，适合设计师和自由职业作品多的人',
    mood: '项目优先、卡片网格、展示型',
    recommended: ['UI/UX', '产品设计', '摄影', '插画', '自由职业'],
    category: 'creative',
    strategy: 'showcase',
    demoRole: '产品设计师',
    bestFor: ['UI/UX', '产品设计', '摄影', '插画', '自由职业'],
    avoidFor: ['国企', '金融', '公务员'],
    visualTags: ['卡片', '网格', '作品优先', '展示'],
  },
  noir: {
    id: 'noir',
    label: '暗夜鎏金',
    description: '深色背景 + 金色点缀，高级克制奢华感。更适合 PDF 电子版投递，不建议打印',
    mood: '高级克制、奢华、衬线加金色',
    recommended: ['奢侈品', '私行', '高端顾问', '高管', '法律'],
    category: 'creative',
    strategy: 'special',
    demoRole: '私人银行顾问',
    bestFor: ['奢侈品', '私行', '高端顾问', '高管', '法律'],
    avoidFor: ['应届', '海投', '打印投递'],
    visualTags: ['深色', '鎏金', '奢华', '电子版'],
  },
}

export const templateList = Object.values(templateRegistry)
