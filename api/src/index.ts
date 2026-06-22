import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import uploadRoutes from './routes/upload'
import parseRoutes from './routes/parse-structure'
import optimizeRoutes from './routes/optimize'
import exportRoutes from './routes/export'
import { errorHandler } from './middleware/error-handler'

const app = express()
const PORT = process.env.PORT || 3001

// CORS 白名单：生产环境必须通过 ALLOWED_ORIGINS 显式配置，开发环境默认允许 localhost
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || []
const corsOrigin = process.env.NODE_ENV === 'production'
  ? allowedOrigins
  : [...allowedOrigins, 'http://localhost:5173', 'http://localhost:4173']

app.use(cors({
  origin: corsOrigin.length > 0 ? corsOrigin : false,
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
