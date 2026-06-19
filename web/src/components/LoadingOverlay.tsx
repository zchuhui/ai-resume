import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  message?: string
  subMessage?: string
  className?: string
  /** 0-100；传入时展示确定性进度条，否则仅展示旋转动画 */
  progress?: number
}

export function LoadingOverlay({
  message = 'AI 正在处理中...',
  subMessage = '请稍候，正在优化你的简历',
  className,
  progress,
}: LoadingOverlayProps) {
  const showBar = typeof progress === 'number'
  const pct = showBar ? Math.max(0, Math.min(100, Math.round(progress!))) : 0

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg animate-pulse">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-xl -z-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">{message}</h3>
      <p className="mt-2 text-sm text-slate-500">{subMessage}</p>
      {showBar && (
        <div className="mt-5 w-64">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">{pct}%</p>
        </div>
      )}
    </div>
  )
}
