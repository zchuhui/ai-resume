import { Resume, TemplateStyle } from '../types/resume'
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Packer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  VerticalAlign,
  convertInchesToTwip,
} from 'docx'

// ── Template color tokens (mirrors frontend design-tokens.ts) ──

interface TemplateColors {
  bg: string
  surface: string
  text: string
  textMuted: string
  textInverse: string
  accent: string
  accent2: string
  border: string
  borderLight: string
  highlight: string
}

const colorMap: Record<TemplateStyle, TemplateColors> = {
  minimalist: {
    bg: 'FFFFFF', surface: 'FFFFFF', text: '0F172A', textMuted: '64748B',
    textInverse: 'FFFFFF', accent: '0F172A', accent2: '94A3B8',
    border: '0F172A', borderLight: 'E2E8F0', highlight: 'F8FAFC',
  },
  tech: {
    bg: '0B1120', surface: '151E32', text: 'E2E8F0', textMuted: '94A3B8',
    textInverse: '0F172A', accent: '38BDF8', accent2: '818CF8',
    border: '1E293B', borderLight: '334155', highlight: '0F172A',
  },
  elegant: {
    bg: 'FAFAF9', surface: 'FFFFFF', text: '1C1917', textMuted: '78716C',
    textInverse: 'FFFFFF', accent: '1E3A5F', accent2: 'B45309',
    border: 'E7E5E4', borderLight: 'F5F5F4', highlight: 'F5F5F4',
  },
  business: {
    bg: 'FFFFFF', surface: 'F8FAFC', text: '1E293B', textMuted: '64748B',
    textInverse: 'FFFFFF', accent: '1E3A5F', accent2: 'B45309',
    border: 'CBD5E1', borderLight: 'E2E8F0', highlight: 'F1F5F9',
  },
  creative: {
    bg: 'FFFFFF', surface: '2E1065', text: '1E1B4B', textMuted: '64748B',
    textInverse: 'FFFFFF', accent: 'F97316', accent2: 'EC4899',
    border: 'E2E8F0', borderLight: 'F1F5F9', highlight: 'FEF3C7',
  },
  academic: {
    bg: 'FFFBF0', surface: 'FFFFFF', text: '292524', textMuted: '78716C',
    textInverse: 'FFFFFF', accent: '166534', accent2: '92400E',
    border: 'D6D3D1', borderLight: 'E7E5E4', highlight: 'F5F5F4',
  },
}

// ── Helper: remove # from hex for docx ──
function hex(color: string): string {
  return color.replace('#', '').toUpperCase()
}

// ── Helper: contact items ──
function getContactItems(basicInfo: Resume['basicInfo']): string[] {
  return [
    basicInfo.email, basicInfo.phone, basicInfo.location,
    basicInfo.website, basicInfo.linkedin, basicInfo.github,
  ].filter(Boolean) as string[]
}

// ── Helper: section title paragraph ──
function sectionTitle(title: string, color: string, opts?: { light?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(color), space: 2 } },
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: 'Calibri', color: hex(color) }),
    ],
  })
}

function sectionTitleLight(title: string, color: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [
      new TextRun({ text: title, bold: true, size: 20, font: 'Calibri', color: hex(color) }),
    ],
  })
}

// ── Helper: experience entries ──
function experienceParagraphs(experience: Resume['experience'], colors: TemplateColors): Paragraph[] {
  const paragraphs: Paragraph[] = []
  experience.forEach(exp => {
    paragraphs.push(new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({ text: exp.position, bold: true, size: 22, font: 'Calibri', color: hex(colors.text) }),
        new TextRun({ text: `  ·  ${exp.company}`, size: 22, font: 'Calibri', color: hex(colors.accent) }),
      ],
    }))
    paragraphs.push(new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: `${exp.startDate} — ${exp.endDate}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) }),
        ...(exp.location ? [new TextRun({ text: `  ·  ${exp.location}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) })] : []),
      ],
    }))
    exp.description.forEach(desc => {
      paragraphs.push(new Paragraph({
        spacing: { after: 30 },
        bullet: { level: 0 },
        children: [new TextRun({ text: desc, size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
      }))
    })
  })
  return paragraphs
}

