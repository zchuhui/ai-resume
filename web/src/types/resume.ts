export interface Resume {
  basicInfo: {
    name: string
    title: string
    email?: string
    phone?: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: string[]
  certifications?: CertificationItem[]
  languages?: LanguageItem[]
}

export interface ExperienceItem {
  company: string
  position: string
  startDate: string
  endDate: string
  location?: string
  description: string[]
}

export interface EducationItem {
  school: string
  degree: string
  field?: string
  startDate: string
  endDate: string
}

export interface ProjectItem {
  name: string
  role?: string
  startDate?: string
  endDate?: string
  description: string[]
  link?: string
}

export interface CertificationItem {
  name: string
  issuer?: string
  date?: string
}

export interface LanguageItem {
  language: string
  proficiency: string
}

export interface OptimizeRequest {
  jobDescription: string
  tone: 'professional' | 'calm' | 'active' | 'creative'
  focus: Array<'achievements' | 'skills' | 'projects' | 'leadership'>
  otherRequirements?: string
}

export type TemplateStyle = 'minimalist' | 'tech' | 'elegant'
