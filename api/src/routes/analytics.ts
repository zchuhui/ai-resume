import { Router } from 'express'
import { getAnalyticsSummary, normalizeEvent, recordAnalyticsEvent } from '../services/analytics'

const router = Router()

function isAdminAuthorized(auth: { username?: string; password?: string; token?: string }) {
  const configuredToken = process.env.ADMIN_TOKEN
  if (configuredToken && auth.token === configuredToken) return true

  const configuredPassword = process.env.ADMIN_PASSWORD
  const configuredUsername = process.env.ADMIN_USERNAME || 'admin'
  if (!configuredPassword && process.env.NODE_ENV !== 'production') return true

  return Boolean(
    configuredPassword &&
      auth.username === configuredUsername &&
      auth.password === configuredPassword
  )
}

router.post('/events', async (req, res, next) => {
  try {
    const event = normalizeEvent(req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent') || undefined,
    })
    await recordAnalyticsEvent(event)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

router.get('/summary', async (req, res, next) => {
  try {
    const auth = {
      username: req.get('x-admin-username') || req.query.username?.toString(),
      password: req.get('x-admin-password') || req.query.password?.toString(),
      token: req.get('x-admin-token') || req.query.token?.toString(),
    }
    if (!isAdminAuthorized(auth)) {
      res.status(401).json({ success: false, error: '未授权访问' })
      return
    }

    const rangeDays = Number(req.query.days || 7)
    const data = await getAnalyticsSummary(rangeDays)
    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
})

export default router
