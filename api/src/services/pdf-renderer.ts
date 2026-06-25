// Puppeteer PDF 渲染服务：生成矢量 PDF（文本可选、ATS 可解析）
// 布局逻辑与前端 React 模板保持一致，颜色/字体从 shared/design-tokens 统一读取

import puppeteer, { Browser } from 'puppeteer'
import { Resume, TemplateStyle } from '../types/resume'
import { designTokens } from '../../../shared/design-tokens'

// ── Helpers ──

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function contactItems(info: Resume['basicInfo']): string[] {
  return [info.email, info.phone, info.location, info.website, info.linkedin, info.github].filter((item): item is string => !!item)
}

function bulletList(items: string[], color: string, fontSize = '10px'): string {
  return items.map(item => `
    <div style="display:flex;gap:6px;margin-bottom:4px;font-size:${fontSize};color:${color};">
      <span style="color:${color};flex-shrink:0;">•</span>
      <span>${esc(item)}</span>
    </div>
  `).join('')
}

// ── Section renderer (shared across templates) ──

function renderSection(title: string, content: string, accentColor: string, fontFamily: string): string {
  return `
    <div style="margin-bottom:16px;">
      <div class="sec-head" style="font-size:13px;font-weight:600;color:${accentColor};margin-bottom:6px;padding-bottom:4px;border-bottom:2px solid ${accentColor};font-family:${fontFamily};">
        ${esc(title)}
      </div>
      ${content}
    </div>
  `
}

// ── Template HTML generators ──

function generateMinimalistHtml(resume: Resume, tokens: typeof designTokens.minimalist): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const sections: string[] = []
  if (resume.summary) {
    sections.push(renderSection('自我评价', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:11px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ''}</div>
        ${bulletList(e.description, colors.textMuted)}
      </div>
    `).join('')
    sections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    sections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:10px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}${p.role ? ` · ${esc(p.role)}` : ''}</div>
        ${p.startDate ? `<div style="font-size:9px;color:${colors.textMuted};">${esc(p.startDate)} — ${esc(p.endDate || '至今')}</div>` : ''}
        ${bulletList(p.description, colors.textMuted)}
      </div>
    `).join('')
    sections.push(renderSection('项目经验', proj, colors.accent, fonts.heading))
  }
  if (resume.skills.length > 0) {
    sections.push(renderSection('技能', `<div style="font-size:10px;color:${colors.textMuted};">${resume.skills.map(s => esc(s)).join(' · ')}</div>`, colors.accent, fonts.heading))
  }

  return `
    <div style="text-align:center;margin-bottom:20px;">
      <h1 style="font-size:28px;font-weight:700;color:${colors.text};font-family:${fonts.heading};">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:13px;color:${colors.textMuted};margin-top:4px;">${esc(resume.basicInfo.title)}</p>
      <div style="width:60px;height:2px;background:${colors.accent};margin:12px auto;"></div>
      <p style="font-size:10px;color:${colors.textMuted};">${contact.map(esc).join(' · ')}</p>
    </div>
    ${sections.join('')}
  `
}

