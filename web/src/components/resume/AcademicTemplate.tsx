import { cn } from '@/lib/utils'
import { useContactItems, sectionTitles, SectionHeader, ContactBlock, TimelineItem, SkillTag } from './shared/ResumeHelpers'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'

interface AcademicTemplateProps {
  resume: Resume
  className?: string
}

export function AcademicTemplate({ resume, className }: AcademicTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('academic')
  const { colors, fonts } = tokens

  const contactItems = useContactItems(resume)

  return (
    <div
      className={cn('w-full h-full flex flex-col', className)}
      style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Header */}
      <header
        className="px-[6%] pt-[5%] pb-[3%]"
        style={{ borderBottom: `2px solid ${colors.accent}` }}
      >
        <h1
          className="font-bold leading-tight"
          style={{ fontFamily: fonts.heading, fontSize: '7%', color: colors.text }}
        >
          {basicInfo.name}
        </h1>
        <p className="mt-2" style={{ fontFamily: fonts.body, fontSize: '3.2%', color: colors.textMuted }}>
          {basicInfo.title}
        </p>
        <div className="mt-3">
          <ContactBlock items={contactItems} tokens={tokens} variant="inline" />
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 px-[5%] py-[4%] gap-[5%]">
        <div className="w-[30%] flex flex-col gap-[5%]">
          {education.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.education} tokens={tokens} variant="underline" />
              <div className="space-y-[3%]">
                {education.map((item, index) => (
                  <div key={index}>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.2%', color: colors.text, fontWeight: 600 }}>
                      {item.school}
                    </h3>
                    <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                      {item.degree}{item.field ? ` · ${item.field}` : ''}
                    </p>
                    <p style={{ fontFamily: fonts.body, fontSize: '2.4%', color: colors.accent2, marginTop: '0.25rem' }}>
                      {item.startDate} - {item.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="underline" />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="outline" />
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="underline" />
              <div className="space-y-1">
                {languages.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                    <span style={{ color: colors.text, fontWeight: 600 }}>{item.language}</span>
                    <span style={{ color: colors.accent2, margin: '0 0.4rem' }}>·</span>
                    {item.proficiency}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="underline" />
              <div className="space-y-1">
                {certifications.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                    {item.name}
                    {item.issuer && <span style={{ color: colors.accent2, marginLeft: '0.4rem' }}>· {item.issuer}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-[70%] flex flex-col gap-[5%]">
          {summary && (
            <section>
              <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="underline" />
              <p
                className="italic"
                style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted, lineHeight: '1.7', borderLeft: `2px solid ${colors.accent}`, paddingLeft: '3%' }}
              >
                {summary}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="underline" />
              <div className="space-y-[3.5%]">
                {experience.map((item, index) => (
                  <TimelineItem
                    key={index}
                    title={item.position}
                    subtitle={`${item.company}${item.location ? ` · ${item.location}` : ''}`}
                    date={`${item.startDate} - ${item.endDate}`}
                    descriptions={item.description}
                    tokens={tokens}
                    index={index}
                    last={index === experience.length - 1}
                  />
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="underline" />
              <div className="space-y-[3%]">
                {projects.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '3.2%', color: colors.text, fontWeight: 600 }}>
                        {item.name}
                      </h3>
                      <span style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.accent, fontWeight: 500, marginTop: '0.25rem' }}>
                      {item.role}
                    </p>
                    <ul className="mt-1.5 space-y-1">
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
        </div>
      </div>
    </div>
  )
}
