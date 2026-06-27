import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type SeoConfig = {
  title: string
  description: string
  path: string
  keywords?: string
  noindex?: boolean
  structuredData?: Record<string, unknown>
}

const siteName = 'ResumeCraft'
const defaultDescription = 'ResumeCraft 是一款 AI 简历优化工具，支持上传 PDF / Word 简历、按岗位 JD 优化内容、选择专业模板并导出 PDF 或 Word。'

const routeSeo: Record<string, SeoConfig> = {
  '/': {
    title: 'ResumeCraft - AI 简历优化与专业简历模板工具',
    description: defaultDescription,
    path: '/',
    keywords: 'AI简历优化,简历模板,简历排版,ATS简历优化,简历制作',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteName,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: defaultDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
      },
    },
  },
  '/templates': {
    title: '简历模板库 - 专业中文简历模板与岗位化示例',
    description: '浏览 ResumeCraft 的专业简历模板，覆盖技术、产品、运营、设计、金融、学术等岗位场景，上传简历后可一键套用并导出。',
    path: '/templates',
    keywords: '简历模板,中文简历模板,求职简历模板,专业简历排版,简历样式',
  },
  '/ai-resume-optimizer': {
    title: 'AI 简历优化工具 - 按岗位 JD 改写简历并提升 ATS 匹配度',
    description: '使用 AI 分析目标岗位 JD，优化简历关键词、项目表达、成果描述和 ATS 匹配度，适合求职投递前快速调整简历。',
    path: '/ai-resume-optimizer',
    keywords: 'AI简历优化,JD简历优化,ATS简历优化,简历关键词优化,简历改写',
  },
  '/upload': {
    title: '上传简历 - ResumeCraft',
    description: '上传 PDF 或 Word 简历，选择是否按目标岗位 JD 进行 AI 优化。',
    path: '/upload',
    noindex: true,
  },
  '/preview': {
    title: '选择简历模板 - ResumeCraft',
    description: '预览优化后的简历内容并选择合适的专业模板。',
    path: '/preview',
    noindex: true,
  },
  '/download': {
    title: '下载简历 - ResumeCraft',
    description: '导出优化后的 PDF 或 Word 简历文件。',
    path: '/download',
    noindex: true,
  },
}

function getSiteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined
  if (configured) return configured.replace(/\/$/, '')
  return window.location.origin
}

function setMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }
  element.href = href
}

function setStructuredData(data?: Record<string, unknown>) {
  const id = 'page-structured-data'
  const existing = document.getElementById(id)

  if (!data) {
    existing?.remove()
    return
  }

  const element = (existing ?? document.createElement('script')) as HTMLScriptElement
  element.id = id
  element.type = 'application/ld+json'
  element.textContent = JSON.stringify(data)
  if (!existing) document.head.appendChild(element)
}

export function PageSEO() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = routeSeo[pathname] ?? routeSeo['/']
    const canonical = `${getSiteOrigin()}${seo.path}`
    const robots = seo.noindex ? 'noindex,nofollow' : 'index,follow'

    document.title = seo.title
    setMeta('meta[name="description"]', { name: 'description', content: seo.description })
    setMeta('meta[name="robots"]', { name: 'robots', content: robots })
    setMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#2563eb' })

    if (seo.keywords) {
      setMeta('meta[name="keywords"]', { name: 'keywords', content: seo.keywords })
    }

    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
    setLink('canonical', canonical)
    setStructuredData(seo.structuredData)
  }, [pathname])

  return null
}