// ── Helper: education entries ──
function educationParagraphs(education: Resume['education'], colors: TemplateColors): Paragraph[] {
  const paragraphs: Paragraph[] = []
  education.forEach(edu => {
    paragraphs.push(new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({ text: edu.school, bold: true, size: 22, font: 'Calibri', color: hex(colors.text) }),
        ...(edu.field ? [new TextRun({ text: `  ·  ${edu.degree} · ${edu.field}`, size: 20, font: 'Calibri', color: hex(colors.textMuted) })] : [new TextRun({ text: `  ·  ${edu.degree}`, size: 20, font: 'Calibri', color: hex(colors.textMuted) })]),
      ],
    }))
    paragraphs.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: `${edu.startDate} — ${edu.endDate}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) }),
      ],
    }))
  })
  return paragraphs
}

// ── Helper: project entries ──
function projectParagraphs(projects: Resume['projects'], colors: TemplateColors): Paragraph[] {
  const paragraphs: Paragraph[] = []
  projects.forEach(proj => {
    paragraphs.push(new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({ text: proj.name, bold: true, size: 22, font: 'Calibri', color: hex(colors.text) }),
        ...(proj.role ? [new TextRun({ text: `  ·  ${proj.role}`, size: 20, font: 'Calibri', color: hex(colors.accent) })] : []),
      ],
    }))
    if (proj.startDate) {
      paragraphs.push(new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${proj.startDate} — ${proj.endDate || '至今'}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) }),
        ],
      }))
    }
    proj.description.forEach(desc => {
      paragraphs.push(new Paragraph({
        spacing: { after: 30 },
        bullet: { level: 0 },
        children: [new TextRun({ text: desc, size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
      }))
    })
  })
  return paragraphs
}

// ── Helper: skills paragraph ──
function skillsParagraph(skills: string[], colors: TemplateColors): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: skills.join('  ·  '), size: 20, font: 'Calibri', color: hex(colors.textMuted) }),
    ],
  })
}

// ── Helper: certifications ──
function certParagraphs(certs: Resume['certifications'], colors: TemplateColors): Paragraph[] {
  return (certs ?? []).map(cert => new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [
      new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri', color: hex(colors.text) }),
      ...(cert.issuer ? [new TextRun({ text: `  ·  ${cert.issuer}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) })] : []),
      ...(cert.date ? [new TextRun({ text: `  ·  ${cert.date}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) })] : []),
    ],
  }))
}

// ── Helper: languages ──
function langParagraphs(langs: Resume['languages'], colors: TemplateColors): Paragraph[] {
  return (langs ?? []).map(lang => new Paragraph({
    spacing: { before: 60, after: 30 },
    children: [
      new TextRun({ text: lang.language, bold: true, size: 20, font: 'Calibri', color: hex(colors.text) }),
      new TextRun({ text: `  —  ${lang.proficiency}`, size: 18, font: 'Calibri', color: hex(colors.textMuted) }),
    ],
  }))
}

// ════════════════════════════════════════════════════════════
//  TEMPLATE GENERATORS
// ════════════════════════════════════════════════════════════

// ── Tech: dark sidebar (left) + light main (right) ──
function generateTechDoc(resume: Resume, colors: TemplateColors): Document {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  // Sidebar content (dark background)
  const sidebarChildren: (Paragraph | Table)[] = [
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 32, font: 'Calibri', color: hex(colors.text) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: basicInfo.title || '', size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
    }),
  ]

  // Contact
  if (contactItems.length > 0) {
    sidebarChildren.push(sectionTitleLight('联系方式', colors.accent))
    contactItems.forEach(item => {
      sidebarChildren.push(new Paragraph({
        spacing: { after: 30 },
        children: [new TextRun({ text: item, size: 18, font: 'Calibri', color: hex(colors.textMuted) })],
      }))
    })
  }

  // Skills
  if (skills.length > 0) {
    sidebarChildren.push(sectionTitleLight('技能', colors.accent))
    sidebarChildren.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: skills.join('\n'), size: 18, font: 'Calibri', color: hex(colors.textMuted) })],
    }))
  }

  // Languages
  if (languages && languages.length > 0) {
    sidebarChildren.push(sectionTitleLight('语言', colors.accent))
    langParagraphs(languages, colors).forEach(p => sidebarChildren.push(p))
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    sidebarChildren.push(sectionTitleLight('认证', colors.accent))
    certParagraphs(certifications, colors).forEach(p => sidebarChildren.push(p))
  }

  // Main content (light background)
  const mainChildren: Paragraph[] = []

  if (summary) {
    mainChildren.push(sectionTitle('自我评价', colors.accent))
    mainChildren.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: summary, size: 20, font: 'Calibri', color: hex(colors.text) })],
    }))
  }

  if (experience.length > 0) {
    mainChildren.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, colors).forEach(p => mainChildren.push(p))
  }

  if (education.length > 0) {
    mainChildren.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, colors).forEach(p => mainChildren.push(p))
  }

  if (projects.length > 0) {
    mainChildren.push(sectionTitle('项目经验', colors.accent))
    projectParagraphs(projects, colors).forEach(p => mainChildren.push(p))
  }

  // Build the 2-column table with fixed layout and invisible borders
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const layoutTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3000, 6000],
    layout: 'fixed',
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          // Sidebar cell — dark background
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: hex(colors.surface), color: hex(colors.surface) },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: sidebarChildren,
          }),
          // Main cell — light background
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'FFFFFF', color: 'FFFFFF' },
            margins: { top: 200, bottom: 200, left: 300, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: mainChildren,
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.5),
          },
        },
      },
      children: [layoutTable],
    }],
  })
}

// ── Elegant: accent header band + 2-column body ──
function generateElegantDoc(resume: Resume, colors: TemplateColors): Document {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  // Header band (accent background, white text)
  const headerParagraphs: Paragraph[] = [
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 36, font: 'Calibri', color: hex(colors.textInverse) })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: basicInfo.title || '', size: 22, font: 'Calibri', color: hex(colors.textInverse) })],
    }),
  ]
  if (contactItems.length > 0) {
    headerParagraphs.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: contactItems.join('  ·  '), size: 18, font: 'Calibri', color: hex(colors.textInverse) })],
    }))
  }

  // Left column: summary, skills, languages, certs
  const leftChildren: Paragraph[] = []
  if (summary) {
    leftChildren.push(sectionTitle('自我评价', colors.accent))
    leftChildren.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: summary, size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
    }))
  }
  if (skills.length > 0) {
    leftChildren.push(sectionTitle('技能', colors.accent))
    leftChildren.push(skillsParagraph(skills, colors))
  }
  if (languages && languages.length > 0) {
    leftChildren.push(sectionTitle('语言', colors.accent))
    langParagraphs(languages, colors).forEach(p => leftChildren.push(p))
  }
  if (certifications && certifications.length > 0) {
    leftChildren.push(sectionTitle('认证', colors.accent))
    certParagraphs(certifications, colors).forEach(p => leftChildren.push(p))
  }

  // Right column: experience, education, projects
  const rightChildren: Paragraph[] = []
  if (experience.length > 0) {
    rightChildren.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, colors).forEach(p => rightChildren.push(p))
  }
  if (education.length > 0) {
    rightChildren.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, colors).forEach(p => rightChildren.push(p))
  }
  if (projects.length > 0) {
    rightChildren.push(sectionTitle('项目经验', colors.accent))
    projectParagraphs(projects, colors).forEach(p => rightChildren.push(p))
  }

  // Header table (full width, accent background)
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9000],
    layout: 'fixed',
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: hex(colors.accent), color: hex(colors.accent) },
            margins: { top: 300, bottom: 300, left: 400, right: 400 },
            verticalAlign: VerticalAlign.TOP,
            children: headerParagraphs,
          }),
        ],
      }),
    ],
  })

  // Body table (2 columns)
  const bodyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3400, 5600],
    layout: 'fixed',
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 200, left: 300, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 200, left: 200, right: 300 },
            verticalAlign: VerticalAlign.TOP,
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 0,
            bottom: convertInchesToTwip(0.5),
            left: 0,
            right: 0,
          },
        },
      },
      children: [headerTable, bodyTable],
    }],
  })
}

// ── Minimalist: single column, centered, clean ──
function generateMinimalistDoc(resume: Resume, colors: TemplateColors): Document {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  const children: Paragraph[] = [
    // Centered name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 80 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 36, font: 'Calibri', color: hex(colors.text) })],
    }),
    // Centered title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: basicInfo.title || '', size: 22, font: 'Calibri', color: hex(colors.textMuted) })],
    }),
    // Separator
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(colors.accent), space: 4 } },
      children: [],
    }),
    // Contact
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: contactItems.join('  ·  '), size: 18, font: 'Calibri', color: hex(colors.textMuted) })],
    }),
  ]

  if (summary) {
    children.push(sectionTitle('自我评价', colors.accent))
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: summary, size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
    }))
  }
  if (experience.length > 0) {
    children.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, colors).forEach(p => children.push(p))
  }
  if (education.length > 0) {
    children.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, colors).forEach(p => children.push(p))
  }
  if (projects.length > 0) {
    children.push(sectionTitle('项目经验', colors.accent))
    projectParagraphs(projects, colors).forEach(p => children.push(p))
  }
  if (skills.length > 0) {
    children.push(sectionTitle('技能', colors.accent))
    children.push(skillsParagraph(skills, colors))
  }
  if (certifications && certifications.length > 0) {
    children.push(sectionTitle('认证', colors.accent))
    certParagraphs(certifications, colors).forEach(p => children.push(p))
  }
  if (languages && languages.length > 0) {
    children.push(sectionTitle('语言', colors.accent))
    langParagraphs(languages, colors).forEach(p => children.push(p))
  }

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(1.0),
            right: convertInchesToTwip(1.0),
          },
        },
      },
      children,
    }],
  })
}

// ── Business: left-aligned header + 2-column body ──
function generateBusinessDoc(resume: Resume, colors: TemplateColors): Document {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  const headerChildren: Paragraph[] = [
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 36, font: 'Calibri', color: hex(colors.text) })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: basicInfo.title || '', size: 22, font: 'Calibri', color: hex(colors.accent) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: contactItems.join('  ·  '), size: 18, font: 'Calibri', color: hex(colors.textMuted) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: hex(colors.accent), space: 2 } },
      children: [],
    }),
  ]

  // Left column
  const leftChildren: Paragraph[] = []
  if (summary) {
    leftChildren.push(sectionTitle('自我评价', colors.accent))
    leftChildren.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: summary, size: 20, font: 'Calibri', color: hex(colors.textMuted) })],
    }))
  }
  if (skills.length > 0) {
    leftChildren.push(sectionTitle('技能', colors.accent))
    leftChildren.push(skillsParagraph(skills, colors))
  }
  if (languages && languages.length > 0) {
    leftChildren.push(sectionTitle('语言', colors.accent))
    langParagraphs(languages, colors).forEach(p => leftChildren.push(p))
  }

  // Right column
  const rightChildren: Paragraph[] = []
  if (experience.length > 0) {
    rightChildren.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, colors).forEach(p => rightChildren.push(p))
  }
  if (education.length > 0) {
    rightChildren.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, colors).forEach(p => rightChildren.push(p))
  }
  if (projects.length > 0) {
    rightChildren.push(sectionTitle('项目经验', colors.accent))
    projectParagraphs(projects, colors).forEach(p => rightChildren.push(p))
  }
  if (certifications && certifications.length > 0) {
    rightChildren.push(sectionTitle('认证', colors.accent))
    certParagraphs(certifications, colors).forEach(p => rightChildren.push(p))
  }

  const noBorderB = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const bodyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3500, 6500],
    layout: 'fixed',
    borders: {
      top: noBorderB, bottom: noBorderB, left: noBorderB, right: noBorderB,
      insideHorizontal: noBorderB, insideVertical: noBorderB,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 200, right: 100 },
            verticalAlign: VerticalAlign.TOP,
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.6),
            bottom: convertInchesToTwip(0.6),
            left: convertInchesToTwip(0.7),
            right: convertInchesToTwip(0.7),
          },
        },
      },
      children: [...headerChildren, bodyTable],
    }],
  })
}

// ── Creative: colored sidebar (left) + main (right) ──
function generateCreativeDoc(resume: Resume, colors: TemplateColors): Document {
  // Similar to tech but with creative colors
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  const sidebarChildren: (Paragraph | Table)[] = [
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 32, font: 'Calibri', color: hex(colors.textInverse) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: basicInfo.title || '', size: 20, font: 'Calibri', color: hex(colors.textInverse) })],
    }),
  ]

  if (contactItems.length > 0) {
    sidebarChildren.push(sectionTitleLight('联系方式', colors.accent2))
    contactItems.forEach(item => {
      sidebarChildren.push(new Paragraph({
        spacing: { after: 30 },
        children: [new TextRun({ text: item, size: 18, font: 'Calibri', color: hex(colors.textInverse) })],
      }))
    })
  }

  if (skills.length > 0) {
    sidebarChildren.push(sectionTitleLight('技能', colors.accent2))
    skills.forEach(skill => {
      sidebarChildren.push(new Paragraph({
        spacing: { after: 30 },
        children: [new TextRun({ text: `• ${skill}`, size: 18, font: 'Calibri', color: hex(colors.textInverse) })],
      }))
    })
  }

  if (languages && languages.length > 0) {
    sidebarChildren.push(sectionTitleLight('语言', colors.accent2))
    langParagraphs(languages, { ...colors, text: colors.textInverse, textMuted: colors.textInverse }).forEach(p => sidebarChildren.push(p))
  }

  // Main content
  const mainChildren: Paragraph[] = []
  if (summary) {
    mainChildren.push(sectionTitle('自我评价', colors.accent))
    mainChildren.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: summary, size: 20, font: 'Calibri', color: hex(colors.text) })],
    }))
  }
  if (experience.length > 0) {
    mainChildren.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, { ...colors, text: '1E1B4B', textMuted: '64748B' }).forEach(p => mainChildren.push(p))
  }
  if (education.length > 0) {
    mainChildren.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, { ...colors, text: '1E1B4B', textMuted: '64748B' }).forEach(p => mainChildren.push(p))
  }
  if (projects.length > 0) {
    mainChildren.push(sectionTitle('项目经验', colors.accent))
    projectParagraphs(projects, { ...colors, text: '1E1B4B', textMuted: '64748B' }).forEach(p => mainChildren.push(p))
  }
  if (certifications && certifications.length > 0) {
    mainChildren.push(sectionTitle('认证', colors.accent))
    certParagraphs(certifications, { ...colors, text: '1E1B4B', textMuted: '64748B' }).forEach(p => mainChildren.push(p))
  }

  const noBorderC = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const layoutTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3000, 6000],
    layout: 'fixed',
    borders: {
      top: noBorderC, bottom: noBorderC, left: noBorderC, right: noBorderC,
      insideHorizontal: noBorderC, insideVertical: noBorderC,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: hex(colors.surface), color: hex(colors.surface) },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: sidebarChildren,
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'FFFFFF', color: 'FFFFFF' },
            margins: { top: 200, bottom: 200, left: 300, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: mainChildren,
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.5),
          },
        },
      },
      children: [layoutTable],
    }],
  })
}

// ── Academic: left-aligned header + 2-column body, serif feel ──
function generateAcademicDoc(resume: Resume, colors: TemplateColors): Document {
  const { basicInfo, summary, experience, education, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)

  const headerChildren: Paragraph[] = [
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: basicInfo.name || '姓名', bold: true, size: 36, font: 'Georgia', color: hex(colors.text) })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: basicInfo.title || '', size: 22, font: 'Georgia', color: hex(colors.accent) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: contactItems.join('  ·  '), size: 18, font: 'Georgia', color: hex(colors.textMuted) })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.DOUBLE, size: 6, color: hex(colors.accent), space: 2 } },
      children: [],
    }),
  ]

  const leftChildren: Paragraph[] = []
  if (summary) {
    leftChildren.push(sectionTitle('研究兴趣', colors.accent))
    leftChildren.push(new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: summary, size: 20, font: 'Georgia', color: hex(colors.textMuted) })],
    }))
  }
  if (skills.length > 0) {
    leftChildren.push(sectionTitle('技能', colors.accent))
    leftChildren.push(skillsParagraph(skills, colors))
  }
  if (languages && languages.length > 0) {
    leftChildren.push(sectionTitle('语言', colors.accent))
    langParagraphs(languages, colors).forEach(p => leftChildren.push(p))
  }

  const rightChildren: Paragraph[] = []
  if (experience.length > 0) {
    rightChildren.push(sectionTitle('工作经历', colors.accent))
    experienceParagraphs(experience, colors).forEach(p => rightChildren.push(p))
  }
  if (education.length > 0) {
    rightChildren.push(sectionTitle('教育背景', colors.accent))
    educationParagraphs(education, colors).forEach(p => rightChildren.push(p))
  }
  if (projects.length > 0) {
    rightChildren.push(sectionTitle('研究项目', colors.accent))
    projectParagraphs(projects, colors).forEach(p => rightChildren.push(p))
  }
  if (certifications && certifications.length > 0) {
    rightChildren.push(sectionTitle('认证', colors.accent))
    certParagraphs(certifications, colors).forEach(p => rightChildren.push(p))
  }

  const noBorderA = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const bodyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3500, 6500],
    layout: 'fixed',
    borders: {
      top: noBorderA, bottom: noBorderA, left: noBorderA, right: noBorderA,
      insideHorizontal: noBorderA, insideVertical: noBorderA,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 200, right: 100 },
            verticalAlign: VerticalAlign.TOP,
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.6),
            bottom: convertInchesToTwip(0.6),
            left: convertInchesToTwip(0.8),
            right: convertInchesToTwip(0.8),
          },
        },
      },
      children: [...headerChildren, bodyTable],
    }],
  })
}

// ════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ════════════════════════════════════════════════════════════

export async function generateDocx(resume: Resume, template: TemplateStyle): Promise<Buffer> {
  const colors = colorMap[template] || colorMap.minimalist

  let doc: Document
  switch (template) {
    case 'tech':
      doc = generateTechDoc(resume, colors)
      break
    case 'elegant':
      doc = generateElegantDoc(resume, colors)
      break
    case 'business':
      doc = generateBusinessDoc(resume, colors)
      break
    case 'creative':
      doc = generateCreativeDoc(resume, colors)
      break
    case 'academic':
      doc = generateAcademicDoc(resume, colors)
      break
    case 'minimalist':
    default:
      doc = generateMinimalistDoc(resume, colors)
      break
  }

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

// ── HTML for PDF (kept for backward compatibility, but frontend now uses html2canvas) ──
export function generateHtmlForPdf(resume: Resume, template: TemplateStyle): string {
  const colors = colorMap[template] || colorMap.minimalist
  const { basicInfo, summary, education, experience, projects, skills, certifications, languages } = resume
  const contactItems = getContactItems(basicInfo)
  const accent = `#${hex(colors.accent)}`

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 0; }
    body { font-family: 'Segoe UI', sans-serif; color: #${hex(colors.text)}; font-size: 11pt; line-height: 1.6; margin: 0; }
    .name { font-size: 24pt; font-weight: 700; }
    .title { font-size: 12pt; color: #${hex(colors.textMuted)}; }
    .contact { font-size: 9pt; color: #${hex(colors.textMuted)}; }
    .section-title { font-size: 12pt; font-weight: 700; color: ${accent}; margin-top: 16pt; margin-bottom: 6pt; border-bottom: 1px solid ${accent}; padding-bottom: 2pt; }
    .entry-header { font-weight: 600; }
    .entry-meta { font-size: 9pt; color: #${hex(colors.textMuted)}; }
    .entry-desc { margin-left: 12pt; font-size: 10pt; color: #${hex(colors.textMuted)}; }
  </style></head><body>`

  if (template === 'tech') {
    html += `<table style="width:100%;border-collapse:collapse;"><tr>
      <td style="width:35%;background:#${hex(colors.surface)};color:#${hex(colors.text)};padding:20mm 12mm;vertical-align:top;">
        <div class="name" style="color:#${hex(colors.text)};">${basicInfo.name}</div>
        <div class="title">${basicInfo.title}</div>
        <div class="contact" style="margin:8pt 0;">${contactItems.join('<br>')}</div>
        ${skills.length ? `<div class="section-title" style="color:${accent};border-color:${accent};">技能</div><div style="font-size:10pt;color:#${hex(colors.textMuted)};">${skills.join('<br>')}</div>` : ''}
        ${(languages?.length || 0) ? `<div class="section-title" style="color:${accent};border-color:${accent};">语言</div>${languages!.map(l => `<div style="font-size:10pt;color:#${hex(colors.textMuted)};">${l.language} — ${l.proficiency}</div>`).join('')}` : ''}
      </td>
      <td style="width:65%;background:#fff;padding:20mm 14mm;vertical-align:top;">
        ${summary ? `<div class="section-title">自我评价</div><div style="font-size:10pt;margin-bottom:8pt;">${summary}</div>` : ''}
        ${experience.length ? `<div class="section-title">工作经历</div>${experience.map(e => `<div class="entry-header">${e.position} · ${e.company}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
        ${education.length ? `<div class="section-title">教育背景</div>${education.map(e => `<div class="entry-header">${e.school} · ${e.degree}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}` : ''}
        ${projects.length ? `<div class="section-title">项目经验</div>${projects.map(p => `<div class="entry-header">${p.name}</div>${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
      </td>
    </tr></table>`
  } else if (template === 'elegant') {
    html += `<div style="background:${accent};color:#fff;padding:20mm 18mm;">
      <div class="name" style="color:#fff;">${basicInfo.name}</div>
      <div class="title" style="color:#fff;opacity:0.9;">${basicInfo.title}</div>
      <div class="contact" style="color:#fff;opacity:0.7;margin-top:6pt;">${contactItems.join(' · ')}</div>
    </div>
    <div style="padding:14mm 18mm;">
      ${summary ? `<div class="section-title">自我评价</div><div style="font-size:10pt;margin-bottom:8pt;">${summary}</div>` : ''}
      ${experience.length ? `<div class="section-title">工作经历</div>${experience.map(e => `<div class="entry-header">${e.position} · <span style="color:${accent}">${e.company}</span></div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
      ${education.length ? `<div class="section-title">教育背景</div>${education.map(e => `<div class="entry-header">${e.school} · ${e.degree}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}` : ''}
      ${projects.length ? `<div class="section-title">项目经验</div>${projects.map(p => `<div class="entry-header">${p.name}</div>${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
      ${skills.length ? `<div class="section-title">技能</div><div style="font-size:10pt;">${skills.join(' · ')}</div>` : ''}
    </div>`
  } else {
    // minimalist + others
    html += `<div style="padding:20mm 18mm;text-align:center;">
      <div class="name">${basicInfo.name}</div>
      <div class="title">${basicInfo.title}</div>
      <div class="contact" style="margin:8pt 0 16pt;">${contactItems.join(' · ')}</div>
    </div>
    <div style="padding:0 18mm 20mm;">
      ${summary ? `<div class="section-title">自我评价</div><div style="font-size:10pt;margin-bottom:8pt;">${summary}</div>` : ''}
      ${experience.length ? `<div class="section-title">工作经历</div>${experience.map(e => `<div class="entry-header">${e.position} · ${e.company}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>${e.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
      ${education.length ? `<div class="section-title">教育背景</div>${education.map(e => `<div class="entry-header">${e.school} · ${e.degree}</div><div class="entry-meta">${e.startDate} - ${e.endDate}</div>`).join('')}` : ''}
      ${projects.length ? `<div class="section-title">项目经验</div>${projects.map(p => `<div class="entry-header">${p.name}</div>${p.description.map(d => `<div class="entry-desc">• ${d}</div>`).join('')}`).join('')}` : ''}
      ${skills.length ? `<div class="section-title">技能</div><div style="font-size:10pt;">${skills.join(' · ')}</div>` : ''}
    </div>`
  }

  html += `</body></html>`
  return html
}
