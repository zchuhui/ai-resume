import { useState } from 'react'
import { motion } from 'framer-motion'
import { useResumeStore } from '@/lib/store'
import { exportResume } from '@/lib/api'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { RotateCcw, CheckCircle2, ArrowLeft, FileDown, FileText, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

interface DownloadProps {
  onRestart: () => void
  onBackHome: () => void
}

// 用简历主人姓名（+职位）生成标准文件名，并清理文件系统非法字符
function buildFileName(resume: { basicInfo: { name?: string; title?: string } }): string {
  const clean = (s?: string) => (s || '').replace(/[\\/:*?"<>|]/g, '').trim()
  const name = clean(resume.basicInfo.name)
  const title = clean(resume.basicInfo.title)
  if (name && title) return `${name}-${title}-简历`
  if (name) return `${name}-简历`
  return '我的简历'
}

export default function Download({ onRestart, onBackHome }: DownloadProps) {
  const { optimizedResume, selectedTemplate, atsReport } = useResumeStore()
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
    const startedAt = Date.now()
    trackEvent('export_started', { format, template })

    try {
      // PDF 和 Word 都调用后端 API 生成
      const blob = await exportResume(resume, template, format)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${buildFileName(resume)}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setSuccess(format)
      trackEvent('export_success', {
        format,
        template,
        durationMs: Date.now() - startedAt,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '导出失败，请稍后重试'
      trackEvent('export_failed', {
        format,
        template,
        durationMs: Date.now() - startedAt,
        error: message,
      })
      setError(message)
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

        {/* ATS 匹配报告 */}
        {atsReport && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900">岗位匹配度报告</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#atsGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - (atsReport.matchScore || 0) / 100)}
                  />
                  <defs>
                    <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">{atsReport.matchScore ?? 0}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                优化后简历与目标岗位 JD 的关键词匹配度，分数越高越利于 ATS 筛选通过。
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">已匹配关键词</p>
                <div className="flex flex-wrap gap-1.5">
                  {(atsReport.matchedKeywords ?? []).length > 0 ? (
                    atsReport.matchedKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs">{k}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">无</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-600 mb-2">仍缺失关键词</p>
                <div className="flex flex-wrap gap-1.5">
                  {(atsReport.missingKeywords ?? []).length > 0 ? (
                    atsReport.missingKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs">{k}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">无</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

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

        {success === 'pdf' && (
          <p className="mt-4 text-center text-sm text-slate-500">
            已打开浏览器打印窗口，在"目标"中选择"另存为 PDF"即可保存矢量简历文件
          </p>
        )}
        {success === 'docx' && (
          <p className="mt-4 text-center text-sm text-green-600">
            文件已下载到本地，祝你求职顺利！
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
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
