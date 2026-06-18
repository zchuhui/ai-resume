import { Request, Response, NextFunction } from 'express'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10)
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '10', 10)

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return next()
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: '请求次数过多，请稍后再试',
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    })
  }

  record.count++
  next()
}
