import { Router } from 'express'
import { optimizeResume } from '../services/ai'
import { optimizeRequestSchema, resumeSchema } from '../schemas/resume'
import { rateLimit } from '../middleware/rate-limit'
import { Resume } from '../types/resume'

const router = Router()

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
      otherRequirements
    )

    let optimizedResume: Resume
    const changes = Array.isArray(result.changes) ? result.changes : []
    const atsReport = result.atsReport

    const resumeData = (result.resume || {}) as Record<string, unknown>
    const validated = resumeSchema.safeParse(resumeData)
    if (validated.success) {
      optimizedResume = validated.data as Resume
    } else {
      // 自愈失败：返回原始简历，但把校验错误反馈给调用方
      optimizedResume = resume
      return res.json({
        success: true,
        data: {
          optimizedResume,
          changes: ['AI 优化结果校验失败，已返回原始简历数据，请稍后重试'],
          atsReport,
        },
      })
    }

    res.json({
      success: true,
      data: { optimizedResume, changes, atsReport },
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

export default router
