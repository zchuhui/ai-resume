import { Award, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useContactItems, sectionTitles, SectionHeader, ContactBlock, SkillTag } from './shared/ResumeHelpers'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'

interface ElegantTemplateProps {
  resume: Resume
  className?: string
}

export function ElegantTemplate({ resume, className }: ElegantTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('elegant')
  const { colors, fonts } = tokens

  const contactItems = useContactItems(resume)

  return (
    <div
      className={cn('w-full h-full flex flex-col', className)}
      style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Header Band */}
      <header
        className="relative overflow-hidden px-[6%] py-[6%]"
        style={{ background: colors.accent }}
      >
        <div
          className="absolute top-0 right-0 w-[35%] h-full opacity-10"
          style={{ background: `linear-gradient(135deg, ${colors.accent2}, transparent)` }}
        />
        <div className="relative z-10">
          <h1
            className="font-bold"
            style={{ fontFamily: fonts.heading, fontSize: '8.5%', color: colors.textInverse }}
          >
            {basicInfo.name}
          </h1>
          <div className="mt-3 mb-3" style={{ width: '10%', height: '2px', background: colors.accent2 }} />
          <p style={{ fontFamily: fonts.body, fontSize: '3.4%', color: colors.textInverse, opacity: 0.9 }}>
            {basicInfo.title}
          </p>
          <div className="mt-3" style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textInverse, opacity: 0.7 }}>
            <ContactBlock items={contactItems} tokens={tokens} variant="inline" />
          </div>
        </div>
      </header>

      {/* Main Body: asymmetric 35 / 65 */}
      <div className="flex flex-1 px-[5%] py-[5%] gap-[5%]">
        <div className="w-[35%] flex flex-col gap-[6%]">
          {summary && (
            <section>
              <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="icon" icon={BookOpen} />
              <p style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted, lineHeight: '1.7' }}>
                {summary}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="icon" icon={Award} />
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} tokens={tokens} index={index} variant="dot" />
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="icon" icon={BookOpen} />
              <div className="space-y-1">
                {languages.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                    <span style={{ color: colors.text, fontWeight: 500 }}>{item.language}</span>
                    <span style={{ color: colors.accent2, margin: '0 0.5rem' }}>·</span>
                    {item.proficiency}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="icon" icon={Award} />
              <div className="space-y-1">
                {certifications.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                    {item.name}
                    {item.issuer && <span style={{ color: colors.accent2, marginLeft: '0.5rem' }}>{item.issuer}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="w-[65%] flex flex-col gap-[6%]" style={{ borderLeft: `1px solid ${colors.border}`, paddingLeft: '5%' }}>
          {experience.length > 0 && (
            <section>
              <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="icon" icon={Award} />
              <div className="space-y-[4%]">
                {experience.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4%', color: colors.text, fontWeight: 600 }}>
                        {item.position}
                      </h3>
                      <span style={{ fontFamily: fonts.body, fontSize: '2.6%', color: colors.textMuted }}>
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    <p style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.accent, fontWeight: 500, marginTop: '0.25rem' }}>
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
            <section>
              <SectionHeader title={sectionTitles.education} tokens={tokens} variant="icon" icon={BookOpen} />
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
              <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="icon" icon={Award} />
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
