import { cn } from '@/lib/utils'
import { getTokens } from './shared/design-tokens'
import { ContactBlock, SectionHeader, SkillTag, ProgressSkill, sectionTitles, useContactItems } from './shared/ResumeHelpers'
import type { Resume } from '@/types/resume'

interface TemplateProps {
  resume: Resume
  className?: string
}

function DateRange({ start, end, className }: { start?: string; end?: string; className?: string }) {
  if (!start && !end) return null
  return <span className={className} style={{ fontSize: '2.35cqw', color: 'inherit' }}>{start}{start && end ? ' - ' : ''}{end}</span>
}

export function CobaltTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('cobalt')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <aside className="w-[33%] p-[4.5%] flex flex-col" style={{ background: colors.surface, borderRight: `1px solid ${colors.border}` }}>
        <div className="mb-[8%]">
          <div className="w-[22%] aspect-square rounded-full mb-4" style={{ background: colors.accent }} />
          <h1 className="font-bold leading-tight" style={{ fontFamily: fonts.heading, fontSize: '5.6cqw', color: colors.text }}>
            {basicInfo.name}
          </h1>
          <p className="mt-2 font-medium" style={{ fontFamily: fonts.body, fontSize: '2.8cqw', color: colors.accent }}>
            {basicInfo.title}
          </p>
        </div>

        <div className="mb-[8%]">
          <ContactBlock items={contactItems} tokens={tokens} variant="stack" />
        </div>

        {skills.length > 0 && (
          <section className="mb-[8%]">
            <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="bar" />
            <div className="space-y-2">
              {skills.slice(0, 12).map((skill, index) => (
                <ProgressSkill key={index} skill={skill} tokens={tokens} index={index} />
              ))}
            </div>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section className="mb-[8%]">
            <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="bar" />
            <div className="space-y-1.5">
              {languages.map((item, index) => (
                <div key={index} style={{ fontSize: '2.5cqw', color: colors.textMuted }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>{item.language}</span> · {item.proficiency}
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section>
            <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="bar" />
            <div className="space-y-1.5">
              {certifications.map((item, index) => (
                <div key={index} style={{ fontSize: '2.4cqw', color: colors.textMuted }}>
                  <span style={{ color: colors.text, fontWeight: 600 }}>{item.name}</span>
                  {item.date ? <span> · {item.date}</span> : null}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      <main className="w-[67%] p-[5%] flex flex-col">
        {summary && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="underline" />
            <p style={{ fontSize: '2.9cqw', color: colors.textMuted, lineHeight: 1.7 }}>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
            <div className="space-y-[4%]">
              {experience.map((item, index) => (
                <div key={index} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full" style={{ background: colors.accent }} />
                  <div className="flex justify-between gap-3 items-baseline">
                    <h3 className="font-semibold" style={{ fontFamily: fonts.heading, fontSize: '3.4cqw', color: colors.text }}>
                      {item.position}
                    </h3>
                    <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                  </div>
                  <p className="mt-1 font-medium" style={{ fontSize: '2.9cqw', color: colors.accent }}>
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontSize: '2.7cqw', color: colors.textMuted, lineHeight: 1.5 }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="underline" />
            <div className="space-y-[3%]">
              {projects.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between gap-3 items-baseline">
                    <h3 className="font-semibold" style={{ fontSize: '3.1cqw', color: colors.text }}>{item.name}</h3>
                    <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                  </div>
                  {item.role ? <p style={{ fontSize: '2.7cqw', color: colors.accent }}>{item.role}</p> : null}
                  <ul className="mt-1 space-y-1">
                    {item.description.slice(0, 2).map((desc, i) => (
                      <li key={i} style={{ fontSize: '2.6cqw', color: colors.textMuted, lineHeight: 1.5 }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionHeader title={sectionTitles.education} tokens={tokens} variant="underline" />
            <div className="space-y-[2.5%]">
              {education.map((item, index) => (
                <div key={index} className="flex justify-between gap-3 items-baseline">
                  <div>
                    <h3 className="font-semibold" style={{ fontSize: '3cqw', color: colors.text }}>{item.school}</h3>
                    <p style={{ fontSize: '2.6cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                  </div>
                  <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export function CorporateTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('corporate')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="px-[6%] py-[5%]" style={{ background: colors.accent, color: colors.textInverse }}>
        <h1 className="font-bold leading-tight" style={{ fontFamily: fonts.heading, fontSize: '7.2cqw' }}>{basicInfo.name}</h1>
        <p className="mt-2" style={{ fontSize: '3cqw', opacity: 0.9 }}>{basicInfo.title}</p>
        {contactItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: '2.4cqw', opacity: 0.85 }}>
            {contactItems.map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        )}
      </header>

      <main className="flex-1 px-[6%] py-[4%] flex gap-[4%]">
        <div className="w-[60%] flex flex-col gap-[4%]">
          {summary && (
            <section>
              <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="minimal" />
              <p style={{ fontSize: '2.8cqw', color: colors.textMuted, lineHeight: 1.7 }}>{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="minimal" />
              <div className="space-y-[3.5%]">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-3 items-baseline">
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '3.3cqw', color: colors.text, fontWeight: 700 }}>{item.position}</h3>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                    <p className="mt-1" style={{ fontSize: '2.8cqw', color: colors.accent, fontWeight: 600 }}>
                      {item.company}{item.location ? ` · ${item.location}` : ''}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {item.description.map((desc, i) => (
                        <li key={i} style={{ fontSize: '2.6cqw', color: colors.textMuted, lineHeight: 1.5 }}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-[40%] flex flex-col gap-[4%]" style={{ borderLeft: `1px solid ${colors.border}`, paddingLeft: '4%' }}>
          {education.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.education} tokens={tokens} variant="minimal" />
              <div className="space-y-[3%]">
                {education.map((item, index) => (
                  <div key={index}>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3cqw', color: colors.text, fontWeight: 700 }}>{item.school}</h3>
                    <p style={{ fontSize: '2.6cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                    <DateRange start={item.startDate} end={item.endDate} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="minimal" />
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 10).map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="minimal" />
              <div className="space-y-[3%]">
                {projects.slice(0, 2).map((item, index) => (
                  <div key={index}>
                    <h3 style={{ fontSize: '2.9cqw', color: colors.text, fontWeight: 700 }}>{item.name}</h3>
                    {item.description.slice(0, 2).map((desc, i) => (
                      <p key={i} style={{ fontSize: '2.5cqw', color: colors.textMuted, lineHeight: 1.45 }}>{desc}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certifications?.length || languages?.length) ? (
            <section>
              <SectionHeader title="附加信息" tokens={tokens} variant="minimal" />
              {certifications?.map((item, index) => (
                <p key={`cert-${index}`} style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
              ))}
              {languages?.map((item, index) => (
                <p key={`lang-${index}`} style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export function CompactTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('compact')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="px-[5%] pt-[4%] pb-[2.5%]" style={{ borderBottom: `2px solid ${colors.accent}` }}>
        <div className="flex justify-between gap-4 items-end">
          <div>
            <h1 className="font-bold leading-none" style={{ fontFamily: fonts.heading, fontSize: '6.4cqw', color: colors.text }}>{basicInfo.name}</h1>
            <p className="mt-1 font-semibold" style={{ fontSize: '2.8cqw', color: colors.accent }}>{basicInfo.title}</p>
          </div>
          <div className="text-right" style={{ fontSize: '2.2cqw', color: colors.textMuted }}>
            {contactItems.slice(0, 4).map((item) => <div key={item.key}>{item.value}</div>)}
          </div>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-[3%] grid grid-cols-[1.35fr_0.85fr] gap-[4%] overflow-hidden">
        <div className="space-y-[3%]">
          {summary && (
            <section>
              <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="underline" />
              <p style={{ fontSize: '2.45cqw', color: colors.textMuted, lineHeight: 1.45 }}>{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
              <div className="space-y-[2.4%]">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-2 items-baseline">
                      <h3 className="font-bold" style={{ fontSize: '2.95cqw', color: colors.text }}>{item.position}</h3>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                    <p style={{ fontSize: '2.5cqw', color: colors.accent, fontWeight: 600 }}>
                      {item.company}{item.location ? ` · ${item.location}` : ''}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {item.description.slice(0, 3).map((desc, i) => (
                        <li key={i} style={{ fontSize: '2.35cqw', color: colors.textMuted, lineHeight: 1.35 }}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="underline" />
              <div className="space-y-[2%]">
                {projects.slice(0, 3).map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-2 items-baseline">
                      <h3 className="font-bold" style={{ fontSize: '2.8cqw', color: colors.text }}>{item.name}</h3>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                    <p style={{ fontSize: '2.3cqw', color: colors.textMuted }}>{item.description[0]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-[3.5%]">
          {skills.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="underline" />
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 14).map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.education} tokens={tokens} variant="underline" />
              <div className="space-y-2">
                {education.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-bold" style={{ fontSize: '2.8cqw', color: colors.text }}>{item.school}</h3>
                    <p style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                    <DateRange start={item.startDate} end={item.endDate} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="underline" />
              {certifications.slice(0, 4).map((item, index) => (
                <p key={index} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
              ))}
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="underline" />
              {languages.map((item, index) => (
                <p key={index} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
