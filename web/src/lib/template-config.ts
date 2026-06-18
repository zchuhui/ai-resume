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
}

export const templateList = Object.values(templateRegistry)
