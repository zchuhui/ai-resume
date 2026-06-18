import { Router } from 'express'
import { parseStructure } from '../services/ai'
import { resumeSchema, parseRequestSchema } from '../schemas/resume'
import { rateLimit } from '../middleware/rate-limit'
import { Resume } from '../types/resume'

const router = Router()

router.post('/', rateLimit, async (req, res) => {
  try {
    const parsed = parseRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: '请求参数校验失败',
        details: parsed.error.errors,
      })
    }

    const { text } = parsed.data
    const resultJson = await parseStructure(text)

    let resume: Resume
    try {
      const raw = JSON.parse(resultJson)
      const validated = resumeSchema.safeParse(raw)
      if (validated.success) {
        resume = validated.data as Resume
      } else {
        // Attempt fallback: use raw data with defaults
        resume = resumeSchema.parse({ ...raw })
      }
    } catch {
      return res.status(500).json({
        success: false,
        error: 'AI 返回的 JSON 格式无效，请稍后重试',
      })
    }

    res.json({ success: true, data: { resume } })
  } catch (err: any) {
    console.error('[Parse Error]', err.message)
    res.status(500).json({
      success: false,
      error: err.message || '简历结构化解析失败',
    })
  }
})

export default router
