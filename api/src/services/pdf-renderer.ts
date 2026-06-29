// Puppeteer PDF 渲染服务：生成矢量 PDF（文本可选、ATS 可解析）
// 布局逻辑与前端 React 模板保持一致，颜色/字体从 shared/design-tokens 统一读取

import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
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
    <div class="bullet-row" style="display:flex;gap:6px;margin-bottom:4px;font-size:${fontSize};color:${color};">
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

function resolveRepoFile(relativePath: string): string | null {
  const roots = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(__dirname, '..', '..', '..'),
    path.resolve(__dirname, '..', '..', '..', '..', '..'),
  ]

  for (const root of roots) {
    const candidate = path.resolve(root, relativePath)
    try {
      fs.accessSync(candidate)
      return candidate
    } catch {
      // Try the next likely runtime root.
    }
  }

  return null
}

function fontFace(family: string, packageName: string, filePrefix: string, weights: number[]): string {
  return weights.map((weight) => {
    const fontPath =
      resolveRepoFile(`api/node_modules/@fontsource/${packageName}/files/${filePrefix}-chinese-simplified-${weight}-normal.woff2`) ||
      resolveRepoFile(`web/node_modules/@fontsource/${packageName}/files/${filePrefix}-chinese-simplified-${weight}-normal.woff2`)

    if (!fontPath) return ''

    return `
      @font-face {
        font-family: '${family}';
        font-style: normal;
        font-display: block;
        font-weight: ${weight};
        src: url('${pathToFileURL(fontPath).href}') format('woff2');
      }
    `
  }).join('\n')
}

function pdfFontFaces(): string {
  const weights = [300, 400, 500, 600, 700, 800, 900]
  return [
    fontFace('Noto Sans SC', 'noto-sans-sc', 'noto-sans-sc', weights),
    fontFace('Noto Serif SC', 'noto-serif-sc', 'noto-serif-sc', weights),
  ].join('\n')
}

function withChineseFallback(fontFamily: string, preferSerif = false): string {
  if (fontFamily.includes('Noto Sans SC') || fontFamily.includes('Noto Serif SC')) return fontFamily
  if (preferSerif || /(^|,\s*)serif\s*$/i.test(fontFamily)) {
    return fontFamily.replace(/(^|,\s*)serif\s*$/i, ", 'Noto Serif SC', serif")
  }
  if (/(^|,\s*)sans-serif\s*$/i.test(fontFamily)) {
    return fontFamily.replace(/(^|,\s*)sans-serif\s*$/i, ", 'Noto Sans SC', sans-serif")
  }
  return `${fontFamily}, 'Noto Sans SC', sans-serif`
}

function normalizeFonts(fonts: { body: string; heading: string; mono?: string }) {
  return {
    ...fonts,
    body: withChineseFallback(fonts.body),
    heading: withChineseFallback(fonts.heading, fonts.heading.includes('Playfair') || fonts.heading.includes('Merriweather')),
    mono: fonts.mono ? withChineseFallback(fonts.mono) : fonts.mono,
  }
}

const chineseProSkillGroups = ['后端', '前端', '数据 / 存储', '工程化 / 运维', 'AI 研发 / Builder', '业务领域']

function groupedSkills(skills: string[]): Array<{ label: string; skills: string[] }> {
  if (skills.length === 0) return []
  const chunkSize = Math.max(2, Math.ceil(skills.length / chineseProSkillGroups.length))
  return chineseProSkillGroups
    .map((label, index) => ({
      label,
      skills: skills.slice(index * chunkSize, (index + 1) * chunkSize),
    }))
    .filter((group) => group.skills.length > 0)
}

// ── Template HTML generators ──

