import { Mail, MapPin, Phone, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'
import type { ReactNode } from 'react'

interface ChineseProfessionalTemplateProps {
  resume: Resume
  className?: string
}

const skillGroups = ['后端', '前端', '数据 / 存储', '工程化 / 运维', 'AI 研发 / Builder', '业务领域']

function splitSkills(skills: string[]) {
  if (skills.length === 0) return []
  const chunkSize = Math.max(2, Math.ceil(skills.length / skillGroups.length))
  return skillGroups
    .map((label, index) => ({
      label,
      skills: skills.slice(index * chunkSize, (index + 1) * chunkSize),
    }))
    .filter((group) => group.skills.length > 0)
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-[2.6%] flex items-center gap-[1.6%]">
      <span className="inline-flex h-[4.2cqw] min-w-[4.2cqw] items-center justify-center rounded-[0.6cqw] bg-[#111827] text-[2.15cqw] font-semibold leading-none text-white">
        {index}
      </span>
      <h2 className="text-[3.5cqw] font-semibold leading-none text-[#111827]">{title}</h2>
      <span className="h-[0.36cqw] flex-1 bg-[#111827]" />
    </div>
  )
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-[7%]">
      <h3 className="border-b border-[#1b4052] pb-[3%] text-[2.55cqw] font-semibold text-white">
        <span className="mr-[2%] inline-block h-[2.8cqw] w-[0.7cqw] rounded-full bg-[#09c4de] align-[-0.35cqw]" />
        {title}
      </h3>
      <div className="mt-[4%]">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-[1.6%] space-y-[1.2%]">
      {items.map((item, index) => (
        <li key={index} className="flex gap-[1.4%] text-[2.42cqw] leading-[1.55] text-[#314158]">
          <span className="mt-[1.05cqw] h-[0.85cqw] w-[0.85cqw] shrink-0 rounded-full bg-[#09a9c8]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ChineseProfessionalTemplate({ resume, className }: ChineseProfessionalTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('chinesePro')
  const contactItems = [
    { icon: Phone, value: basicInfo.phone },
    { icon: Mail, value: basicInfo.email },
    { icon: MapPin, value: basicInfo.location },
  ].filter((item) => item.value)

  return (
    <div
      className={cn('h-full w-full overflow-hidden bg-white text-[#111827]', className)}
      style={{ fontFamily: tokens.fonts.body }}
    >
      <div className="flex min-h-full">
        <aside className="w-[34%] shrink-0 bg-[#132033] px-[3.4%] py-[5.2%] text-[#d5e1ee]">
          <div className="text-center">
            <div className="mx-auto flex h-[16cqw] w-[16cqw] items-center justify-center rounded-full border-[0.45cqw] border-[#08bdd8] bg-[#1b2f49] text-[6.8cqw] font-semibold text-white shadow-[0_0_18px_rgba(9,196,222,0.35)]">
              {basicInfo.name.replace(/\s/g, '').slice(0, 1) || '简'}
            </div>
            <h1 className="mt-[6%] text-[5.4cqw] font-semibold leading-tight text-white">{basicInfo.name}</h1>
            <p className="mt-[2.4%] text-[2.05cqw] font-medium uppercase tracking-[0.28em] text-[#09c4de]">
              {basicInfo.title || 'PROFESSIONAL'}
            </p>
          </div>

          <SidebarSection title="基本信息">
            <div className="space-y-[3.5%] text-[2.45cqw] leading-normal">
              {contactItems.map(({ icon: Icon, value }, index) => (
                <div key={index} className="flex items-center gap-[4%]">
                  <Icon className="h-[2.5cqw] w-[2.5cqw] text-[#09c4de]" />
                  <span className="min-w-0 truncate">{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-[4%]">
                <Star className="h-[2.5cqw] w-[2.5cqw] fill-[#09c4de] text-[#09c4de]" />
                <span>专业中文投递模板</span>
              </div>
            </div>
          </SidebarSection>

          {skills.length > 0 && (
            <SidebarSection title="核心技能">
              <div className="space-y-[4.5%]">
                {splitSkills(skills).map((group) => (
                  <div key={group.label}>
                    <p className="mb-[2%] text-[2.25cqw] font-semibold text-[#09c4de]">{group.label}</p>
                    <div className="flex flex-wrap gap-[1.4cqw]">
                      {group.skills.map((skill) => (
                        <span key={skill} className="rounded-[0.7cqw] border border-[#0f6d83] bg-[#153b55] px-[1.7cqw] py-[0.8cqw] text-[2.1cqw] leading-none text-[#e9f3fb]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {education.length > 0 && (
            <SidebarSection title="教育背景">
              <div className="space-y-[4%]">
                {education.map((item, index) => (
                  <div key={index}>
                    <p className="text-[2.55cqw] font-semibold text-white">{item.school}</p>
                    <p className="mt-[1%] text-[2.2cqw] text-[#09c4de]">{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                    <p className="mt-[0.6%] text-[2.05cqw] text-[#8ea3bb]">{item.startDate} - {item.endDate}</p>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {(languages?.length || certifications?.length) ? (
            <SidebarSection title="语言 / 认证">
              <div className="space-y-[2%] text-[2.2cqw] leading-[1.5]">
                {languages?.map((item, index) => (
                  <p key={`lang-${index}`}>{item.language} - {item.proficiency}</p>
                ))}
                {certifications?.map((item, index) => (
                  <p key={`cert-${index}`}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
                ))}
              </div>
            </SidebarSection>
          ) : null}
        </aside>

        <main className="w-[66%] px-[5%] py-[4.8%]">
          {summary && (
            <section className="mb-[4.2%]">
              <SectionTitle index="01" title="个人优势" />
              <p className="text-[2.58cqw] font-normal leading-[1.72] text-[#314158]">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-[4.2%]">
              <SectionTitle index="02" title="工作经历" />
              <div className="space-y-[3.4%]">
                {experience.map((item, index) => (
                  <article key={index} className="relative pl-[3%]">
                    <span className="absolute left-0 top-[0.55cqw] h-[2.4cqw] w-[2.4cqw] rounded-full border-[0.55cqw] border-[#d8f3f8] bg-[#09a9c8]" />
                    <div className="flex items-baseline justify-between gap-[4%]">
                      <h3 className="text-[3.05cqw] font-semibold leading-tight text-[#111827]">{item.company}</h3>
                      <span className="shrink-0 text-[2.18cqw] text-[#7a8ba3]">{item.startDate} - {item.endDate}</span>
                    </div>
                    <p className="mt-[0.8%] text-[2.35cqw] font-semibold text-[#09a9c8]">{item.position}{item.location ? ` · ${item.location}` : ''}</p>
                    <BulletList items={item.description} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle index="03" title="项目经历" />
              <div className="space-y-[3%]">
                {projects.map((item, index) => (
                  <article key={index}>
                    <div className="flex items-baseline justify-between gap-[4%]">
                      <h3 className="text-[2.95cqw] font-semibold leading-tight text-[#111827]">{item.name}</h3>
                      <span className="shrink-0 text-[2.1cqw] text-[#7a8ba3]">{item.startDate} - {item.endDate}</span>
                    </div>
                    {item.role ? <p className="mt-[0.7%] text-[2.3cqw] font-semibold text-[#09a9c8]">{item.role}</p> : null}
                    <div className="mt-[1.2%] bg-[#f3f8fb] px-[2%] py-[1.3%] text-[2.22cqw] leading-[1.45] text-[#42526a]">
                      技术栈：{skills.slice(0, 8).join(' + ') || '按岗位关键词突出核心能力'}
                    </div>
                    <BulletList items={item.description} />
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
