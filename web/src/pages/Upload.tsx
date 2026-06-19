import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { uploadResume, parseResume, optimizeResumeStream } from '@/lib/api'
import { FileDropzone } from '@/components/FileDropzone'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageTransition } from '@/components/PageTransition'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import type { OptimizeRequest } from '@/types/resume'

interface UploadProps {
  onNext: () => void
  onBackHome: () => void
}

const toneOptions: { value: OptimizeRequest['tone']; label: string }[] = [
  { value: 'professional', label: '专业' },
  { value: 'calm', label: '沉稳' },
  { value: 'active', label: '活泼' },
  { value: 'creative', label: '创意' },
]

const focusOptions: { value: OptimizeRequest['focus'][number]; label: string }[] = [
  { value: 'achievements', label: '业绩' },
  { value: 'skills', label: '技能' },
  { value: 'projects', label: '项目' },
  { value: 'leadership', label: '领导力' },
]

export default function Upload({ onNext, onBackHome }: UploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<OptimizeRequest['tone']>('professional')
  const [focus, setFocus] = useState<OptimizeRequest['focus']>(['achievements', 'skills'])
  const [otherRequirements, setOtherRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState('AI 正在处理中...')
  const [progress, setProgress] = useState<number | undefined>(undefined)

  const { setRawText, setParsedResume, setOptimizedResume, setOptimizeRequest, setAtsReport } = useResumeStore()

  const toggleFocus = (value: OptimizeRequest['focus'][number]) => {
    setFocus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('请先上传简历文件')
      return
    }
    if (!jobDescription.trim()) {
      setError('请填写目标岗位 JD')
      return
    }
    if (focus.length === 0) {
      setError('请至少选择一项重点突出')
      return
    }

    setError(null)
    setLoading(true)
    setProgress(undefined)

    try {
      // 1. Upload & extract text
      setStage('正在解析简历文件...')
      const uploadRes = await uploadResume(file)
      const rawText = uploadRes.data?.text || ''
      setRawText(rawText)

      if (!rawText.trim()) {
        throw new Error('未能从简历中提取到文本，请检查文件内容或尝试手动输入')
      }

      // 2. Parse structure
      setStage('正在结构化解析简历...')
      const parseRes = await parseResume(rawText)
      const parsedResume = parseRes.data?.resume
      if (!parsedResume) {
        throw new Error('简历解析失败，请检查文件内容')
      }
      setParsedResume(parsedResume)

      // 3. Optimize（流式，实时进度）
      const request: OptimizeRequest = {
        jobDescription: jobDescription.trim(),
        tone,
        focus,
        otherRequirements: otherRequirements.trim() || undefined,
      }
      setOptimizeRequest(request)

      setStage('AI 正在按岗位优化简历...')
      setProgress(0)
      const result = await optimizeResumeStream(parsedResume, request, (p) => setProgress(p))
      if (!result.optimizedResume) {
        throw new Error('简历优化失败，请稍后重试')
      }
      setOptimizedResume(result.optimizedResume)
      setAtsReport(result.atsReport ?? null)

      onNext()
    } catch (err) {
      const message = err instanceof Error ? err.message : '处理过程中发生错误，请稍后重试'
      setError(message)
    } finally {
      setLoading(false)
      setProgress(undefined)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50">
      {loading && <LoadingOverlay message={stage} subMessage="先解析结构，再按岗位 JD 改写，请稍候" progress={progress} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <button
          onClick={onBackHome}
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回首页
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900">
            上传简历并填写需求
          </h1>
          <p className="mt-2 text-slate-500">
            AI 会根据你的简历和目标岗位进行优化
          </p>
        </div>

        {/* Privacy notice */}
        <Alert variant="success" className="mb-8">
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            你的简历仅在本次处理中使用，处理完成后即销毁，不会被存储或用于其他用途。
          </AlertDescription>
        </Alert>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Upload */}
          <div>
            <Label className="mb-3 block">上传简历</Label>
            <FileDropzone
              file={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              disabled={loading}
            />
            {file && (
              <p className="mt-3 text-sm text-slate-500">
                已选择文件：{file.name}
              </p>
            )}
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">目标岗位 JD</Label>
                <Textarea
                  placeholder="粘贴目标岗位 JD，AI 会按关键词优化"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  粘贴岗位职责和要求，AI 会据此匹配关键词
                </p>
              </div>

              <div>
                <Label className="mb-2 block">期望语气</Label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={tone === option.value ? 'selected' : 'default'}
                      onClick={() => setTone(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">重点突出</Label>
                <div className="flex flex-wrap gap-2">
                  {focusOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={focus.includes(option.value) ? 'selected' : 'default'}
                      onClick={() => toggleFocus(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">其他要求（可选）</Label>
                <Textarea
                  placeholder="例如：希望突出管理经验、控制在一页以内、增加英文关键词等"
                  value={otherRequirements}
                  onChange={(e) => setOtherRequirements(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!file}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'AI 处理中...' : '开始优化'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
