import { Resume, TemplateStyle } from '../types/resume'
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  convertInchesToTwip,
} from 'docx'

// PDF export using html2canvas approach — we'll generate HTML and let frontend handle it
// For backend PDF, we'll use a simpler approach with docx-to-pdf or return HTML

export async function generateDocx(resume: Resume, template: TemplateStyle): Promise<Buffer> {
  const { basicInfo, summary, education, experience, projects, skills, certifications, languages } = resume

  const accentColor = getAccentColor(template)
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.7),
            right: convertInchesToTwip(0.7),
          },
        },
      },
      children: [
        // Name
        new Paragraph({
          alignment: template === 'tech' ? AlignmentType.LEFT : AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: basicInfo.name || '姓名',
              bold: true,
              size: 32,
              font: 'Calibri',
              color: template === 'tech' ? 'FFFFFF' : '0F172A',
            }),
          ],
        }),
        // Title
        new Paragraph({
          alignment: template === 'tech' ? AlignmentType.LEFT : AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: basicInfo.title || '',
              size: 22,
              font: 'Calibri',
              color: '64748B',
            }),
          ],
        }),
        // Contact info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            ...buildContactRuns(basicInfo),
          ],
        }),
        // Separator line
        new Paragraph({
          spacing: { after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: accentColor },
          },
          children: [],
        }),
        // Summary
        createSection('自我评价', summary, accentColor),
        // Experience
        ...createExperienceSection(experience, accentColor),
        // Education
        ...createEducationSection(education, accentColor),
        // Projects
        ...createProjectSection(projects, accentColor),
        // Skills
        createSkillsSection(skills, accentColor),
        // Certifications
        ...(certifications?.length ? createCertificationSection(certifications, accentColor) : []),
        // Languages
        ...(languages?.length ? createLanguageSection(languages, accentColor) : []),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

function getAccentColor(template: TemplateStyle): string {
  switch (template) {
    case 'tech': return '3B82F6'
    case 'elegant': return '8B5CF6'
    case 'minimalist': return '334155'
    case 'business': return '1E40AF'
    case 'creative': return 'F59E0B'
    case 'academic': return '166534'
    default: return '3B82F6'
  }
}

function buildContactRuns(basicInfo: Resume['basicInfo']): TextRun[] {
  const runs: TextRun[] = []
  const items = [
    basicInfo.email,
    basicInfo.phone,
    basicInfo.location,
    basicInfo.website,
    basicInfo.linkedin,
    basicInfo.github,
  ].filter(Boolean)

  items.forEach((item, i) => {
    runs.push(new TextRun({ text: item as string, size: 18, font: 'Calibri', color: '64748B' }))
    if (i < items.length - 1) {
      runs.push(new TextRun({ text: ' | ', size: 18, font: 'Calibri', color: '94A3B8' }))
    }
  })
  return runs
}

function createSection(title: string, content: string, accent: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: 'Calibri', color: accent }),
    ],
  })
}

function createExperienceSection(experience: Resume['experience'], accent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  paragraphs.push(createSection('工作经历', '', accent))

  experience.forEach(exp => {
    paragraphs.push(new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({ text: exp.position, bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
        new TextRun({ text: `  |  ${exp.company}`, size: 22, font: 'Calibri', color: '64748B' }),
      ],
    }))
    paragraphs.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 18, font: 'Calibri', color: '94A3B8' }),
        ...(exp.location ? [new TextRun({ text: `  |  ${exp.location}`, size: 18, font: 'Calibri', color: '94A3B8' })] : []),
      ],
    }))
    exp.description.forEach(desc => {
      paragraphs.push(new Paragraph({
        spacing: { after: 40 },
        bullet: { level: 0 },
        children: [new TextRun({ text: desc, size: 20, font: 'Calibri', color: '334155' })],
      }))
    })
  })
  return paragraphs
}

function createEducationSection(education: Resume['education'], accent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  paragraphs.push(createSection('教育背景', '', accent))

  education.forEach(edu => {
    paragraphs.push(new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({ text: edu.degree, bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
        new TextRun({ text: `  |  ${edu.school}`, size: 22, font: 'Calibri', color: '64748B' }),
        ...(edu.field ? [new TextRun({ text: `  |  ${edu.field}`, size: 20, font: 'Calibri', color: '64748B' })] : []),
      ],
    }))
    paragraphs.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 18, font: 'Calibri', color: '94A3B8' }),
      ],
    }))
  })
  return paragraphs
}

function createProjectSection(projects: Resume['projects'], accent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  paragraphs.push(createSection('项目经验', '', accent))

  projects.forEach(proj => {
    paragraphs.push(new Paragraph({
      spacing: { before: 160, after: 60 },
      children: [
        new TextRun({ text: proj.name, bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
        ...(proj.role ? [new TextRun({ text: `  |  ${proj.role}`, size: 20, font: 'Calibri', color: '64748B' })] : []),
        ...(proj.link ? [new TextRun({ text: `  |  ${proj.link}`, size: 18, font: 'Calibri', color: accent })] : []),
      ],
    }))
    if (proj.startDate) {
      paragraphs.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: `${proj.startDate} - ${proj.endDate || '至今'}`, size: 18, font: 'Calibri', color: '94A3B8' }),
        ],
      }))
    }
    proj.description.forEach(desc => {
      paragraphs.push(new Paragraph({
        spacing: { after: 40 },
        bullet: { level: 0 },
        children: [new TextRun({ text: desc, size: 20, font: 'Calibri', color: '334155' })],
      }))
    })
  })
  return paragraphs
}

