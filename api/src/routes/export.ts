import { Router } from 'express'
import { generateDocx } from '../services/export'
import { renderResumeToPdf } from '../services/pdf-renderer'
import { exportRequestSchema } from '../schemas/resume'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const parsed = exportRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: '请求参数校验失败',
        details: parsed.error.errors,
      })
    }

    const { resume, template, format } = parsed.data

    if (format === 'pdf') {
      // PDF：Puppeteer 渲染 HTML 模板为矢量 PDF（文本可选、ATS 可解析）
      const buffer = await renderResumeToPdf(resume, template)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="resume-${template}.pdf"`)
      res.send(buffer)
    } else if (format === 'docx') {
      // Word：docx 库生成
      const buffer = await generateDocx(resume, template)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', `attachment; filename="resume-${template}.docx"`)
      res.send(buffer)
    } else {
      return res.status(400).json({
        success: false,
        error: '不支持的导出格式，仅支持 pdf 和 docx',
      })
    }
  } catch (err: any) {
    console.error('[Export Error]', err.message)
    res.status(500).json({ success: false, error: err.message || '导出失败' })
  }
})

export default router
