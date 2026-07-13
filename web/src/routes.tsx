import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import type { RouteRecord } from 'vite-react-ssg'
import { useResumeStore } from '@/lib/store'
import { Download, Edit, Home, Preview, Templates, Upload } from '@/pages'
import AiResumeOptimizer from '@/pages/AiResumeOptimizer'
import TemplateDetail from '@/pages/TemplateDetail'
import Faq from '@/pages/Faq'
import Guides from '@/pages/Guides'
import GuideDetail from '@/pages/GuideDetail'
import { Seo } from '@/components/Seo'
import { ScrollToTop } from '@/components/ScrollToTop'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { templateList, templateRegistry } from '@/lib/template-config'
import { guides } from '@/lib/guides'
import type { TemplateStyle } from '@/types/resume'
import Admin from '@/pages/Admin'

function Layout() {
  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      <Seo />
      <Outlet />
    </>
  )
}

function HomeRoute() {
  const navigate = useNavigate()
  return <Home onStart={() => navigate('/upload')} onBrowseTemplates={() => navigate('/templates')} />
}

function UploadRoute() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reset = useResumeStore((state) => state.reset)
  const [initialTemplate, setInitialTemplate] = useState<TemplateStyle | undefined>(undefined)

  useEffect(() => {
    const templateParam = searchParams.get('template') as TemplateStyle | null
    setInitialTemplate(templateParam && templateRegistry[templateParam] ? templateParam : undefined)
  }, [searchParams])

  return (
    <Upload
      onNext={() => navigate('/preview')}
      initialTemplate={initialTemplate}
      onBackHome={() => {
        reset()
        navigate('/')
      }}
    />
  )
}

function PreviewRoute() {
  const navigate = useNavigate()
  const optimizedResume = useResumeStore((state) => state.optimizedResume)

  if (!optimizedResume) {
    return <Navigate to="/upload" replace />
  }

  return (
    <Preview
      onNext={() => navigate('/edit')}
      onBack={() => navigate('/upload')}
      onRegenerate={() => {
        navigate('/upload')
        return Promise.resolve()
      }}
    />
  )
}

function EditRoute() {
  const navigate = useNavigate()
  const editedResume = useResumeStore((state) => state.editedResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)

  if (!editedResume) {
    return <Navigate to="/upload" replace />
  }

  if (!selectedTemplate) {
    return <Navigate to="/preview" replace />
  }

  return (
    <Edit
      onBack={() => navigate('/preview')}
      onNext={() => navigate('/download')}
    />
  )
}

function DownloadRoute() {
  const navigate = useNavigate()
  const reset = useResumeStore((state) => state.reset)
  const resume = useResumeStore((state) => state.editedResume ?? state.optimizedResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)

  if (!resume) {
    return <Navigate to="/upload" replace />
  }

  if (!selectedTemplate) {
    return <Navigate to="/preview" replace />
  }

  return (
    <Download
      onRestart={() => navigate('/preview')}
      onBackHome={() => {
        reset()
        navigate('/')
      }}
    />
  )
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'upload', element: <UploadRoute /> },
      { path: 'preview', element: <PreviewRoute /> },
      { path: 'edit', element: <EditRoute /> },
      { path: 'download', element: <DownloadRoute /> },
      { path: 'templates', element: <Templates /> },
      {
        path: 'templates/:slug',
        element: <TemplateDetail />,
        getStaticPaths: () => templateList.map((template) => `/templates/${template.id}`),
      },
      { path: 'ai-resume-optimizer', element: <AiResumeOptimizer /> },
      { path: 'faq', element: <Faq /> },
      { path: 'guides', element: <Guides /> },
      { path: 'admin', element: <Admin /> },
      {
        path: 'guides/:slug',
        element: <GuideDetail />,
        getStaticPaths: () => guides.map((guide) => `/guides/${guide.slug}`),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
