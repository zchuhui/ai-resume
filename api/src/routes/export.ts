import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  res.json({ success: true, message: 'export endpoint' })
})

export default router
