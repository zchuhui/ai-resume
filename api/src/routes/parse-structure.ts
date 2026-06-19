import { Router } from 'express'
import { parseStructure } from '../services/ai'
import { resumeSchema, parseRequestSchema, zodMessage } from '../schemas/resume'
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
    // 把 schema 校验作为自愈条件传入：校验不过会带着错误回灌给模型重试
    const resume = await parseStructure<Resume>(text, (raw) => {
      const validated = resumeSchema.safeParse(raw)
      if (!validated.success) throw new Error(`简历结构不符合要求 —— ${zodMessage(validated.error)}`)
      return validated.data as Resume
    })

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
