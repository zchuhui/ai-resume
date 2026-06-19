import type { TemplateStyle } from '@/types/resume'

export interface TemplateMeta {
  id: TemplateStyle
  label: string
  description: string
  mood: string
  recommended: string[]
}

export const templateRegistry: Record<TemplateStyle, TemplateMeta> = {
  minimalist: {
    id: 'minimalist',
    label: '极简风',
    description: '超大留白、纯文字、克制线条，适合投行、咨询、高管岗位',
    mood: '克制、留白、信息密度低',
    recommended: ['通用', '投行', '咨询', '高管', '行政'],
  },
  tech: {
    id: 'tech',
    label: '科技风',
    description: '深色终端、技能进度条、代码感卡片，适合开发者、算法、数据',
    mood: '深色终端、数据感、技能突出',
    recommended: ['前端', '后端', '算法', '数据', 'DevOps'],
  },
  elegant: {
    id: 'elegant',
    label: '精美风',
    description: '杂志感、衬线标题、非对称留白，适合产品、设计、品牌',
    mood: '杂志感、衬线标题、非对称留白',
    recommended: ['产品', '设计', '品牌', '管理', '市场'],
  },
  business: {
    id: 'business',
    label: '商务风',
    description: '藏青暖金、结构清晰、稳重专业，适合金融、销售、传统名企',
    mood: '稳重、结构化、金融咨询',
    recommended: ['金融', '咨询', '销售', '财务', '管理'],
  },
  creative: {
    id: 'creative',
    label: '创意风',
    description: '大胆撞色、几何装饰、彩色胶囊，适合 UI/UX、市场、创意岗',
    mood: '大胆撞色、个性、设计市场',
    recommended: ['UI/UX', '产品', '市场', '品牌', '运营'],
  },
  academic: {
    id: 'academic',
    label: '学术风',
    description: '暖白墨绿、衬线字体、时间轴，适合科研、高校、研究院',
    mood: '严谨、书卷气、时间轴',
    recommended: ['高校', '研究院', 'PhD', '教师', '研发'],
  },
  cobalt: {
    id: 'cobalt',
    label: '钴蓝专业',
    description: '浅灰左栏 + 钴蓝点缀，结构清晰，适配几乎所有岗位',
    mood: '干净可信、左栏信息、通用首选',
    recommended: ['通用', '运营', '项目', '管培', '行政'],
  },
  corporate: {
    id: 'corporate',
    label: '中国红国企',
    description: '红色顶栏 + 思源宋体，端正权威，专为国企/事业单位/央企/党政',
    mood: '稳重正式、权威、党政国企',
    recommended: ['国企', '事业单位', '央企', '党政', '银行'],
  },
  compact: {
    id: 'compact',
    label: '紧凑单页',
    description: '高密度双栏，信息塞满一页不浪费，适合海投与信息量大的应届',
    mood: '高密度、一页装满',
    recommended: ['应届', '海投', '技术', '销售', '多经历'],
  },
}

export const templateList = Object.values(templateRegistry)
