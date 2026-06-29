// 共享设计令牌 —— 前端预览与后端 Word 导出共用，杜绝颜色/字体双份手抄漂移。
// 该文件为纯 TS 常量，无副作用，前后端均可直接 import。

export const TEMPLATE_IDS = [
  'minimalist',
  'tech',
  'elegant',
  'business',
  'creative',
  'academic',
  'chinesePro',
  'cobalt',
  'corporate',
  'compact',
  'finance',
  'warm',
  'editorial',
  'aurora',
  'portfolio',
  'noir',
] as const

export type TemplateStyle = typeof TEMPLATE_IDS[number]

export interface ColorScheme {
  bg: string
  surface: string
  text: string
  textMuted: string
  textInverse: string
  accent: string
  accent2: string
  accent3: string
  border: string
  borderLight: string
  highlight: string
}

export interface FontScheme {
  heading: string
  body: string
  mono?: string
}

export interface LayoutScheme {
  header: 'center' | 'left' | 'band' | 'sidebar'
  columns: 'single' | 'two' | 'sidebar-left' | 'sidebar-right' | 'asymmetric'
  spacing: 'compact' | 'normal' | 'loose' | 'editorial'
  maxDensity: 'low' | 'medium' | 'high'
}

export interface DecorationScheme {
  style: 'clean' | 'geometric' | 'line' | 'card' | 'timeline' | 'stamp' | 'code'
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  useIcons: boolean
  usePatterns: boolean
  useShadows: boolean
}

export interface TemplateTokens {
  name: string
  mood: string
  colors: ColorScheme
  fonts: FontScheme
  layout: LayoutScheme
  decoration: DecorationScheme
}