function createSkillsSection(skills: string[], accent: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({ text: '技能', bold: true, size: 22, font: 'Calibri', color: accent }),
      new TextRun({ text: '\n' }),
      new TextRun({ text: skills.join(' · '), size: 20, font: 'Calibri', color: '334155' }),
    ],
  })
}

function createCertificationSection(certifications: Resume['certifications'], accent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  paragraphs.push(createSection('认证与证书', '', accent))

  const items = certifications ?? []
  items.forEach(cert => {
    paragraphs.push(new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri', color: '0F172A' }),
        ...(cert.issuer ? [new TextRun({ text: `  |  ${cert.issuer}`, size: 18, font: 'Calibri', color: '64748B' })] : []),
        ...(cert.date ? [new TextRun({ text: `  |  ${cert.date}`, size: 18, font: 'Calibri', color: '94A3B8' })] : []),
      ],
    }))
  })
  return paragraphs
}

function createLanguageSection(languages: Resume['languages'], accent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  paragraphs.push(createSection('语言能力', '', accent))

  const items = languages ?? []
  items.forEach(lang => {
    paragraphs.push(new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({ text: lang.language, bold: true, size: 20, font: 'Calibri', color: '0F172A' }),
        new TextRun({ text: `  —  ${lang.proficiency}`, size: 18, font: 'Calibri', color: '64748B' }),
      ],
    }))
  })
  return paragraphs
}

// PDF export: we generate HTML from resume data for client-side rendering,
// but for server-side PDF we return the docx buffer and let the client convert,
// or we can provide a simple HTML-based PDF generation.

