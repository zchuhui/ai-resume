import type { Resume, TemplateStyle } from '@/types/resume'
import { MinimalistTemplate } from './MinimalistTemplate'
import { TechTemplate } from './TechTemplate'
import { ElegantTemplate } from './ElegantTemplate'
import { BusinessTemplate } from './BusinessTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { AcademicTemplate } from './AcademicTemplate'
import { cn } from '@/lib/utils'

interface ResumePreviewProps {
  resume: Resume
  style: TemplateStyle
  className?: string
}

const templates: Record<TemplateStyle, React.ComponentType<{ resume: Resume; className?: string }>> = {
  minimalist: MinimalistTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  business: BusinessTemplate,
  creative: CreativeTemplate,
  academic: AcademicTemplate,
}

export function ResumePreview({ resume, style, className }: ResumePreviewProps) {
  const Template = templates[style]

  return (
    <div
      className={cn(
        'w-full h-full aspect-[1/1.414] overflow-hidden bg-white shadow-sm',
        className
      )}
    >
      <Template resume={resume} />
    </div>
  )
}

export { MinimalistTemplate, TechTemplate, ElegantTemplate, BusinessTemplate, CreativeTemplate, AcademicTemplate }
