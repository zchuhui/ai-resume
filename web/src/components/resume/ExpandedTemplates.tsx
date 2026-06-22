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

// ── Sprint 1 新增模板 ──

/** 银行金融蓝：band 深蓝顶栏 + 60/40 双栏，稳重正式 */
export function FinanceTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('finance')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="px-[6%] py-[4%]" style={{ background: colors.accent, color: colors.textInverse }}>
        <h1 className="font-bold leading-tight" style={{ fontFamily: fonts.heading, fontSize: '7.8cqw' }}>{basicInfo.name}</h1>
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
              <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="underline" />
              <p style={{ fontSize: '2.8cqw', color: colors.textMuted, lineHeight: 1.7 }}>{summary}</p>
            </section>
          )}
          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
              <div className="space-y-[3.5%]">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-3 items-baseline">
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4cqw', color: colors.text, fontWeight: 700 }}>{item.position}</h3>
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
              <SectionHeader title={sectionTitles.education} tokens={tokens} variant="underline" />
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
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="underline" />
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 10).map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                ))}
              </div>
            </section>
          )}
          {projects.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="underline" />
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
              <SectionHeader title="资质 & 语言" tokens={tokens} variant="underline" />
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

/** 暖阳陶土：左标题头 + 双栏，温暖亲和 */
export function WarmTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('warm')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="px-[5%] pt-[4%] pb-[2.5%]" style={{ borderBottom: `2px solid ${colors.accent}` }}>
        <div className="flex justify-between gap-4 items-end">
          <div>
            <h1 className="font-bold leading-none" style={{ fontFamily: fonts.heading, fontSize: '6.8cqw', color: colors.text }}>{basicInfo.name}</h1>
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
              <p style={{ fontSize: '2.5cqw', color: colors.textMuted, lineHeight: 1.55 }}>{summary}</p>
            </section>
          )}
          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
              <div className="space-y-[2.4%]">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between gap-2 items-baseline">
                      <h3 className="font-bold" style={{ fontSize: '3cqw', color: colors.text }}>{item.position}</h3>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                    <p style={{ fontSize: '2.5cqw', color: colors.accent, fontWeight: 600 }}>
                      {item.company}{item.location ? ` · ${item.location}` : ''}
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {item.description.slice(0, 3).map((desc, i) => (
                        <li key={i} style={{ fontSize: '2.4cqw', color: colors.textMuted, lineHeight: 1.4 }}>{desc}</li>
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
                    {item.description.slice(0, 2).map((desc, i) => (
                      <p key={i} style={{ fontSize: '2.35cqw', color: colors.textMuted, lineHeight: 1.35 }}>{desc}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-[3%]" style={{ borderLeft: `1px solid ${colors.borderLight}`, paddingLeft: '4%' }}>
          {skills.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="underline" />
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 12).map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="pill" />
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
          {(certifications?.length || languages?.length) ? (
            <section>
              <SectionHeader title="资质 & 语言" tokens={tokens} variant="underline" />
              {certifications?.slice(0, 4).map((item, index) => (
                <p key={`cert-${index}`} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
              ))}
              {languages?.map((item, index) => (
                <p key={`lang-${index}`} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}

/** 杂志风：大衬线标题 + 非对称留白，适合品牌与内容岗 */
export function EditorialTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('editorial')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="px-[6%] py-[4%]" style={{ background: colors.accent, color: colors.textInverse }}>
        <h1 className="font-bold leading-tight italic" style={{ fontFamily: fonts.heading, fontSize: '8cqw' }}>{basicInfo.name}</h1>
        <p className="mt-2" style={{ fontSize: '3cqw', opacity: 0.85 }}>{basicInfo.title}</p>
        {contactItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: '2.4cqw', opacity: 0.8 }}>
            {contactItems.map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        )}
      </header>

      <main className="flex-1 px-[6%] py-[4%] flex flex-col gap-[4%]">
        {summary && (
          <section>
            <p className="font-medium italic" style={{ fontSize: '3.2cqw', color: colors.accent, fontFamily: fonts.heading, lineHeight: 1.5 }}>{summary}</p>
          </section>
        )}

        <div className="flex gap-[5%]">
          <div className="w-[58%] flex flex-col gap-[4%]">
            {experience.length > 0 && (
              <section>
                <h2 className="font-bold uppercase tracking-wider mb-[2%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.1em' }}>
                  {sectionTitles.experience}
                </h2>
                <div className="space-y-[3%]">
                  {experience.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between gap-3 items-baseline">
                        <h3 style={{ fontFamily: fonts.heading, fontSize: '3.6cqw', color: colors.text, fontWeight: 700 }}>{item.position}</h3>
                        <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                      </div>
                      <p className="mt-1" style={{ fontSize: '2.6cqw', color: colors.accent2, fontWeight: 600 }}>
                        {item.company}{item.location ? ` · ${item.location}` : ''}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {item.description.map((desc, i) => (
                          <li key={i} style={{ fontSize: '2.55cqw', color: colors.textMuted, lineHeight: 1.55 }}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {education.length > 0 && (
              <section>
                <h2 className="font-bold uppercase tracking-wider mb-[2%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.1em' }}>
                  {sectionTitles.education}
                </h2>
                <div className="space-y-[2.5%]">
                  {education.map((item, index) => (
                    <div key={index} className="flex justify-between gap-3 items-baseline">
                      <div>
                        <h3 style={{ fontFamily: fonts.heading, fontSize: '3cqw', color: colors.text, fontWeight: 700 }}>{item.school}</h3>
                        <p style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                      </div>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="w-[42%] flex flex-col gap-[4%] pt-[2%]">
            {skills.length > 0 && (
              <section>
                <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.1em' }}>
                  {sectionTitles.skills}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, index) => (
                    <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                  ))}
                </div>
              </section>
            )}
            {projects.length > 0 && (
              <section>
                <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.1em' }}>
                  {sectionTitles.projects}
                </h2>
                <div className="space-y-[3%]">
                  {projects.slice(0, 3).map((item, index) => (
                    <div key={index}>
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '2.8cqw', color: colors.text, fontWeight: 700 }}>{item.name}</h3>
                      {item.description.slice(0, 2).map((desc, i) => (
                        <p key={i} style={{ fontSize: '2.4cqw', color: colors.textMuted, lineHeight: 1.4 }}>{desc}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {(certifications?.length || languages?.length) ? (
              <section>
                <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.1em' }}>
                  资质 & 语言
                </h2>
                {certifications?.map((item, index) => (
                  <p key={`cert-${index}`} style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
                ))}
                {languages?.map((item, index) => (
                  <p key={`lang-${index}`} style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
                ))}
              </section>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Sprint 2 新增模板 ──
/** 极光渐变：紫蓝渐变顶栏 + 玻璃拟态 + 非对称双栏 */
export function AuroraTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('aurora')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="relative px-[6%] pt-[5%] pb-[3%] overflow-hidden" style={{
        background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2}, ${colors.accent3})`,
        color: colors.textInverse,
      }}>
        <div className="relative z-10">
          <h1 className="font-bold tracking-tight" style={{ fontFamily: fonts.heading, fontSize: '7.6cqw' }}>{basicInfo.name}</h1>
          <p className="mt-2" style={{ fontSize: '3.2cqw', opacity: 0.9 }}>{basicInfo.title}</p>
          {contactItems.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: '2.4cqw', opacity: 0.85 }}>
              {contactItems.map((item) => <span key={item.key}>{item.value}</span>)}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-[5%] py-[4%] flex gap-[4%]">
        <div className="w-[58%] flex flex-col gap-[4%]">
          {summary && (
            <div style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              padding: '3.5% 4%',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <p className="font-medium" style={{ fontSize: '2.9cqw', color: colors.text, lineHeight: 1.6, fontFamily: fonts.heading }}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-[2.5%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.08em' }}>
                {sectionTitles.experience}
              </h2>
              <div className="space-y-[3%]">
                {experience.map((item, index) => (
                  <div key={index} className="relative" style={{
                    background: colors.surface,
                    borderRadius: '8px',
                    border: `1px solid ${colors.borderLight}`,
                    padding: '3% 3.5%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}>
                    <div className="flex justify-between gap-3 items-baseline">
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4cqw', color: colors.text, fontWeight: 700 }}>{item.position}</h3>
                      <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                    </div>
                    <p className="mt-1" style={{ fontSize: '2.7cqw', color: colors.accent, fontWeight: 600 }}>
                      {item.company}{item.location ? ` · ${item.location}` : ''}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {item.description.map((desc, i) => (
                        <li key={i} style={{ fontSize: '2.55cqw', color: colors.textMuted, lineHeight: 1.55 }}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-[2%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.08em' }}>
                {sectionTitles.projects}
              </h2>
              <div className="space-y-[2.5%]">
                {projects.slice(0, 2).map((item, index) => (
                  <div key={index}>
                    <h3 className="font-bold" style={{ fontSize: '3cqw', color: colors.text }}>{item.name}</h3>
                    {item.description.slice(0, 2).map((desc, i) => (
                      <p key={i} style={{ fontSize: '2.5cqw', color: colors.textMuted, lineHeight: 1.5 }}>{desc}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-[42%] flex flex-col gap-[4%] pt-[1%]" style={{ borderLeft: `1px solid ${colors.borderLight}`, paddingLeft: '4%' }}>
          {education.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.08em' }}>
                {sectionTitles.education}
              </h2>
              <div className="space-y-[3.5%]">
                {education.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-bold" style={{ fontSize: '3cqw', color: colors.text }}>{item.school}</h3>
                    <p style={{ fontSize: '2.5cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                    <DateRange start={item.startDate} end={item.endDate} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.08em' }}>
                {sectionTitles.skills}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 12).map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                ))}
              </div>
            </section>
          )}

          {(certifications?.length || languages?.length) ? (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.08em' }}>
                资质 &amp; 语言
              </h2>
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

/** 作品集网格：卡片式项目网格 + 双栏阴影，适合设计师和展示型简历 */
export function PortfolioTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('portfolio')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <aside className="w-[32%] p-[4%] flex flex-col" style={{ background: colors.surface, borderRight: `1px solid ${colors.border}` }}>
        <div className="mb-[6%]">
          <h1 className="font-bold leading-tight" style={{ fontFamily: fonts.heading, fontSize: '5.2cqw', color: colors.text }}>
            {basicInfo.name}
          </h1>
          <p className="mt-2 font-semibold" style={{ fontSize: '2.8cqw', color: colors.accent }}>
            {basicInfo.title}
          </p>
        </div>

        <div className="mb-[6%]">
          <ContactBlock items={contactItems} tokens={tokens} variant="stack" />
        </div>

        {skills.length > 0 && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="bar" />
            <div className="space-y-2">
              {skills.slice(0, 10).map((skill, index) => (
                <ProgressSkill key={index} skill={skill} tokens={tokens} index={index} />
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.education} tokens={tokens} variant="bar" />
            <div className="space-y-[3.5%]">
              {education.map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold" style={{ fontSize: '2.8cqw', color: colors.text }}>{item.school}</h3>
                  <p style={{ fontSize: '2.4cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                  <DateRange start={item.startDate} end={item.endDate} />
                </div>
              ))}
            </div>
          </section>
        )}

        {(certifications?.length || languages?.length) ? (
          <section>
            <SectionHeader title="资质 &amp; 语言" tokens={tokens} variant="bar" />
            {certifications?.slice(0, 3).map((item, index) => (
              <p key={`cert-${index}`} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.name}{item.issuer ? ` · ${item.issuer}` : ''}</p>
            ))}
            {languages?.map((item, index) => (
              <p key={`lang-${index}`} style={{ fontSize: '2.35cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
            ))}
          </section>
        ) : null}
      </aside>

      <main className="flex-1 p-[4%] flex flex-col gap-[4%] overflow-hidden">
        {summary && (
          <p className="font-medium" style={{ fontSize: '2.9cqw', color: colors.textMuted, lineHeight: 1.6 }}>{summary}</p>
        )}

        {projects.length > 0 && (
          <section>
            <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="underline" />
            <div className="grid grid-cols-2 gap-[3%]">
              {projects.slice(0, 4).map((item, index) => (
                <div key={index} style={{
                  background: colors.surface,
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  padding: '4% 5%',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <h3 className="font-bold mb-1" style={{ fontSize: '3cqw', color: colors.text, fontFamily: fonts.heading }}>{item.name}</h3>
                  {item.role && <p style={{ fontSize: '2.4cqw', color: colors.accent, fontWeight: 600 }}>{item.role}</p>}
                  {item.description.slice(0, 2).map((desc, i) => (
                    <p key={i} className="mt-1" style={{ fontSize: '2.25cqw', color: colors.textMuted, lineHeight: 1.35 }}>{desc}</p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
            <div className="space-y-[2.5%]">
              {experience.slice(0, 3).map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between gap-3 items-baseline">
                    <h3 className="font-bold" style={{ fontSize: '3cqw', color: colors.text }}>{item.position}</h3>
                    <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                  </div>
                  <p className="mt-0.5 font-semibold" style={{ fontSize: '2.5cqw', color: colors.accent }}>
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {item.description.slice(0, 2).map((desc, i) => (
                      <li key={i} style={{ fontSize: '2.35cqw', color: colors.textMuted, lineHeight: 1.4 }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

/** 暗夜鎏金：深色背景 + 金色点缀，单栏居中布局，适合高端顾问和奢侈品行业 */
export function NoirTemplate({ resume, className }: TemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('noir')
  const { colors, fonts } = tokens
  const contactItems = useContactItems(resume)

  return (
    <div className={cn('w-full h-full flex flex-col', className)} style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}>
      <header className="text-center px-[6%] pt-[5%] pb-[3%]" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <h1 className="font-bold leading-tight tracking-wide" style={{ fontFamily: fonts.heading, fontSize: '8.4cqw', color: colors.accent }}>
          {basicInfo.name}
        </h1>
        <p className="mt-3 font-medium tracking-wider uppercase" style={{ fontSize: '2.8cqw', color: colors.text, letterSpacing: '0.2em' }}>{basicInfo.title}</p>
        {contactItems.length > 0 && (
          <div className="mt-4 flex justify-center flex-wrap gap-x-6 gap-y-1" style={{ fontSize: '2.3cqw', color: colors.textMuted }}>
            {contactItems.map((item, index, arr) => (
              <span key={item.key}>
                {item.value}{index < arr.length - 1 ? <span style={{ margin: '0 0.5em', color: colors.accent }}>·</span> : null}
              </span>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 px-[8%] py-[4%] flex flex-col gap-[4%] overflow-hidden" style={{ maxWidth: '100%' }}>
        {summary && (
          <section className="text-center">
            <p style={{ fontSize: '3.2cqw', color: colors.textMuted, fontFamily: fonts.heading, fontStyle: 'italic', lineHeight: 1.6 }}>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-center mb-[3%]" style={{ fontSize: '2.8cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.2em' }}>
              {sectionTitles.experience}
            </h2>
            <div className="space-y-[3%]">
              {experience.map((item, index) => (
                <div key={index} className="relative" style={{ borderLeft: `1px solid ${colors.accent}`, paddingLeft: '3%' }}>
                  <div className="flex justify-between gap-3 items-baseline">
                    <h3 className="font-bold" style={{ fontSize: '3.6cqw', color: colors.text, fontFamily: fonts.heading }}>{item.position}</h3>
                    <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                  </div>
                  <p className="mt-1 font-semibold tracking-wide uppercase" style={{ fontSize: '2.4cqw', color: colors.accent, letterSpacing: '0.05em' }}>
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontSize: '2.55cqw', color: colors.textMuted, lineHeight: 1.55 }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="font-bold uppercase tracking-widest text-center mb-[3%]" style={{ fontSize: '2.8cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.2em' }}>
              {sectionTitles.projects}
            </h2>
            <div className="space-y-[2%]">
              {projects.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between gap-4 items-baseline">
                  <h3 className="font-bold" style={{ fontSize: '3cqw', color: colors.text }}>{item.name}</h3>
                  <DateRange start={item.startDate} end={item.endDate} className="shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-[3%]">
          {education.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-widest mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.15em' }}>
                {sectionTitles.education}
              </h2>
              {education.slice(0, 2).map((item, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-bold" style={{ fontSize: '2.8cqw', color: colors.text }}>{item.school}</h3>
                  <p style={{ fontSize: '2.3cqw', color: colors.textMuted }}>{item.degree}{item.field ? ` · ${item.field}` : ''}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-widest mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.15em' }}>
                {sectionTitles.skills}
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 10).map((skill, index) => (
                  <span key={index} style={{
                    fontSize: '2.3cqw', color: colors.text, background: colors.surface,
                    border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '1px 6px',
                  }}>{skill}</span>
                ))}
              </div>
            </section>
          )}

          {(certifications?.length || languages?.length) ? (
            <section>
              <h2 className="font-bold uppercase tracking-widest mb-[3%]" style={{ fontSize: '2.6cqw', color: colors.accent, fontFamily: fonts.heading, letterSpacing: '0.15em' }}>
                资质 &amp; 语言
              </h2>
              {certifications?.slice(0, 3).map((item, index) => (
                <p key={`cert-${index}`} style={{ fontSize: '2.3cqw', color: colors.textMuted }}>{item.name}</p>
              ))}
              {languages?.map((item, index) => (
                <p key={`lang-${index}`} style={{ fontSize: '2.3cqw', color: colors.textMuted }}>{item.language} · {item.proficiency}</p>
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}
