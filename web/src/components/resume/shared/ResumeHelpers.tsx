import type { Resume } from '@/types/resume'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { TemplateTokens } from './design-tokens'

export const contactIconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  github: FaGithub,
  linkedin: FaLinkedin,
}

export type ContactKey = keyof typeof contactIconMap

export interface ContactItem {
  key: ContactKey
  value: string
}

export function useContactItems(resume: Resume): ContactItem[] {
  const { basicInfo } = resume
  return [
    { key: 'email', value: basicInfo.email },
    { key: 'phone', value: basicInfo.phone },
    { key: 'location', value: basicInfo.location },
    { key: 'website', value: basicInfo.website },
    { key: 'github', value: basicInfo.github },
    { key: 'linkedin', value: basicInfo.linkedin },
  ].filter((item): item is ContactItem => Boolean(item.value))
}

export const sectionTitles = {
  summary: '个人简介',
  experience: '工作经历',
  education: '教育背景',
  projects: '项目经验',
  skills: '技能专长',
  certifications: '证书',
  languages: '语言',
} as const

export type SectionKey = keyof typeof sectionTitles

export interface SectionHeaderProps {
  title: string
  tokens: TemplateTokens
  variant?: 'underline' | 'bar' | 'pill' | 'icon' | 'minimal'
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

export function SectionHeader({ title, tokens, variant = 'underline', icon: Icon }: SectionHeaderProps) {
  const { colors, fonts, decoration } = tokens

  if (variant === 'bar') {
    return (
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1 h-4 rounded-full"
          style={{ background: colors.accent }}
        />
        <h2
          className="font-bold uppercase tracking-wider"
          style={{ fontFamily: fonts.heading, fontSize: '3cqw', color: colors.text }}
        >
          {title}
        </h2>
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <div className="mb-3">
        <span
          className="inline-block px-3 py-1 font-bold uppercase tracking-wider"
          style={{
            fontFamily: fonts.heading,
            fontSize: '2.6cqw',
            background: colors.accent,
            color: colors.textInverse,
            borderRadius: decoration.borderRadius === 'large' ? '9999px' : '4px',
          }}
        >
          {title}
        </span>
      </div>
    )
  }

  if (variant === 'icon' && Icon) {
    return (
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: colors.accent }} />
        <h2
          className="font-semibold"
          style={{ fontFamily: fonts.heading, fontSize: '3cqw', color: colors.text }}
        >
          {title}
        </h2>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <h2
        className="font-bold uppercase tracking-[0.15em] mb-3"
        style={{
          fontFamily: fonts.heading,
          fontSize: '2.6cqw',
          color: colors.text,
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
    )
  }

  return (
    <h2
      className="font-bold uppercase tracking-[0.1em] pb-1 mb-3"
      style={{
        fontFamily: fonts.heading,
        fontSize: '2.6cqw',
        color: colors.text,
        borderBottom: `2px solid ${colors.accent}`,
      }}
    >
      {title}
    </h2>
  )
}

export interface ContactBlockProps {
  items: ContactItem[]
  tokens: TemplateTokens
  variant?: 'inline' | 'stack' | 'icon-circle'
}

export function ContactBlock({ items, tokens, variant = 'inline' }: ContactBlockProps) {
  const { colors, fonts } = tokens

  if (variant === 'stack') {
    return (
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = contactIconMap[item.key]
          return (
            <div key={item.key} className="flex items-center gap-2" style={{ fontFamily: fonts.body, fontSize: '2.4cqw', color: colors.textMuted }}>
              <Icon className="w-3 h-3" style={{ color: colors.accent }} />
              <span className="truncate">{item.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === 'icon-circle') {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = contactIconMap[item.key]
          return (
            <div
              key={item.key}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full"
              style={{ background: colors.surface, color: colors.textMuted }}
            >
              <Icon className="w-3 h-3" style={{ color: colors.accent }} />
              <span className="truncate" style={{ fontFamily: fonts.body, fontSize: '2.4cqw' }}>{item.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ fontFamily: fonts.body, fontSize: '2.6cqw', color: colors.textMuted }}>
      {items.map((item) => {
        const Icon = contactIconMap[item.key]
        return (
          <span key={item.key} className="flex items-center gap-1">
            <Icon className="w-3 h-3" style={{ color: colors.accent }} />
            {item.value}
          </span>
        )
      })}
    </div>
  )
}

export interface SkillTagProps {
  skill: string
  tokens: TemplateTokens
  index: number
  variant?: 'pill' | 'outline' | 'dot' | 'mono'
}

export function SkillTag({ skill, tokens, index, variant = 'pill' }: SkillTagProps) {
  const { colors, fonts } = tokens

  const accentPalette = [colors.accent, colors.accent2, colors.accent3]
  const accent = accentPalette[index % accentPalette.length]

  if (variant === 'outline') {
    return (
      <span
        className="px-2.5 py-1 font-medium"
        style={{
          fontFamily: fonts.body,
          fontSize: '2.6cqw',
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: '4px',
        }}
      >
        {skill}
      </span>
    )
  }

  if (variant === 'dot') {
    return (
      <span className="flex items-center gap-2" style={{ fontFamily: fonts.body, fontSize: '2.8cqw', color: colors.textMuted }}>
        <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
        <span className="font-medium" style={{ color: colors.text }}>{skill}</span>
      </span>
    )
  }

  if (variant === 'mono') {
    return (
      <span
        className="px-2 py-1 font-mono"
        style={{
          fontFamily: fonts.mono || fonts.body,
          fontSize: '2.4cqw',
          background: colors.surface,
          color: colors.accent,
          borderRadius: '4px',
        }}
      >
        {skill}
      </span>
    )
  }

  return (
    <span
      className="px-3 py-1.5 font-medium text-white"
      style={{
        fontFamily: fonts.body,
        fontSize: '2.4cqw',
        background: accent,
        borderRadius: '9999px',
      }}
    >
      {skill}
    </span>
  )
}

export interface ProgressSkillProps {
  skill: string
  tokens: TemplateTokens
  index: number
}

// 纯标签展示，不再使用按数组下标编造的假进度百分比，避免误导 HR。
export function ProgressSkill({ skill, tokens, index }: ProgressSkillProps) {
  const { colors, fonts } = tokens
  const accentPalette = [colors.accent, colors.accent2, colors.accent3]
  const accent = accentPalette[index % accentPalette.length]

  return (
    <div className="flex items-center gap-2" style={{ fontFamily: fonts.mono || fonts.body, fontSize: '2.4cqw', color: colors.text }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
      <span>{skill}</span>
    </div>
  )
}

export interface TimelineItemProps {
  title: string
  subtitle: string
  date: string
  descriptions?: string[]
  tokens: TemplateTokens
  index: number
  last?: boolean
}

export function TimelineItem({ title, subtitle, date, descriptions, tokens, last = false }: TimelineItemProps) {
  const { colors, fonts } = tokens

  return (
    <div className="relative pl-5">
      <div
        className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full"
        style={{ background: colors.accent, border: `2px solid ${colors.bg}` }}
      />
      {!last && (
        <div
          className="absolute left-[4px] top-4 bottom-0 w-px"
          style={{ background: colors.border }}
        />
      )}
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold" style={{ fontFamily: fonts.heading, fontSize: '3.4cqw', color: colors.text }}>{title}</h3>
        <span style={{ fontFamily: fonts.body, fontSize: '2.6cqw', color: colors.textMuted }}>{date}</span>
      </div>
      <p className="font-medium mt-0.5" style={{ fontFamily: fonts.body, fontSize: '3cqw', color: colors.accent }}>{subtitle}</p>
      {descriptions && descriptions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {descriptions.map((desc, i) => (
            <li key={i} style={{ fontFamily: fonts.body, fontSize: '2.8cqw', color: colors.textMuted, lineHeight: '1.5' }}>{desc}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface CardProps {
  children: React.ReactNode
  tokens: TemplateTokens
  className?: string
}

export function Card({ children, tokens, className }: CardProps) {
  const { colors, decoration } = tokens
  const radius = decoration.borderRadius === 'large' ? '12px' : decoration.borderRadius === 'medium' ? '8px' : '4px'

  return (
    <div
      className={className}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.borderLight}`,
        borderRadius: radius,
        boxShadow: decoration.useShadows ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        padding: '3%',
      }}
    >
      {children}
    </div>
  )
}
