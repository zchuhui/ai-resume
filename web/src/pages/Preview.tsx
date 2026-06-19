import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResumeStore } from '@/lib/store'
import { TemplateCard } from '@/components/TemplateCard'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { ArrowLeft, Check, RefreshCw, X, Sparkles, Target } from 'lucide-react'
import type { TemplateStyle } from '@/types/resume'
import { templateList } from '@/lib/template-config'
import { cn } from '@/lib/utils'

interface PreviewProps {
  onNext: () => void
  onBack: () => void
  onRegenerate: () => void
}

export default function Preview({ onNext, onBack, onRegenerate }: PreviewProps) {
  const { optimizedResume, selectedTemplate, setSelectedTemplate, atsReport } = useResumeStore()
  const [expanded, setExpanded] = useState<TemplateStyle | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  const resume = optimizedResume

  if (!resume) {
    return (
      <PageTransition className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">请先上传简历并完成优化</p>
          <Button onClick={onBack} className="mt-4">
            返回上传
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      await onRegenerate()
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50 pb-32">
      {regenerating && <LoadingOverlay message="AI 正在重新生成..." />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回修改需求
        </button>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900">
            选择你喜欢的模板风格
          </h1>
          <p className="mt-2 text-slate-500">
            AI 已生成多种风格的简历，点击卡片选中，点击预览图放大查看
          </p>
          {atsReport && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
              <Target className="w-4 h-4" />
              岗位匹配度：<span className="font-semibold">{atsReport.matchScore ?? 0}</span> / 100
              {(atsReport.missingKeywords ?? []).length > 0 && (
                <span className="text-blue-400">· 仍缺 {atsReport.missingKeywords.length} 个关键词</span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          {templateList.map((item) => (
            <TemplateCard
              key={item.id}
              style={item.id}
              label={item.label}
              selected={selectedTemplate === item.id}
              onClick={() => setSelectedTemplate(item.id)}
              onExpand={() => setExpanded(item.id)}
            >
              <ResumePreview resume={resume} style={item.id} />
            </TemplateCard>
          ))}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            {selectedTemplate ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white">
                  <Check className="w-3 h-3" />
                </span>
                已选择：{templateList.find((t) => t.id === selectedTemplate)?.label}
              </span>
            ) : (
              '请选择一套模板风格'
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleRegenerate}
              loading={regenerating}
              disabled={regenerating}
            >
              <RefreshCw className={cn('w-4 h-4', regenerating && 'animate-spin')} />
              重新生成
            </Button>
            <Button
              onClick={onNext}
              disabled={!selectedTemplate}
              className="bg-gradient-to-r from-blue-500 to-violet-500"
            >
              <Sparkles className="w-4 h-4" />
              确认模板
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExpanded(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-3xl w-full max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/50 text-white flex items-center justify-center hover:bg-slate-900/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-6">
                <ResumePreview resume={resume} style={expanded} className="rounded-lg shadow-lg" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
