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

    const resultJson = await optimizeResume(
      JSON.stringify(resume),
      jobDescription,
      tone,
      focus,
      otherRequirements
    )

    let optimizedResume: Resume
    let changes: string[] = []

    try {
      const raw = JSON.parse(resultJson)
      // Extract changes if present
      if (raw.changes) {
        changes = raw.changes
      }
      const resumeData = raw.resume || raw
      const validated = resumeSchema.safeParse(resumeData)
      if (validated.success) {
        optimizedResume = validated.data as Resume
      } else {
        // Fallback: use original resume on validation failure
        optimizedResume = resume
        changes = ['AI 优化结果校验失败，已返回原始简历数据，请稍后重试']
      }
    } catch {
      // Fallback: return original resume
      optimizedResume = resume
      changes = ['AI 优化结果解析失败，已返回原始简历数据，请稍后重试']
    }

    res.json({
      success: true,
      data: { optimizedResume, changes },
    })
  } catch (err: any) {
    console.error('[Optimize Error]', err.message)
    // Degrade: return original resume on failure
    const fallbackResume = req.body?.resume || null
    res.status(500).json({
      success: false,
      error: err.message || '简历优化失败，请稍后重试',
      fallbackResume,
    })
  }
})

export default router
