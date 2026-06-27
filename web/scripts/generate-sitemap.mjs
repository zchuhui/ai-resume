import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

// 后置脚本：在 vite-react-ssg 预渲染完成后，扫描 dist 里实际生成的 index.html，
// 据此产出与真实页面一致的 sitemap.xml / robots.txt。这样新增模板详情页等路由无需手改。

const root = process.cwd()
const distDir = resolve(root, 'dist')
const publicDir = resolve(root, 'public')

// 不进 sitemap 的流程页（已在 Seo 组件里标记 noindex）。
const NOINDEX_ROUTES = new Set(['/upload', '/preview', '/download', '/admin'])

function loadSiteUrl() {
  let url = process.env.VITE_SITE_URL || process.env.SITE_URL
  if (!url) {
    const envFile = resolve(root, '.env')
    if (existsSync(envFile)) {
      const match = readFileSync(envFile, 'utf8').match(/^\s*VITE_SITE_URL\s*=\s*(.+)\s*$/m)
      if (match) url = match[1].trim().replace(/^["']|["']$/g, '')
    }
  }
  return url ? url.replace(/\/$/, '') : ''
}

function collectRoutes(dir) {
  const routes = []
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const full = resolve(current, entry)
      const stat = statSync(full)
      if (stat.isDirectory()) {
        if (entry === 'assets') continue
        walk(full)
      } else if (entry === 'index.html') {
        const rel = relative(dir, full).replace(/index\.html$/, '').replace(/\\/g, '/').replace(/\/$/, '')
        routes.push(rel ? `/${rel}` : '/')
      }
    }
  }
  walk(dir)
  return routes
}

function priorityFor(route) {
  if (route === '/') return { changefreq: 'weekly', priority: '1.0' }
  if (route.startsWith('/templates/')) return { changefreq: 'monthly', priority: '0.6' }
  return { changefreq: 'monthly', priority: '0.8' }
}

const siteUrl = loadSiteUrl()
if (!siteUrl) {
  console.error('[seo] 未找到 VITE_SITE_URL / SITE_URL，跳过 sitemap 生成。')
  process.exit(1)
}

if (!existsSync(distDir)) {
  console.error('[seo] 未找到 dist 目录，请先执行构建（vite-react-ssg build）。')
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const routes = collectRoutes(distDir)
  .filter((route) => !NOINDEX_ROUTES.has(route))
  .sort((a, b) => a.localeCompare(b))

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const { changefreq, priority } = priorityFor(route)
    return `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
${[...NOINDEX_ROUTES].map((route) => `Disallow: ${route}`).join('\n')}
Sitemap: ${siteUrl}/sitemap.xml
`

// 写入 dist（部署产物）与 public（保持仓库源一致）。
for (const dir of [distDir, publicDir]) {
  if (!existsSync(dir)) continue
  writeFileSync(resolve(dir, 'sitemap.xml'), sitemap)
  writeFileSync(resolve(dir, 'robots.txt'), robots)
}

console.log(`[seo] 已生成 sitemap.xml（${routes.length} 条 URL）和 robots.txt，站点：${siteUrl}`)
