import { cn } from '@/lib/utils'
import { useContactItems, sectionTitles, SectionHeader, ContactBlock } from './shared/ResumeHelpers'
import { getTokens } from './shared/design-tokens'
import type { Resume } from '@/types/resume'

interface MinimalistTemplateProps {
  resume: Resume
  className?: string
}

export function MinimalistTemplate({ resume, className }: MinimalistTemplateProps) {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const tokens = getTokens('minimalist')
  const { colors, fonts, layout } = tokens

  const contactItems = useContactItems(resume)

  return (
    <div
      className={cn('w-full h-full flex flex-col', className)}
      style={{ background: colors.bg, color: colors.text, fontFamily: fonts.body }}
    >
      {/* Header: centered, lots of whitespace */}
      <header className="px-[10%] pt-[10%] pb-[4%] text-center">
        <h1
          className="font-bold tracking-tight leading-none"
          style={{ fontFamily: fonts.heading, fontSize: '10%', color: colors.text }}
        >
          {basicInfo.name}
        </h1>
        <p
          className="mt-4"
          style={{ fontFamily: fonts.body, fontSize: '3.2%', color: colors.textMuted, letterSpacing: '0.05em' }}
        >
          {basicInfo.title}
        </p>
        <div className="mt-6 flex justify-center">
          <div style={{ width: '12%', height: '1px', background: colors.accent }} />
        </div>
        <div className="mt-5">
          <ContactBlock items={contactItems} tokens={tokens} variant="inline" />
        </div>
      </header>

      <main className="flex-1 px-[10%] pb-[8%] overflow-hidden">
        {summary && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.summary} tokens={tokens} variant="minimal" />
            <p style={{ fontFamily: fonts.body, fontSize: '3.2%', color: colors.textMuted, lineHeight: '1.7' }}>
              {summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.experience} tokens={tokens} variant="minimal" />
            <div className="space-y-[4%]">
              {experience.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.6%', color: colors.text, fontWeight: 600 }}>
                      {item.position}
                    </h3>
                    <span style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted, marginTop: '0.25rem' }}>
                    {item.company}{item.location ? ` · ${item.location}` : ''}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted, lineHeight: '1.6' }}>
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
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.education} tokens={tokens} variant="minimal" />
            <div className="space-y-[3%]">
              {education.map((item, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4%', color: colors.text, fontWeight: 600 }}>
                      {item.school}
                    </h3>
                    <p style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted }}>
                      {item.degree}{item.field ? ` · ${item.field}` : ''}
                    </p>
                  </div>
                  <span style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                    {item.startDate} - {item.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.projects} tokens={tokens} variant="minimal" />
            <div className="space-y-[3%]">
              {projects.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 style={{ fontFamily: fonts.heading, fontSize: '3.4%', color: colors.text, fontWeight: 600 }}>
                      {item.name}
                    </h3>
                    <span style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                      {item.startDate} - {item.endDate}
                    </span>
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted, marginTop: '0.25rem' }}>
                    {item.role}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} style={{ fontFamily: fonts.body, fontSize: '3%', color: colors.textMuted, lineHeight: '1.6' }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-[6%]">
            <SectionHeader title={sectionTitles.skills} tokens={tokens} variant="minimal" />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1"
                  style={{
                    fontFamily: fonts.body,
                    fontSize: '2.8%',
                    color: colors.text,
                    background: colors.highlight,
                    borderRadius: '4px',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-[5%]">
          {certifications && certifications.length > 0 && (
            <section className="flex-1">
              <SectionHeader title={sectionTitles.certifications} tokens={tokens} variant="minimal" />
              <div className="space-y-1">
                {certifications.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                    {item.name}{item.issuer ? ` · ${item.issuer}` : ''}
                  </div>
                ))}
              </div>
            </section>
          )}
          {languages && languages.length > 0 && (
            <section className="flex-1">
              <SectionHeader title={sectionTitles.languages} tokens={tokens} variant="minimal" />
              <div className="space-y-1">
                {languages.map((item, index) => (
                  <div key={index} style={{ fontFamily: fonts.body, fontSize: '2.8%', color: colors.textMuted }}>
                    {item.language} · {item.proficiency}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

