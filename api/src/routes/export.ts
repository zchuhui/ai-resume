import { Router } from 'express'
import { generateDocx, generateHtmlForPdf } from '../services/export'
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

    if (format === 'docx') {
      const buffer = await generateDocx(resume, template)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', `attachment; filename="resume-${template}.docx"`)
      res.send(buffer)
    } else {
      // PDF: return HTML that the frontend can convert using html2canvas + jsPDF
      // Or return the docx and let the client handle conversion
      const html = generateHtmlForPdf(resume, template)
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Content-Disposition', `inline; filename="resume-${template}.html"`)
      res.send(html)
    }
  } catch (err: any) {
    console.error('[Export Error]', err.message)
    res.status(500).json({ success: false, error: err.message || '导出失败' })
  }
})

export default router
