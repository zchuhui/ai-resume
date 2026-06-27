import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/lib/store'
import { Download, Home, Preview, Upload } from '@/pages'
import AiResumeOptimizer from '@/pages/AiResumeOptimizer'
import Templates from '@/pages/Templates'
import { PageSEO } from '@/components/PageSEO'
import { ScrollToTop } from '@/components/ScrollToTop'

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

function App() {
  return (
    <>
      <ScrollToTop />
      <PageSEO />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/upload" element={<UploadRoute />} />
        <Route path="/preview" element={<PreviewRoute />} />
        <Route path="/download" element={<DownloadRoute />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/ai-resume-optimizer" element={<AiResumeOptimizer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
