import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message)

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: '请求参数校验失败',
      details: JSON.parse(err.message),
    })
  }

  const status = (err as any).status || 500
  const message = status === 500 ? '服务器内部错误' : err.message

  res.status(status).json({
    success: false,
    error: message,
  })
}
