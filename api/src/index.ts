import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import uploadRoutes from './routes/upload'
import parseRoutes from './routes/parse-structure'
import optimizeRoutes from './routes/optimize'
import exportRoutes from './routes/export'
import { errorHandler } from './middleware/error-handler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/upload', uploadRoutes)
app.use('/api/parse-structure', parseRoutes)
app.use('/api/optimize', optimizeRoutes)
app.use('/api/export', exportRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
