import { z } from 'zod'
import { TEMPLATE_IDS } from '../../../shared/design-tokens'

export const basicInfoSchema = z.object({
  name: z.string().default(''),
  title: z.string().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  website: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  github: z.string().optional().default(''),
})

export const educationItemSchema = z.object({
  school: z.string().default(''),
  degree: z.string().default(''),
  field: z.string().optional().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

export const experienceItemSchema = z.object({
  company: z.string().default(''),
  position: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  location: z.string().optional().default(''),
  description: z.array(z.string()).default([]),
})

export const projectItemSchema = z.object({
  name: z.string().default(''),
  role: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  description: z.array(z.string()).default([]),
  link: z.string().optional().default(''),
})

export const certificationItemSchema = z.object({
  name: z.string().default(''),
  issuer: z.string().optional().default(''),
  date: z.string().optional().default(''),
})

export const languageItemSchema = z.object({
  language: z.string().default(''),
  proficiency: z.string().default(''),
})

export const resumeSchema = z.object({
  basicInfo: basicInfoSchema,
  summary: z.string().default(''),
  education: z.array(educationItemSchema).default([]),
  experience: z.array(experienceItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(certificationItemSchema).optional().default([]),
  languages: z.array(languageItemSchema).optional().default([]),
})

export const optimizeRequestSchema = z.object({
  resume: resumeSchema,
  jobDescription: z.string().min(1, '目标岗位 JD 不能为空'),
  tone: z.enum(['professional', 'calm', 'active', 'creative']).default('professional'),
  focus: z.array(z.enum(['achievements', 'skills', 'projects', 'leadership'])).default(['achievements', 'skills']),
  otherRequirements: z.string().optional(),
})

export const exportRequestSchema = z.object({
  resume: resumeSchema,
  template: z.enum(TEMPLATE_IDS).default('minimalist'),
  format: z.enum(['pdf', 'docx']).default('pdf'),
})

export const parseRequestSchema = z.object({
  text: z.string().min(1, '简历文本不能为空'),
})

// 把 Zod 错误压成简短可读的一句话，便于自愈时回灌给模型
export function zodMessage(error: z.ZodError): string {
  return error.errors
    .slice(0, 6)
    .map(e => `${e.path.join('.') || '根'}: ${e.message}`)
    .join('; ')
}
