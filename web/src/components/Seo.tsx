import { Head } from 'vite-react-ssg'
import { useLocation } from 'react-router-dom'
import { categoryLabels, templateList, templateRegistry } from '@/lib/template-config'
import { faqItems } from '@/lib/faq'
import { guideMap, guides } from '@/lib/guides'
import type { TemplateStyle } from '@/types/resume'

type SeoConfig = {
  title: string
  description: string
  path: string
  keywords?: string
  noindex?: boolean
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

const siteName = 'ResumeCraft'
const defaultDescription =
  'ResumeCraft 是一款 AI 简历优化工具，支持上传 PDF / Word 简历、按岗位 JD 优化内容、选择专业模板并导出 PDF 或 Word。'

// 站点根地址：SSG 构建期由 VITE_SITE_URL 注入，客户端兜底用 window.location.origin。
const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://resume.dolfi.chat')
)

const templateItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '专业中文简历模板',
  itemListElement: templateList.map((template, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: `${template.label}简历模板`,
    url: `${SITE_URL}/templates/${template.id}`,
  })),
}

const staticRouteSeo: Record<string, SeoConfig> = {
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
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
    },
  },
  '/templates': {
    title: '简历模板库 - 专业中文简历模板与岗位化示例',
    description:
      '浏览 ResumeCraft 的专业简历模板，覆盖技术、产品、运营、设计、金融、学术等岗位场景，上传简历后可一键套用并导出。',
    path: '/templates',
    keywords: '简历模板,中文简历模板,求职简历模板,专业简历排版,简历样式',
    structuredData: templateItemList,
  },
  '/ai-resume-optimizer': {
    title: 'AI 简历优化工具 - 按岗位 JD 改写简历并提升 ATS 匹配度',
    description:
      '使用 AI 分析目标岗位 JD，优化简历关键词、项目表达、成果描述和 ATS 匹配度，适合求职投递前快速调整简历。',
    path: '/ai-resume-optimizer',
    keywords: 'AI简历优化,JD简历优化,ATS简历优化,简历关键词优化,简历改写',
  },
  '/faq': {
    title: '常见问题 - AI 简历优化、ATS 与模板使用 | ResumeCraft',
    description:
      '关于 ResumeCraft 的常见问题：是否免费、支持的文件格式、AI 是否会编造经历、什么是 ATS、数据隐私、PDF / Word 导出和模板选择。',
    path: '/faq',
    keywords: '简历优化常见问题,ATS是什么,AI简历靠谱吗,简历模板怎么选',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  },
  '/guides': {
    title: '简历指南 - 简历怎么写、ATS 优化与应届生简历技巧',
    description:
      '简历写作与求职指南合集：一份专业简历的结构与技巧、ATS 简历优化、应届生简历怎么写，帮你把经历整理成更容易拿到面试的表达。',
    path: '/guides',
    keywords: '简历怎么写,简历指南,ATS简历优化,应届生简历,求职技巧',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '简历写作与求职指南',
      itemListElement: guides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.title,
        url: `${SITE_URL}/guides/${guide.slug}`,
      })),
    },
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
  '/admin': {
    title: '运营后台 - ResumeCraft',
    description: 'ResumeCraft 内部运营统计后台。',
    path: '/admin',
    noindex: true,
  },
}

function templateDetailSeo(slug: string): SeoConfig | null {
  const template = templateRegistry[slug as TemplateStyle]
  if (!template) return null

  const categoryLabel = categoryLabels[template.category]
  const roles = template.recommended.join('、')
  const path = `/templates/${template.id}`

  return {
    title: `${template.label}简历模板 - ${categoryLabel}场景 | ResumeCraft`,
    description: `${template.label}简历模板：${template.description}。适合${roles}等岗位，上传简历即可套用并导出 PDF / Word。`,
    path,
    keywords: `${template.label}简历模板,${categoryLabel}简历模板,${template.recommended
      .slice(0, 3)
      .map((r) => `${r}简历模板`)
      .join(',')}`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: '简历模板', item: `${SITE_URL}/templates` },
        { '@type': 'ListItem', position: 3, name: `${template.label}简历模板`, item: `${SITE_URL}${path}` },
      ],
    },
  }
}

function guideDetailSeo(slug: string): SeoConfig | null {
  const guide = guideMap[slug]
  if (!guide) return null

  const path = `/guides/${guide.slug}`
  const url = `${SITE_URL}${path}`

  return {
    title: `${guide.title} | ResumeCraft`,
    description: guide.description,
    path,
    keywords: guide.keywords,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        datePublished: guide.updated,
        dateModified: guide.updated,
        author: { '@type': 'Organization', name: siteName },
        publisher: { '@type': 'Organization', name: siteName },
        mainEntityOfPage: url,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: '简历指南', item: `${SITE_URL}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  }
}

function resolveSeo(pathname: string): SeoConfig {
  if (staticRouteSeo[pathname]) return staticRouteSeo[pathname]

  const templateMatch = pathname.match(/^\/templates\/([^/]+)\/?$/)
  if (templateMatch) {
    const seo = templateDetailSeo(templateMatch[1])
    if (seo) return seo
  }

  const guideMatch = pathname.match(/^\/guides\/([^/]+)\/?$/)
  if (guideMatch) {
    const seo = guideDetailSeo(guideMatch[1])
    if (seo) return seo
  }

  return staticRouteSeo['/']
}

export function Seo() {
  const { pathname } = useLocation()
  const seo = resolveSeo(pathname)
  const canonical = `${SITE_URL}${seo.path}`
  const robots = seo.noindex ? 'noindex,nofollow' : 'index,follow'
  const structured = seo.structuredData
    ? Array.isArray(seo.structuredData)
      ? seo.structuredData
      : [seo.structuredData]
    : []

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={robots} />
      {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {structured.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Head>
  )
}