export const designTokens: Record<TemplateStyle, TemplateTokens> = {
  minimalist: {
    name: '极简风',
    mood: '克制、留白、信息密度低',
    colors: {
      bg: '#ffffff',
      surface: '#ffffff',
      text: '#0f172a',
      textMuted: '#64748b',
      textInverse: '#ffffff',
      accent: '#0f172a',
      accent2: '#94a3b8',
      accent3: '#cbd5e1',
      border: '#0f172a',
      borderLight: '#e2e8f0',
      highlight: '#f8fafc',
    },
    fonts: {
      heading: "'Inter', 'Helvetica Neue', sans-serif",
      body: "'Inter', 'Helvetica Neue', sans-serif",
    },
    layout: {
      header: 'center',
      columns: 'single',
      spacing: 'loose',
      maxDensity: 'low',
    },
    decoration: {
      style: 'clean',
      borderRadius: 'none',
      useIcons: false,
      usePatterns: false,
      useShadows: false,
    },
  },
  tech: {
    name: '科技风',
    mood: '深色终端、数据感、技能突出',
    colors: {
      bg: '#0b1120',
      surface: '#151e32',
      text: '#e2e8f0',
      textMuted: '#94a3b8',
      textInverse: '#0f172a',
      accent: '#38bdf8',
      accent2: '#818cf8',
      accent3: '#34d399',
      border: '#1e293b',
      borderLight: '#334155',
      highlight: '#0f172a',
    },
    fonts: {
      heading: "'Inter', 'Segoe UI', sans-serif",
      body: "'Inter', 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    },
    layout: {
      header: 'sidebar',
      columns: 'sidebar-left',
      spacing: 'normal',
      maxDensity: 'medium',
    },
    decoration: {
      style: 'code',
      borderRadius: 'small',
      useIcons: true,
      usePatterns: true,
      useShadows: true,
    },
  },
  elegant: {
    name: '精美风',
    mood: '杂志感、衬线标题、非对称留白',
    colors: {
      bg: '#fafaf9',
      surface: '#ffffff',
      text: '#1c1917',
      textMuted: '#78716c',
      textInverse: '#ffffff',
      accent: '#1e3a5f',
      accent2: '#b45309',
      accent3: '#d6d3d1',
      border: '#e7e5e4',
      borderLight: '#f5f5f4',
      highlight: '#f5f5f4',
    },
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Inter', 'Helvetica Neue', sans-serif",
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
      usePatterns: true,
      useShadows: false,
    },
  },
  business: {
    name: '商务风',
    mood: '稳重、结构化、金融咨询',
    colors: {
      bg: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      textInverse: '#ffffff',
      accent: '#1e3a5f',
      accent2: '#b45309',
      accent3: '#94a3b8',
      border: '#cbd5e1',
      borderLight: '#e2e8f0',
      highlight: '#f1f5f9',
    },
    fonts: {
      heading: "'Montserrat', 'Inter', sans-serif",
      body: "'Inter', 'Helvetica Neue', sans-serif",
    },
    layout: {
      header: 'left',
      columns: 'two',
      spacing: 'normal',
      maxDensity: 'medium',
    },
    decoration: {
      style: 'line',
      borderRadius: 'small',
      useIcons: true,
      usePatterns: false,
      useShadows: false,
    },
  },
  creative: {
    name: '创意风',
    mood: '大胆撞色、个性、设计市场',
    colors: {
      bg: '#ffffff',
      surface: '#2e1065',
      text: '#1e1b4b',
      textMuted: '#64748b',
      textInverse: '#ffffff',
      accent: '#f97316',
      accent2: '#ec4899',
      accent3: '#8b5cf6',
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      highlight: '#fef3c7',
    },
    fonts: {
      heading: "'Space Grotesk', 'Montserrat', sans-serif",
      body: "'Inter', 'Helvetica Neue', sans-serif",
    },
    layout: {
      header: 'sidebar',
      columns: 'sidebar-left',
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
  },
  academic: {
    name: '学术风',
    mood: '严谨、书卷气、时间轴',
    colors: {
      bg: '#fffbf0',
      surface: '#ffffff',
      text: '#292524',
      textMuted: '#78716c',
      textInverse: '#ffffff',
      accent: '#166534',
      accent2: '#92400e',
      accent3: '#d6d3d1',
      border: '#d6d3d1',
      borderLight: '#e7e5e4',
      highlight: '#f5f5f4',
    },
    fonts: {
      heading: "'Merriweather', 'Georgia', serif",
      body: "'Merriweather', 'Georgia', serif",
    },
    layout: {
      header: 'left',
      columns: 'two',
      spacing: 'normal',
      maxDensity: 'high',
    },
    decoration: {
      style: 'timeline',
      borderRadius: 'none',
      useIcons: true,
      usePatterns: false,
      useShadows: false,
    },
  },
  chinesePro: {
    name: '专业中文双栏',
    mood: '中文友好、左栏身份、右栏主叙事、招聘阅读优先',
    colors: {
      bg: '#ffffff',
      surface: '#132033',
      text: '#111827',
      textMuted: '#4b5b72',
      textInverse: '#f8fafc',
      accent: '#09a9c8',
      accent2: '#0e7490',
      accent3: '#d8f3f8',
      border: '#102b3f',
      borderLight: '#e8eef5',
      highlight: '#f3f8fb',
    },
    fonts: {
      heading: "'PingFang SC', 'Noto Sans SC', sans-serif",
      body: "'PingFang SC', 'Noto Sans SC', sans-serif",
      mono: "'Menlo', 'JetBrains Mono', monospace",
    },
    layout: {
      header: 'sidebar',
      columns: 'sidebar-left',
      spacing: 'compact',
      maxDensity: 'high',
    },
    decoration: {
      style: 'timeline',
      borderRadius: 'small',
      useIcons: true,
      usePatterns: false,
      useShadows: false,
    },
  },
  cobalt: {
    name: '钴蓝专业',
    mood: '干净可信、左栏信息、通用首选',
    colors: {
      bg: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      textInverse: '#ffffff',
      accent: '#2563eb',
      accent2: '#1d4ed8',
      accent3: '#93c5fd',
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      highlight: '#eff6ff',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    layout: {
      header: 'sidebar',
      columns: 'sidebar-left',
      spacing: 'normal',
      maxDensity: 'medium',
    },
    decoration: {
      style: 'line',
      borderRadius: 'small',
      useIcons: true,
      usePatterns: false,
      useShadows: false,
    },
  },
  corporate: {
    name: '中国红国企',
    mood: '稳重正式、权威、党政国企',
    colors: {
      bg: '#ffffff',
      surface: '#fef2f2',
      text: '#1f2937',
      textMuted: '#6b7280',
      textInverse: '#ffffff',
      accent: '#b91c1c',
      accent2: '#dc2626',
      accent3: '#fca5a5',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      highlight: '#fef2f2',
    },
    fonts: {
      heading: "'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
    },
    layout: {
      header: 'band',
      columns: 'two',
      spacing: 'normal',
      maxDensity: 'high',
    },
    decoration: {
      style: 'line',
      borderRadius: 'none',
      useIcons: false,
      usePatterns: false,
      useShadows: false,
    },
  },
  compact: {
    name: '紧凑单页',
    mood: '高密度、一页装满',
    colors: {
      bg: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textMuted: '#6b7280',
      textInverse: '#ffffff',
      accent: '#2563eb',
      accent2: '#1f2937',
      accent3: '#9ca3af',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      highlight: '#f9fafb',
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
    },
    layout: {
      header: 'left',
      columns: 'two',
      spacing: 'compact',
      maxDensity: 'high',
    },
    decoration: {
      style: 'line',
      borderRadius: 'none',
      useIcons: true,
      usePatterns: false,
      useShadows: false,
    },
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
}

export function getTokens(style: TemplateStyle): TemplateTokens {
  return designTokens[style]
}
