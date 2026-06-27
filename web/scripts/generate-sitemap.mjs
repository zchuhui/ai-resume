import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const optional = process.argv.includes('--optional')
const rawSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL

if (!rawSiteUrl) {
  const message = 'Set VITE_SITE_URL or SITE_URL to generate sitemap.xml with production URLs.'
  if (optional) {
    console.warn(`[seo] ${message}`)
    process.exit(0)
  }
  console.error(`[seo] ${message}`)
  process.exit(1)
}

const siteUrl = rawSiteUrl.replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)
const routes = ['/', '/templates', '/ai-resume-optimizer']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /upload
Disallow: /preview
Disallow: /download
Sitemap: ${siteUrl}/sitemap.xml
`

const publicDir = resolve(process.cwd(), 'public')
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(resolve(publicDir, 'robots.txt'), robots)
console.log(`[seo] Generated sitemap.xml and robots.txt for ${siteUrl}`)
