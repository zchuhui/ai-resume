import { Router } from 'express'
import multer from 'multer'
import { extractText } from '../services/parser'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const extAllowed = ['.pdf', '.doc', '.docx']
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'))

    if (allowed.includes(file.mimetype) || extAllowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持 PDF 和 Word 文件'))
    }
  },
})

const uploadMiddleware = upload.single('file')

router.post('/', (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      const message = err instanceof multer.MulterError ? err.message : err.message
      return res.status(400).json({ success: false, error: message || '文件上传失败' })
    }

    try {
      const file = req.file
      if (!file) {
        return res.status(400).json({ success: false, error: '请上传文件' })
      }

      const mimeType = file.mimetype
      const buffer = file.buffer

      let text: string
      try {
        text = await extractText(buffer, mimeType)
      } catch (parseErr: any) {
        return res.status(400).json({ success: false, error: parseErr.message || '文件解析失败' })
      }

      // Release buffer immediately after extraction
      file.buffer = Buffer.alloc(0)

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: '无法从文件中提取文本，请检查文件内容',
        })
      }

      res.json({
        success: true,
        data: {
          text,
          fileName: file.originalname,
          fileType: mimeType === 'application/pdf' ? 'pdf' : 'docx',
        },
      })
    } catch (err: any) {
      console.error('[Upload Error]', err.message)
      res.status(500).json({ success: false, error: err.message || '文件解析失败' })
    }
  })
})

export default router
