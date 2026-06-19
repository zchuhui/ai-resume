import { Router } from 'express'
import { optimizeResume, optimizeResumeStream, OptimizeResult, AtsReport } from '../services/ai'
import { optimizeRequestSchema, resumeSchema, zodMessage } from '../schemas/resume'
import { rateLimit } from '../middleware/rate-limit'
import { Resume } from '../types/resume'

const router = Router()

// 把 schema 校验封装成自愈条件：不合规会带错误回灌给模型重试
function buildValidator() {
  return (raw: unknown): OptimizeResult => {
    const obj = (raw ?? {}) as Record<string, unknown>
    const resumeData = (obj.resume ?? obj) as Record<string, unknown>
    const validated = resumeSchema.safeParse(resumeData)
    if (!validated.success) throw new Error(`优化后简历结构不符合要求 —— ${zodMessage(validated.error)}`)

    const ats = obj.atsReport as Partial<AtsReport> | undefined
    const atsReport: AtsReport | undefined =
      ats && typeof ats.matchScore === 'number'
        ? {
            matchScore: ats.matchScore,
            matchedKeywords: Array.isArray(ats.matchedKeywords) ? ats.matchedKeywords : [],
            missingKeywords: Array.isArray(ats.missingKeywords) ? ats.missingKeywords : [],
          }
        : undefined

    return {
      resume: validated.data as Record<string, unknown>,
      changes: Array.isArray(obj.changes) ? (obj.changes as string[]) : [],
      atsReport,
    }
  }
}

router.post('/', rateLimit, async (req, res) => {
  try {
    const parsed = optimizeRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: '请求参数校验失败',
        details: parsed.error.errors,
      })
    }

    const { resume, jobDescription, tone, focus, otherRequirements } = parsed.data

    const result = await optimizeResume(
      JSON.stringify(resume),
      jobDescription,
      tone,
      focus,
      otherRequirements,
      buildValidator()
    )

    res.json({
      success: true,
      data: {
        optimizedResume: result.resume as unknown as Resume,
        changes: result.changes,
        atsReport: result.atsReport ?? null,
      },
    })
  } catch (err: any) {
    console.error('[Optimize Error]', err.message)
    // 降级：返回原始简历
    const fallbackResume = req.body?.resume || null
    res.status(500).json({
      success: false,
      error: err.message || '简历优化失败，请稍后重试',
      fallbackResume,
    })
  }
})

// 流式优化（SSE over POST）：边生成边推送 progress 事件，结束推送 done / error
router.post('/stream', rateLimit, async (req, res) => {
  const parsed = optimizeRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: '请求参数校验失败',
      details: parsed.error.errors,
    })
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // 关闭 nginx 缓冲，保证逐条下发
  res.flushHeaders?.()

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  const { resume, jobDescription, tone, focus, otherRequirements } = parsed.data
  // 用输入简历长度粗估输出规模，把字符数换算成 0-95 的进度，留 5% 给最终校验
  const estimate = Math.max(800, JSON.stringify(resume).length * 1.5)

  try {
    send('start', { stage: 'optimizing' })
    const result = await optimizeResumeStream(
      JSON.stringify(resume),
      jobDescription,
      tone,
      focus,
      otherRequirements,
      (chars) => send('progress', { percent: Math.min(95, Math.round((chars / estimate) * 100)) }),
      buildValidator()
    )
    send('done', {
      optimizedResume: result.resume,
      changes: result.changes,
      atsReport: result.atsReport ?? null,
    })
  } catch (err: any) {
    console.error('[Optimize Stream Error]', err?.message)
    send('error', { error: err?.message || '简历优化失败，请稍后重试', fallbackResume: resume ?? null })
  } finally {
    res.end()
  }
})

export default router