function generateTechHtml(resume: Resume, tokens: typeof designTokens.tech): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const sidebar = `
    <div style="background:${colors.surface};padding:24px 16px;width:32%;flex-shrink:0;box-sizing:border-box;">
      <h1 style="font-size:22px;font-weight:700;color:${colors.text};font-family:${fonts.heading};line-height:1.1;">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:11px;color:${colors.textMuted};margin-top:8px;font-family:${fonts.mono};">${esc(resume.basicInfo.title)}</p>
      <div style="margin-top:20px;">
        <div style="font-size:11px;font-weight:600;color:${colors.accent};margin-bottom:8px;">联系方式</div>
        ${contact.map(c => `<p style="font-size:9px;color:${colors.textMuted};margin-bottom:4px;">${esc(c)}</p>`).join('')}
      </div>
      ${resume.skills.length > 0 ? `
        <div style="margin-top:16px;">
          <div style="font-size:11px;font-weight:600;color:${colors.accent};margin-bottom:8px;">技能</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${resume.skills.map(s => `<span style="font-size:9px;padding:2px 8px;background:${colors.accent}20;color:${colors.textMuted};border-radius:4px;font-family:${fonts.mono};">${esc(s)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${resume.languages && resume.languages.length > 0 ? `
        <div style="margin-top:16px;">
          <div style="font-size:11px;font-weight:600;color:${colors.accent};margin-bottom:8px;">语言</div>
          ${resume.languages.map(l => `<p style="font-size:9px;color:${colors.textMuted};margin-bottom:4px;">${esc(l.language)} — ${esc(l.proficiency)}</p>`).join('')}
        </div>
      ` : ''}
    </div>
  `

  const mainSections: string[] = []
  if (resume.summary) {
    mainSections.push(renderSection('自我评价', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:12px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};font-family:${fonts.mono};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}</div>
        ${bulletList(e.description, colors.textMuted, '9.5px')}
      </div>
    `).join('')
    mainSections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};font-family:${fonts.mono};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    mainSections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}</div>
        ${p.startDate ? `<div style="font-size:9px;color:${colors.textMuted};font-family:${fonts.mono};">${esc(p.startDate)} — ${esc(p.endDate || '至今')}</div>` : ''}
        ${bulletList(p.description, colors.textMuted, '9.5px')}
      </div>
    `).join('')
    mainSections.push(renderSection('项目经验', proj, colors.accent, fonts.heading))
  }

  const main = `
    <div style="padding:24px 20px;flex:1;min-width:0;">
      ${mainSections.join('')}
    </div>
  `

  return `<div style="display:flex;min-height:277mm;">${sidebar}${main}</div>`
}

