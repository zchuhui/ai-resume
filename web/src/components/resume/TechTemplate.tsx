import { cn } from '@/lib/utils'
import { useContactItems, sectionTitles, SectionHeader, ContactBlock, ProgressSkill, Card } from './shared/ResumeHelpers'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'

interface TechTemplateProps {
  resume: Resume
  className?: string
}

export function TechTemplate({ resume, className }: TechTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('tech')
  const { colors, fonts } = tokens

  const contactItems = useContactItems(resume)

  return (
    <div
      className={cn('w-full h-full flex', className)}
      style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Sidebar */}
      <aside
        className="w-[32%] p-[4%] flex flex-col"
        style={{ background: colors.surface, borderRight: `1px solid ${colors.border}` }}
      >
        <div className="mb-[8%]">
          <h1
            className="font-bold leading-tight"
            style={{ fontFamily: fonts.heading, fontSize: '5.5%', color: colors.text }}
          >
            {basicInfo.name}
          </h1>
          <div className="h-1 mt-2 rounded-full" style={{ width: '25%', background: 'linear-gradient(90deg, ' + colors.accent + ', ' + colors.accent2 + ')' }} />
          <p className="mt-3" style={{ fontFamily: fonts.mono, fontSize: '2.6%', color: colors.textMuted }}>
            {basicInfo.title}
          </p>
        </div>

        <div className="mb-[8%]">
          <ContactBlock items={contactItems} tokens={tokens} variant="stack" />
        </div>

        {skills.length > 0 && (
          <div className="mb-[8%]">
            <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="bar" />
            <div className="space-y-3">
              {skills.slice(0, 10).map((skill, index) => (
                <ProgressSkill key={index} skill={skill} tokens={tokens} index={index} />
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="mb-[8%]">
            <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="bar" />
            <div className="space-y-1.5">
              {languages.map((item, index) => (
                <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                  {item.language} · <span style={{ color: colors.text }}>{item.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="bar" />
            <div className="space-y-1.5">
              {certifications.map((item, index) => (
                <div key={index} style={{ fontFamily: fonts.mono, fontSize: '2.4%', color: colors.textMuted }}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-[68%] p-[5%] flex flex-col">
        {summary && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="bar" />
            <p
              className="pl-3 border-l-2"
              style={{
                fontFamily: fonts.body,
                fontSize: '3%',
                color: colors.textMuted,
                lineHeight: '1.7',
                borderColor: colors.accent,
              }}
            >
              {summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="bar" />
            <div className="space-y-[4%]">
              {experience.map((item, index) => (
                <div key={index} className="relative pl-3">
                  <div
                    className="absolute left-0 top-1 w-2 h-2 rounded-full"
                    style={{ background: colors.accent, boxShadow: `0 0 0 4px ${colors.bg}` }}
                  />
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4%', color: colors.text, fontWeight: 600 }}>
                      {item.position}
                    </h3>
                    <span style={{ fontFamily: fonts.mono, fontSize: '2.6%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.accent, fontWeight: 500, marginTop: '0.25rem' }}>
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted, lineHeight: '1.5' }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.education} tokens={tokens} variant="bar" />
            <div className="space-y-[3%]">
              {education.map((item, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.2%', color: colors.text, fontWeight: 600 }}>
                      {item.school}
                    </h3>
                    <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                      {item.degree}{item.field ? ` · ${item.field}` : ''}
                    </p>
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: '2.6%', color: colors.textMuted }}>
                    {item.startDate} - {item.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="bar" />
            <div className="grid grid-cols-1 gap-3">
              {projects.map((item, index) => (
                <Card key={index} tokens={tokens}>
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3%', color: colors.text, fontWeight: 600 }}>
                      {item.name}
                    </h3>
                    <span style={{ fontFamily: fonts.mono, fontSize: '2.4%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.accent, fontWeight: 500, marginTop: '0.25rem' }}>
                    {item.role}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted, lineHeight: '1.5' }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