export function generateHtmlForPdf(resume: Resume, template: TemplateStyle): string {
  const accent = getAccentColorHex(template)
  const { basicInfo, summary, education, experience, projects, skills, certifications, languages } = resume

  const contactItems = [
    basicInfo.email, basicInfo.phone, basicInfo.location, basicInfo.website, basicInfo.linkedin, basicInfo.github
  ].filter(Boolean).join(' · ')

  let html = `
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      @page { size: A4; margin: 20mm 18mm; }
      body { font-family: 'Montserrat', 'Segoe UI', sans-serif; color: #0F172A; font-size: 11pt; line-height: 1.6; }
      .name { font-size: 24pt; font-weight: 700; ${template === 'tech' ? '' : 'text-align: center;'} }
      .title { font-size: 12pt; color: #64748B; ${template === 'tech' ? '' : 'text-align: center;'} margin-bottom: 4pt; }
      .contact { font-size: 9pt; color: #64748B; ${template === 'tech' ? '' : 'text-align: center;'} margin-bottom: 12pt; }
      .section-title { font-size: 12pt; font-weight: 700; color: ${accent}; margin-top: 16pt; margin-bottom: 6pt; border-bottom: 1px solid ${accent}; padding-bottom: 2pt; }
      .entry-header { font-weight: 600; font-size: 11pt; }
      .entry-meta { font-size: 9pt; color: #64748B; }
      .entry-desc { margin-left: 12pt; font-size: 10pt; color: #334155; }
      .skills { font-size: 10pt; }
      .summary { font-size: 10pt; color: #334155; margin-bottom: 8pt; }
      ${template === 'tech' ? `
        .sidebar { position: absolute; left: 0; top: 0; width: 30%; height: 100%; background: #0F172A; padding: 20mm 12mm; color: white; }
        .sidebar .name { color: white; text-align: left; }
        .sidebar .title { color: #94A3B8; text-align: left; }
        .sidebar .contact { color: #94A3B8; text-align: left; }
        .sidebar .skills { color: #94A3B8; }
        .main { position: absolute; left: 30%; top: 0; width: 70%; height: 100%; padding: 20mm 18mm; }
      ` : ''}
      ${template === 'elegant' ? `
        .header-band { background: linear-gradient(135deg, #0F172A, #334155); padding: 24pt 36pt; color: white; margin: -20mm -18mm 16pt -18mm; }
        .header-band .name { color: white; font-size: 28pt; text-align: left; }
        .header-band .title { color: #94A3B8; text-align: left; }
        .header-band .contact { color: #94A3B8; text-align: left; }
      ` : ''}
    </style>
  </head>
  <body>`

  if (template === 'tech') {
    html += `
    <div class="sidebar">
      <div class="name">${basicInfo.name}</div>
      <div class="title">${basicInfo.title}</div>
      <div class="contact">${contactItems}</div>
      <div class="section-title" style="color: #3B82F6; border-color: #3B82F6;">技能</div>
      <div class="skills">${skills.join(' · ')}</div>
      ${(certifications?.length || 0) > 0 ? `<div class="section-title" style="color: #3B82F6; border-color: #3B82F6;">认证</div>${certifications!.map(c => `<div style="font-size:9pt;color:#94A3B8;">${c.name}${c.issuer ? ` · ${c.issuer}` : ''}</div>`).join('')}` : ''}
      ${(languages?.length || 0) > 0 ? `<div class="section-title" style="color: #3B82F6; border-color: #3B82F6;">语言</div>${languages!.map(l => `<div style="font-size:9pt;color:#94A3B8;">${l.language} — ${l.proficiency}</div>`).join('')}` : ''}
    </div>
    <div class="main">
      <div class="section-title">自我评价</div>
      <div class="summary">${summary}</div>
      <div class="section-title">工作经历</div>
      ${experience.map(e => `<div class="entry-header">${e.position} · ${e.company}</div><div class="entry-meta">${e.startDate} - ${e.endDate}${e.location ? ` · ${e.location}` : ''}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
      <div class="section-title">教育背景</div>
      ${education.map(e => `<div class="entry-header">${e.degree} · ${e.school}${e.field ? ` · ${e.field}` : ''}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}
      <div class="section-title">项目经验</div>
      ${projects.map(p => `<div class="entry-header">${p.name}${p.role ? ` · ${p.role}` : ''}</div>${p.startDate ? `<div class="entry-meta">${p.startDate} - ${p.endDate || '至今'}</div>` : ''}${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
    </div>`
  } else if (template === 'elegant') {
    html += `
    <div class="header-band">
      <div class="name">${basicInfo.name}</div>
      <div class="title">${basicInfo.title}</div>
      <div class="contact">${contactItems}</div>
    </div>
    <div class="summary">${summary}</div>
    <div class="section-title">工作经历</div>
    ${experience.map(e => `<div class="entry-header">${e.position} · <span style="color:${accent}">${e.company}</span></div><div class="entry-meta">${e.startDate} - ${e.endDate}${e.location ? ` · ${e.location}` : ''}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
    <div class="section-title">教育背景</div>
    ${education.map(e => `<div class="entry-header">${e.degree} · ${e.school}${e.field ? ` · ${e.field}` : ''}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}
    <div class="section-title">项目经验</div>
    ${projects.map(p => `<div class="entry-header">${p.name}${p.role ? ` · ${p.role}` : ''}</div>${p.startDate ? `<div class="entry-meta">${p.startDate} - ${p.endDate || '至今'}</div>` : ''}${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
    <div class="section-title">技能</div>
    <div class="skills">${skills.join(' · ')}</div>
    ${(certifications?.length || 0) > 0 ? `<div class="section-title">认证</div>${certifications!.map(c => `<div>${c.name}${c.issuer ? ` · ${c.issuer}` : ''}${c.date ? ` · ${c.date}` : ''}</div>`).join('')}` : ''}
    ${(languages?.length || 0) > 0 ? `<div class="section-title">语言</div>${languages!.map(l => `<div>${l.language} — ${l.proficiency}</div>`).join('')}` : ''}`
  } else {
    // minimalist + others
    html += `
    <div class="name">${basicInfo.name}</div>
    <div class="title">${basicInfo.title}</div>
    <div class="contact">${contactItems}</div>
    <div class="section-title">自我评价</div>
    <div class="summary">${summary}</div>
    <div class="section-title">工作经历</div>
    ${experience.map(e => `<div class="entry-header">${e.position} · ${e.company}</div><div class="entry-meta">${e.startDate} - ${e.endDate}${e.location ? ` · ${e.location}` : ''}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
    <div class="section-title">教育背景</div>
    ${education.map(e => `<div class="entry-header">${e.degree} · ${e.school}${e.field ? ` · ${e.field}` : ''}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}
    <div class="section-title">项目经验</div>
    ${projects.map(p => `<div class="entry-header">${p.name}${p.role ? ` · ${p.role}` : ''}</div>${p.startDate ? `<div class="entry-meta">${p.startDate} - ${p.endDate || '至今'}</div>` : ''}${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}
    <div class="section-title">技能</div>
    <div class="skills">${skills.join(' · ')}</div>
    ${(certifications?.length || 0) > 0 ? `<div class="section-title">认证</div>${certifications!.map(c => `<div>${c.name}${c.issuer ? ` · ${c.issuer}` : ''}${c.date ? ` · ${c.date}` : ''}</div>`).join('')}` : ''}
    ${(languages?.length || 0) > 0 ? `<div class="section-title">语言</div>${languages!.map(l => `<div>${l.language} — ${l.proficiency}</div>`).join('')}` : ''}`
  }

  html += `
  </body>
  </html>`
  return html
}

function getAccentColorHex(template: TemplateStyle): string {
  switch (template) {
    case 'tech': return '#3B82F6'
    case 'elegant': return '#8B5CF6'
    case 'minimalist': return '#334155'
    case 'business': return '#1E40AF'
    case 'creative': return '#F59E0B'
    case 'academic': return '#166534'
    default: return '#3B82F6'
  }
}
