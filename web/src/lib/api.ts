import axios from 'axios'
import { OptimizeRequest, Resume, TemplateStyle, AtsReport } from '@/types/resume'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

// 统一响应拦截：后端返回 { success: false, error } 时抛出异常，避免前端拿到错误数据当成功处理
api.interceptors.response.use(
  (res) => {
    // blob 响应（文件下载）跳过业务层校验，由调用方自行处理
    if (res.config.responseType === 'blob') return res

    const data = res.data as { success?: boolean; error?: string; data?: unknown }
    if (data && typeof data.success === 'boolean' && !data.success) {
      return Promise.reject(new Error(data.error || '请求失败'))
    }
    return res
  },
  (error) => {
    // 网络错误或非 2xx 响应
    const message = error?.response?.data?.error || error?.message || '网络请求失败'
    return Promise.reject(new Error(message))
  }
)

export async function uploadResume(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function parseResume(text: string) {
  const res = await api.post('/parse-structure', { text })
  return res.data
}

export async function optimizeResume(resume: Resume, request: OptimizeRequest) {
  const res = await api.post('/optimize', { resume, ...request })
  return res.data
}

export interface OptimizeStreamResult {
  optimizedResume: Resume
  changes: string[]
  atsReport: AtsReport | null
}

// 流式优化：通过 SSE 边生成边回调进度（0-100），结束返回最终结果。
export async function optimizeResumeStream(
  resume: Resume,
  request: OptimizeRequest,
  onProgress?: (percent: number) => void
): Promise<OptimizeStreamResult> {
  const res = await fetch(`${API_BASE_URL}/optimize/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, ...request }),
  })

  if (!res.ok || !res.body) {
    let msg = '简历优化失败，请稍后重试'
    try {
      const j = await res.json()
      msg = j.error || msg
    } catch {
      // ignore
    }
    throw new Error(msg)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result: OptimizeStreamResult | null = null
  let streamError: string | null = null

  const handleEvent = (event: string, data: Record<string, unknown>) => {
    if (event === 'progress' && typeof data.percent === 'number') {
      onProgress?.(data.percent)
    } else if (event === 'done') {
      result = {
        optimizedResume: data.optimizedResume as Resume,
        changes: (data.changes as string[]) ?? [],
        atsReport: (data.atsReport as AtsReport) ?? null,
      }
    } else if (event === 'error') {
      streamError = (data.error as string) || '简历优化失败，请稍后重试'
    }
  }

  // SSE 事件以空行（\n\n）分隔，逐块解析
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let sep: number
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const chunk = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      let event = 'message'
      let dataStr = ''
      for (const line of chunk.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        else if (line.startsWith('data:')) dataStr += line.slice(5).trim()
      }
      if (!dataStr) continue
      try {
        handleEvent(event, JSON.parse(dataStr))
      } catch {
        // 忽略无法解析的事件
      }
    }
  }

  if (streamError) throw new Error(streamError)
  if (!result) throw new Error('优化未返回结果，请稍后重试')
  onProgress?.(100)
  return result
}

export async function exportResume(resume: Resume, template: TemplateStyle, format: 'pdf' | 'docx') {
  const res = await api.post(
    '/export',
    { resume, template, format },
    { responseType: 'blob', timeout: format === 'pdf' ? 120000 : 60000 }
  )
  return res.data
}
