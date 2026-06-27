import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import type { RouteRecord } from 'vite-react-ssg'
import { useResumeStore } from '@/lib/store'
import { Download, Home, Preview, Templates, Upload } from '@/pages'
import AiResumeOptimizer from '@/pages/AiResumeOptimizer'
import TemplateDetail from '@/pages/TemplateDetail'
import Faq from '@/pages/Faq'
import { Seo } from '@/components/Seo'
import { ScrollToTop } from '@/components/ScrollToTop'
import { templateList } from '@/lib/template-config'

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Seo />
      <Outlet />
    </>
  )
}

function HomeRoute() {
  const navigate = useNavigate()
  return <Home onStart={() => navigate('/upload')} />
}

function UploadRoute() {
  const navigate = useNavigate()
  const reset = useResumeStore((state) => state.reset)

  return (
    <Upload
      onNext={() => navigate('/preview')}
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
      onNext={() => navigate('/download')}
      onBack={() => navigate('/upload')}
      onRegenerate={() => {
        navigate('/upload')
        return Promise.resolve()
      }}
    />
  )
}

function DownloadRoute() {
  const navigate = useNavigate()
  const reset = useResumeStore((state) => state.reset)
  const optimizedResume = useResumeStore((state) => state.optimizedResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)

  if (!optimizedResume) {
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
      { path: 'download', element: <DownloadRoute /> },
      { path: 'templates', element: <Templates /> },
      {
        path: 'templates/:slug',
        element: <TemplateDetail />,
        getStaticPaths: () => templateList.map((template) => `/templates/${template.id}`),
      },
      { path: 'ai-resume-optimizer', element: <AiResumeOptimizer /> },
      { path: 'faq', element: <Faq /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]