function generateElegantHtml(resume: Resume, tokens: typeof designTokens.elegant): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const header = `
    <div style="background:${colors.accent};padding:28px 32px;color:${colors.textInverse};">
      <h1 style="font-size:28px;font-weight:700;font-family:${fonts.heading};">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:13px;margin-top:4px;opacity:0.9;">${esc(resume.basicInfo.title)}</p>
      <p style="font-size:10px;margin-top:10px;opacity:0.7;">${contact.map(esc).join(' · ')}</p>
    </div>
  `

  const leftSections: string[] = []
  if (resume.summary) {
    leftSections.push(renderSection('自我评价', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.skills.length > 0) {
    leftSections.push(renderSection('技能', `<div style="display:flex;flex-wrap:wrap;gap:4px;">${resume.skills.map(s => `<span style="font-size:9px;padding:2px 8px;background:${colors.accent}15;color:${colors.textMuted};border-radius:4px;">${esc(s)}</span>`).join('')}</div>`, colors.accent, fonts.heading))
  }

  const rightSections: string[] = []
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:12px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}</div>
        ${bulletList(e.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    rightSections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}</div>
        ${bulletList(p.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('项目经验', proj, colors.accent, fonts.heading))
  }

  const body = `
    <div style="display:flex;padding:20px 32px;gap:24px;">
      <div style="flex:1;">${leftSections.join('')}</div>
      <div style="flex:2;">${rightSections.join('')}</div>
    </div>
  `

  return header + body
}

function generateBusinessHtml(resume: Resume, tokens: typeof designTokens.business): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const header = `
    <div style="padding:24px 32px 16px;">
      <h1 style="font-size:28px;font-weight:700;color:${colors.text};font-family:${fonts.heading};">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:13px;color:${colors.accent};margin-top:4px;">${esc(resume.basicInfo.title)}</p>
      <p style="font-size:10px;color:${colors.textMuted};margin-top:8px;">${contact.map(esc).join(' · ')}</p>
      <div style="width:100%;height:3px;background:${colors.accent};margin-top:16px;"></div>
    </div>
  `

  const leftSections: string[] = []
  if (resume.summary) {
    leftSections.push(renderSection('自我评价', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.skills.length > 0) {
    leftSections.push(renderSection('技能', `<div style="font-size:10px;color:${colors.textMuted};">${resume.skills.map(s => esc(s)).join(' · ')}</div>`, colors.accent, fonts.heading))
  }

  const rightSections: string[] = []
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:12px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}</div>
        ${bulletList(e.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    rightSections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}</div>
        ${bulletList(p.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('项目经验', proj, colors.accent, fonts.heading))
  }

  const body = `
    <div style="display:flex;padding:0 32px 24px;gap:24px;">
      <div style="flex:1;">${leftSections.join('')}</div>
      <div style="flex:2;">${rightSections.join('')}</div>
    </div>
  `

  return header + body
}

function generateCreativeHtml(resume: Resume, tokens: typeof designTokens.creative): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const sidebar = `
    <div style="background:${colors.surface};padding:24px 16px;width:32%;flex-shrink:0;box-sizing:border-box;">
      <h1 style="font-size:22px;font-weight:700;color:${colors.textInverse};font-family:${fonts.heading};line-height:1.1;">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:11px;color:${colors.textInverse};opacity:0.8;margin-top:8px;">${esc(resume.basicInfo.title)}</p>
      <div style="margin-top:20px;">
        <div style="font-size:11px;font-weight:600;color:${colors.accent2};margin-bottom:8px;">联系方式</div>
        ${contact.map(c => `<p style="font-size:9px;color:${colors.textInverse};margin-bottom:4px;">${esc(c)}</p>`).join('')}
      </div>
      ${resume.skills.length > 0 ? `
        <div style="margin-top:16px;">
          <div style="font-size:11px;font-weight:600;color:${colors.accent2};margin-bottom:8px;">技能</div>
          ${resume.skills.map(s => `<p style="font-size:9px;color:${colors.textInverse};margin-bottom:4px;">• ${esc(s)}</p>`).join('')}
        </div>
      ` : ''}
    </div>
  `

  const mainSections: string[] = []
  if (resume.summary) {
    mainSections.push(renderSection('自我评价', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:12px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}</div>
        ${bulletList(e.description, colors.textMuted)}
      </div>
    `).join('')
    mainSections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    mainSections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}</div>
        ${bulletList(p.description, colors.textMuted)}
      </div>
    `).join('')
    mainSections.push(renderSection('项目经验', proj, colors.accent, fonts.heading))
  }

  const main = `<div style="padding:24px 20px;flex:1;min-width:0;">${mainSections.join('')}</div>`

  return `<div style="display:flex;min-height:277mm;">${sidebar}${main}</div>`
}

function generateAcademicHtml(resume: Resume, tokens: typeof designTokens.academic): string {
  const { colors, fonts } = tokens
  const contact = contactItems(resume.basicInfo)

  const header = `
    <div style="padding:24px 32px 16px;">
      <h1 style="font-size:28px;font-weight:700;color:${colors.text};font-family:${fonts.heading};">${esc(resume.basicInfo.name)}</h1>
      <p style="font-size:13px;color:${colors.accent};margin-top:4px;font-family:${fonts.body};">${esc(resume.basicInfo.title)}</p>
      <p style="font-size:10px;color:${colors.textMuted};margin-top:8px;">${contact.map(esc).join(' · ')}</p>
      <div style="width:100%;height:2px;background:${colors.accent};margin-top:16px;border-top:1px solid ${colors.accent};"></div>
    </div>
  `

  const leftSections: string[] = []
  if (resume.summary) {
    leftSections.push(renderSection('研究兴趣', `<p style="font-size:10px;color:${colors.textMuted};line-height:1.6;">${esc(resume.summary)}</p>`, colors.accent, fonts.heading))
  }
  if (resume.skills.length > 0) {
    leftSections.push(renderSection('技能', `<div style="font-size:10px;color:${colors.textMuted};">${resume.skills.map(s => esc(s)).join(' · ')}</div>`, colors.accent, fonts.heading))
  }

  const rightSections: string[] = []
  if (resume.experience.length > 0) {
    const exp = resume.experience.map(e => `
      <div class="item" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:12px;font-weight:600;color:${colors.text};font-family:${fonts.heading};">${esc(e.position)}</span>
          <span style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</span>
        </div>
        <div style="font-size:10px;color:${colors.accent};margin-bottom:4px;">${esc(e.company)}</div>
        ${bulletList(e.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('工作经历', exp, colors.accent, fonts.heading))
  }
  if (resume.education.length > 0) {
    const edu = resume.education.map(e => `
      <div class="item" style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(e.school)}</div>
        <div style="font-size:10px;color:${colors.textMuted};">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div style="font-size:9px;color:${colors.textMuted};">${esc(e.startDate)} — ${esc(e.endDate)}</div>
      </div>
    `).join('')
    rightSections.push(renderSection('教育背景', edu, colors.accent, fonts.heading))
  }
  if (resume.projects.length > 0) {
    const proj = resume.projects.map(p => `
      <div class="item" style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:600;color:${colors.text};">${esc(p.name)}</div>
        ${bulletList(p.description, colors.textMuted)}
      </div>
    `).join('')
    rightSections.push(renderSection('研究项目', proj, colors.accent, fonts.heading))
  }

  const body = `
    <div style="display:flex;padding:0 32px 24px;gap:24px;">
      <div style="flex:1;">${leftSections.join('')}</div>
      <div style="flex:2;">${rightSections.join('')}</div>
    </div>
  `

  return header + body
}

// ── HTML wrapper with base styles ──

function wrapHtml(body: string, fonts: { body: string; heading: string }, bg: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 10mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: ${bg}; }
    body {
      font-family: ${fonts.body}, -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4 { font-family: ${fonts.heading}, ${fonts.body}, sans-serif; }
    /* 分页时保护：单个条目不被从中间切断，章节标题不落在页尾 */
    .item { break-inside: avoid; page-break-inside: avoid; }
    .sec-head { break-after: avoid; page-break-after: avoid; }
  </style>
</head>
<body><div style="position:fixed;inset:0;background:${bg};z-index:-1;"></div>${body}</body>
</html>
  `.trim()
}

// ── Public API ──

const htmlGenerators: Record<TemplateStyle, (resume: Resume, tokens: typeof designTokens.minimalist) => string> = {
  minimalist: generateMinimalistHtml,
  tech: generateTechHtml,
  elegant: generateElegantHtml,
  business: generateBusinessHtml,
  creative: generateCreativeHtml,
  academic: generateAcademicHtml,
  cobalt: generateTechHtml,
  corporate: generateElegantHtml,
  compact: generateBusinessHtml,
  finance: generateElegantHtml,
  warm: generateBusinessHtml,
  editorial: generateElegantHtml,
  aurora: generateElegantHtml,
  portfolio: generateTechHtml,
  noir: generateMinimalistHtml,
}

export function generateHtmlForPdf(resume: Resume, template: TemplateStyle): string {
  const tokens = designTokens[template] || designTokens.minimalist
  const generator = htmlGenerators[template] || htmlGenerators.minimalist
  const body = generator(resume, tokens)
  return wrapHtml(body, tokens.fonts, tokens.colors.bg)
}

// ── Puppeteer rendering ──

let browserInstance: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })
  }
  return browserInstance
}

export async function renderResumeToPdf(resume: Resume, template: TemplateStyle): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage()

  try {
    const html = generateHtmlForPdf(resume, template)
    await page.setContent(html, { waitUntil: 'load', timeout: 15000 })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await page.close()
  }
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close()
    browserInstance = null
  }
}
