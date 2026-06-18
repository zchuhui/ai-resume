import { cn } from '@/lib/utils'
import { useContactItems, sectionTitles, SectionHeader, ContactBlock, SkillTag, Card } from './shared/ResumeHelpers'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'

interface CreativeTemplateProps {
  resume: Resume
  className?: string
}

export function CreativeTemplate({ resume, className }: CreativeTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('creative')
  const { colors, fonts } = tokens

  const contactItems = useContactItems(resume)

  return (
    <div
      className={cn('w-full h-full flex', className)}
      style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Left Sidebar: dark purple surface */}
      <aside
        className="w-[40%] p-[5%] flex flex-col relative overflow-hidden"
        style={{ background: colors.surface }}
      >
        {/* geometric decoration */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
          style={{ background: colors.accent }}
        />
        <div
          className="absolute bottom-12 -left-6 w-20 h-20 rotate-45 opacity-20"
          style={{ background: colors.accent2 }}
        />

        <div className="relative z-10 mb-[8%]">
          <h1
            className="font-bold leading-none"
            style={{ fontFamily: fonts.heading, fontSize: '8%', color: colors.textInverse }}
          >
            {basicInfo.name}
          </h1>
          <div className="w-10 h-1 mt-4" style={{ background: colors.accent }} />
          <p className="mt-3" style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textInverse, opacity: 0.8 }}>
            {basicInfo.title}
          </p>
        </div>

        <div className="relative z-10 mb-[8%]">
          <ContactBlock items={contactItems} tokens={tokens} variant="icon-circle" />
        </div>

        {summary && (
          <div className="relative z-10 mb-[8%]">
            <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="pill" />
            <p style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textInverse, opacity: 0.85, lineHeight: '1.7' }}>
              {summary}
            </p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="relative z-10 mb-[8%]">
            <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="pill" />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="pill" />
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div className="relative z-10 mb-[8%]">
            <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="pill" />
            <div className="space-y-1.5">
              {languages.map((item, index) => (
                <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textInverse, opacity: 0.8 }}>
                  <span style={{ fontWeight: 600, color: colors.textInverse }}>{item.language}</span>
                  <span style={{ color: colors.accent, margin: '0 0.5rem' }}>·</span>
                  {item.proficiency}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="relative z-10">
            <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="pill" />
            <div className="space-y-1.5">
              {certifications.map((item, index) => (
                <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textInverse, opacity: 0.8 }}>
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: colors.accent }} />
                  {item.name}
                  {item.issuer && <span style={{ opacity: 0.6, marginLeft: '0.4rem' }}>· {item.issuer}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-[60%] p-[5%] flex flex-col">
        {experience.length > 0 && (
          <section className="mb-[5%]">
            <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="bar" />
            <div className="space-y-[4%]">
              {experience.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4%', color: colors.text, fontWeight: 700 }}>
                      {item.position}
                    </h3>
                    <span style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.accent, fontWeight: 600, marginTop: '0.25rem' }}>
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
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.2%', color: colors.text, fontWeight: 700 }}>
                      {item.school}
                    </h3>
                    <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                      {item.degree}{item.field ? ` · ${item.field}` : ''}
                    </p>
                  </div>
                  <span style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
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
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3%', color: colors.text, fontWeight: 700 }}>
                      {item.name}
                    </h3>
                    <span style={{ fontFamily: fonts.body, fontSize: '2.4%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.accent2, fontWeight: 600, marginTop: '0.25rem' }}>
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
