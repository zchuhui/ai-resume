import { useResumeStore } from '@/lib/store'
import { Home, Upload, Preview, Download } from '@/pages'

function App() {
  const optimizedResume = useResumeStore((state) => state.optimizedResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)

  if (!optimizedResume) {
    return <Upload />
  }

  if (!selectedTemplate) {
    return <Preview />
  }

  return <Download />
}

export default App
