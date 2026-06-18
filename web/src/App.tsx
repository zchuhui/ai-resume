import { useState, useCallback } from 'react'
import { useResumeStore } from '@/lib/store'
import { Home, Upload, Preview, Download } from '@/pages'

type Step = 'home' | 'upload' | 'preview' | 'download'

function App() {
  const optimizedResume = useResumeStore((state) => state.optimizedResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)
  const reset = useResumeStore((state) => state.reset)

  const [step, setStep] = useState<Step>(() => {
    if (selectedTemplate) return 'download'
    if (optimizedResume) return 'preview'
    return 'home'
  })

  const goToUpload = useCallback(() => setStep('upload'), [])
  const goToPreview = useCallback(() => setStep('preview'), [])
  const goToDownload = useCallback(() => setStep('download'), [])
  const goToHome = useCallback(() => {
    reset()
    setStep('home')
  }, [reset])
  const goBackToUpload = useCallback(() => setStep('upload'), [])
  const goBackToPreview = useCallback(() => setStep('preview'), [])

  const handleRegenerate = useCallback(async () => {
    // Trigger re-running the optimize flow by going back to upload with existing data
    goBackToUpload()
    return Promise.resolve()
  }, [goBackToUpload])

  switch (step) {
    case 'home':
      return <Home onStart={goToUpload} />
    case 'upload':
      return <Upload onNext={goToPreview} onBackHome={goToHome} />
    case 'preview':
      return <Preview onNext={goToDownload} onBack={goBackToUpload} onRegenerate={handleRegenerate} />
    case 'download':
      return <Download onRestart={goBackToPreview} onBackHome={goToHome} />
  }
}

export default App
