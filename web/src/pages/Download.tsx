import { useState } from 'react'
import { motion } from 'framer-motion'
import { useResumeStore } from '@/lib/store'
import { exportResume } from '@/lib/api'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { RotateCcw, CheckCircle2, ArrowLeft, FileDown, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DownloadProps {
  onRestart: () => void
  onBackHome: () => void
}

export default function Download({ onRestart, onBackHome }: DownloadProps) {
  const { optimizedResume, selectedTemplate } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<'pdf' | 'docx' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const resume = optimizedResume
  const template = selectedTemplate

  if (!resume || !template) {
    return (
      <PageTransition className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">请先选择模板</p>
          <Button onClick={onRestart} className="mt-4">
            返回选择
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const blob = await exportResume(resume, template, format)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `resume_${template}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setSuccess(format)
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50">
      {loading && <LoadingOverlay message="正在生成文件..." subMessage="请稍候，正在导出你的简历" />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onRestart}
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回重新选择
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900">
            简历已生成，准备下载
          </h1>
          <p className="mt-2 text-slate-500">
            选择导出格式，即可获得最终简历文件
          </p>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-[700px] bg-white rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          <div className="max-h-[70vh] overflow-auto">
            <ResumePreview resume={resume} style={template} />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => handleDownload('pdf')}
            loading={loading && success !== 'pdf'}
            className={cn(
              'w-full sm:w-auto min-w-[180px]',
              success === 'pdf' && 'bg-green-500 hover:bg-green-500'
            )}
          >
            {success === 'pdf' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                下载成功
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                下载 PDF
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleDownload('docx')}
            loading={loading && success !== 'docx'}
            className={cn(
              'w-full sm:w-auto min-w-[180px]',
              success === 'docx' && 'border-green-500 text-green-600 bg-green-50'
            )}
          >
            {success === 'docx' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                下载成功
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                下载 Word
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {success && (
          <p className="mt-4 text-center text-sm text-green-600">
            文件已下载到本地，祝你求职顺利！
          </p>
        )}

        <div className="mt-12 text-center">
          <Button variant="ghost" onClick={onBackHome}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重新制作一份简历
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
