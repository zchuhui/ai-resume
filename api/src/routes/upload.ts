import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  res.json({ success: true, message: 'upload endpoint' })
})

export default router