function generateChineseProfessionalHtml(resume: Resume, tokens: typeof designTokens.chinesePro): string {
  const { colors, fonts } = tokens
  const contact = [
    resume.basicInfo.phone,
    resume.basicInfo.email,
    resume.basicInfo.location,
  ].filter((item): item is string => !!item)

  const sectionTitle = (index: string, title: string) => `
    <div class="cp-section-head">
      <span>${index}</span>
      <h2>${esc(title)}</h2>
      <i></i>
    </div>
  `

  const sidebarSection = (title: string, content: string) => `
    <section class="cp-side-section">
      <h3>${esc(title)}</h3>
      ${content}
    </section>
  `

  const mainBullets = (items: string[]) => `
    <div class="cp-bullets">
      ${items.map((item) => `
        <div class="bullet-row cp-bullet">
          <span></span>
          <p>${esc(item)}</p>
        </div>
      `).join('')}
    </div>
  `

  const sidebar = `
    <aside class="cp-sidebar">
      <div class="cp-profile">
        <div class="cp-avatar">${esc(resume.basicInfo.name.replace(/\s/g, '').slice(0, 1) || '简')}</div>
        <h1>${esc(resume.basicInfo.name)}</h1>
        <p>${esc(resume.basicInfo.title || 'FULL-STACK ENGINEER')}</p>
      </div>

      ${sidebarSection('基本信息', `
        <div class="cp-contact">
          ${contact.map((item) => `<p>${esc(item)}</p>`).join('')}
          <p>专业中文投递模板</p>
        </div>
      `)}

      ${resume.skills.length > 0 ? sidebarSection('核心技能', `
        ${groupedSkills(resume.skills).map((group) => `
          <div class="cp-skill-group">
            <h4>${esc(group.label)}</h4>
            <div>${group.skills.map((skill) => `<span>${esc(skill)}</span>`).join('')}</div>
          </div>
        `).join('')}
      `) : ''}

      ${resume.education.length > 0 ? sidebarSection('教育背景', `
        ${resume.education.map((item) => `
          <div class="cp-side-item">
            <strong>${esc(item.school)}</strong>
            <p>${esc(item.degree)}${item.field ? ` · ${esc(item.field)}` : ''}</p>
            <small>${esc(item.startDate)} - ${esc(item.endDate)}</small>
          </div>
        `).join('')}
      `) : ''}

      ${sidebarSection('职业亮点', `
        <div class="cp-highlights">
          ${resume.projects.slice(0, 4).map((project) => `
            <p><strong>${esc(project.name.split('·')[0].trim())}</strong><br><span>${esc(project.role || '核心项目经验')}</span></p>
          `).join('')}
        </div>
      `)}

      ${(resume.languages?.length || resume.certifications?.length) ? sidebarSection('语言 / 认证', `
        <div class="cp-side-list">
          ${resume.languages?.map((item) => `<p>${esc(item.language)} - ${esc(item.proficiency)}</p>`).join('') || ''}
          ${resume.certifications?.map((item) => `<p>${esc(item.name)}${item.issuer ? ` · ${esc(item.issuer)}` : ''}</p>`).join('') || ''}
        </div>
      `) : ''}
    </aside>
  `

  const main = `
    <main class="cp-main">
      ${resume.summary ? `
        <section class="cp-section">
          ${sectionTitle('01', '个人优势')}
          <p class="cp-summary">${esc(resume.summary)}</p>
        </section>
      ` : ''}

      ${resume.experience.length > 0 ? `
        <section class="cp-section">
          ${sectionTitle('02', '工作经历')}
          <div class="cp-timeline">
            ${resume.experience.map((item) => `
              <article class="cp-item">
                <span class="cp-dot"></span>
                <div class="cp-item-top">
                  <h3>${esc(item.company)}</h3>
                  <time>${esc(item.startDate)} - ${esc(item.endDate)}</time>
                </div>
                <p class="cp-role">${esc(item.position)}${item.location ? ` · ${esc(item.location)}` : ''}</p>
                ${mainBullets(item.description)}
              </article>
            `).join('')}
          </div>
        </section>
      ` : ''}

      ${resume.projects.length > 0 ? `
        <section class="cp-section">
          ${sectionTitle('03', '项目经历')}
          ${resume.projects.map((item) => `
            <article class="cp-project">
              <div class="cp-item-top">
                <h3>${esc(item.name)}</h3>
                <time>${esc(item.startDate || '')}${item.startDate || item.endDate ? ' - ' : ''}${esc(item.endDate || '')}</time>
              </div>
              ${item.role ? `<p class="cp-role">${esc(item.role)}</p>` : ''}
              ${resume.skills.length > 0 ? `<p class="cp-stack">技术栈：${resume.skills.slice(0, 8).map(esc).join(' + ')}</p>` : ''}
              ${mainBullets(item.description)}
            </article>
          `).join('')}
        </section>
      ` : ''}
    </main>
  `

  return `
    <div class="cp-page" style="font-family:${fonts.body};background:${colors.bg};color:${colors.text};">
      <style>
        .cp-page { display:flex; min-height:297mm; position:relative; background:#fff; isolation:isolate; }
        .cp-page:before { content:""; position:fixed; left:0; top:0; bottom:0; width:34%; background:${colors.surface}; z-index:0; }
        .cp-sidebar { width:34%; flex-shrink:0; position:relative; z-index:1; background:${colors.surface}; color:#d5e1ee; padding:28px 20px; box-sizing:border-box; }
        .cp-profile { text-align:center; margin-bottom:22px; }
        .cp-avatar { width:72px; height:72px; border-radius:999px; border:2px solid ${colors.accent}; margin:0 auto 14px; background:#1b2f49; color:#fff; font-size:32px; font-weight:600; line-height:72px; box-shadow:0 0 18px rgba(9,196,222,.32); }
        .cp-profile h1 { margin:0; color:#fff; font-size:26px; font-weight:650; line-height:1.15; font-family:${fonts.heading}; }
        .cp-profile p { margin:8px 0 0; color:${colors.accent}; font-size:10px; letter-spacing:.22em; text-transform:uppercase; }
        .cp-side-section { margin-top:20px; break-inside:avoid; page-break-inside:avoid; }
        .cp-side-section h3 { margin:0 0 10px; padding-bottom:8px; color:#fff; border-bottom:1px solid #1b4052; font-size:12px; font-weight:650; }
        .cp-side-section h3:before { content:""; display:inline-block; width:4px; height:12px; border-radius:10px; background:${colors.accent}; margin-right:7px; vertical-align:-2px; }
        .cp-contact p, .cp-side-list p { margin:0 0 7px; font-size:10.5px; line-height:1.45; color:#d5e1ee; }
        .cp-skill-group { margin-bottom:10px; }
        .cp-skill-group h4 { margin:0 0 6px; color:${colors.accent}; font-size:10.5px; font-weight:650; }
        .cp-skill-group span { display:inline-block; margin:0 4px 5px 0; padding:3px 7px; border:1px solid #0f6d83; border-radius:3px; background:#153b55; color:#e9f3fb; font-size:9.5px; line-height:1.15; }
        .cp-side-item { margin-bottom:10px; }
        .cp-side-item strong { display:block; color:#fff; font-size:11px; line-height:1.35; }
        .cp-side-item p { margin:2px 0; color:${colors.accent}; font-size:10px; line-height:1.35; }
        .cp-side-item small { color:#8ea3bb; font-size:9px; }
        .cp-highlights p { margin:0 0 10px; color:${colors.accent}; font-size:10.5px; line-height:1.45; }
        .cp-highlights span { color:#aab9c9; }
        .cp-main { width:66%; position:relative; z-index:1; box-sizing:border-box; padding:28px 30px 30px; background:#fff; }
        .cp-section { margin-bottom:18px; }
        .cp-section-head { display:flex; align-items:center; gap:9px; margin-bottom:12px; break-after:avoid; page-break-after:avoid; }
        .cp-section-head span { display:inline-flex; width:26px; height:26px; align-items:center; justify-content:center; border-radius:4px; background:#111827; color:#fff; font-size:12px; font-weight:650; }
        .cp-section-head h2 { margin:0; color:#111827; font-size:20px; line-height:1; font-weight:650; font-family:${fonts.heading}; }
        .cp-section-head i { height:2px; background:#111827; flex:1; }
        .cp-summary { margin:0; color:#314158; font-size:11.5px; line-height:1.72; }
        .cp-item { position:relative; padding-left:16px; margin-bottom:14px; break-inside:auto; page-break-inside:auto; }
        .cp-dot { position:absolute; left:0; top:4px; width:9px; height:9px; border-radius:50%; border:3px solid ${colors.accent3}; background:${colors.accent}; box-sizing:border-box; }
        .cp-item-top { display:flex; justify-content:space-between; align-items:baseline; gap:18px; break-after:avoid; page-break-after:avoid; }
        .cp-item-top h3 { margin:0; color:#111827; font-size:13.5px; font-weight:650; line-height:1.25; font-family:${fonts.heading}; }
        .cp-item-top time { flex-shrink:0; color:#7a8ba3; font-size:10px; }
        .cp-role { margin:3px 0 0; color:${colors.accent}; font-size:11px; font-weight:650; line-height:1.35; }
        .cp-bullets { margin-top:6px; }
        .cp-bullet { margin-bottom:4px; font-size:11px; line-height:1.48; color:#314158; }
        .cp-bullet span { width:4px; height:4px; border-radius:50%; background:${colors.accent}; margin-top:7px; flex-shrink:0; }
        .cp-bullet p { margin:0; }
        .cp-project { margin-bottom:15px; break-inside:auto; page-break-inside:auto; }
        .cp-stack { margin:6px 0 5px; padding:6px 8px; background:${colors.highlight}; color:#42526a; font-size:10px; line-height:1.45; }
      </style>
      ${sidebar}
      ${main}
    </div>
  `
}

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

  return `<div style="display:flex;min-height:297mm;">${sidebar}${main}</div>`
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

  return `<div style="display:flex;min-height:297mm;">${sidebar}${main}</div>`
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
    ${pdfFontFaces()}
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 210mm;
      min-height: 297mm;
      background: ${bg};
    }
    body {
      font-family: ${fonts.body}, -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4 { font-family: ${fonts.heading}, ${fonts.body}, sans-serif; }
    .pdf-root,
    .pdf-root * {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }
    /* 分页时只保护标题和单条 bullet，避免整块项目被推到下一页造成首页大空白。 */
    .item { break-inside: auto; page-break-inside: auto; }
    .sec-head { break-after: avoid; page-break-after: avoid; }
    .bullet-row { break-inside: avoid; page-break-inside: avoid; }
    p, .item, .bullet-row { orphans: 2; widows: 2; }
  </style>
</head>
<body><div style="position:fixed;inset:0;background:${bg};z-index:-1;"></div><div class="pdf-root">${body}</div></body>
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
  chinesePro: generateChineseProfessionalHtml,
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
  const pdfTokens = { ...tokens, fonts: normalizeFonts(tokens.fonts) }
  const body = generator(resume, pdfTokens)
  return wrapHtml(body, pdfTokens.fonts, tokens.colors.bg)
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
    await page.evaluateHandle('document.fonts.ready')

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
