import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { templateRegistry, strategyLabels, type TemplateStrategy } from '@/lib/template-config'
import type { TemplateStyle } from '@/types/resume'
import type { ReactNode } from 'react'

interface TemplateCardProps {
  style: TemplateStyle
  label: string
  selected: boolean
  onClick: () => void
  onExpand?: () => void
  children: ReactNode
}

const strategyBadgeClass: Record<TemplateStrategy, string> = {
  application: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  showcase: 'bg-violet-50 text-violet-600 border-violet-200',
  special: 'bg-amber-50 text-amber-600 border-amber-200',
}

export function TemplateCard({
  style,
  label,
  selected,
  onClick,
  onExpand,
  children,
}: TemplateCardProps) {
  const meta = templateRegistry[style]

  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative cursor-pointer rounded-xl overflow-hidden bg-white transition-all duration-200',
        selected
          ? 'ring-[3px] ring-blue-500 shadow-[0_12px_32px_rgba(15,23,42,0.14)]'
          : 'border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:border-blue-400 hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)]'
      )}
    >
      <div className="aspect-[1/1.414] overflow-hidden bg-white p-2">
        <div
          className={cn(
            'w-full h-full overflow-hidden rounded-md transition-transform duration-200',
            onExpand && 'hover:scale-[1.02]'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onExpand?.()
          }}
        >
          {children}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          <span
            className={cn(
              'text-[11px] px-2 py-0.5 rounded-full border',
              strategyBadgeClass[meta.strategy]
            )}
          >
            {strategyLabels[meta.strategy]}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">示例：{meta.demoRole}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {meta.bestFor.slice(0, 4).map((job) => (
            <span
              key={job}
              className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"
            >
              {job}
            </span>
          ))}
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-md"
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}
    </motion.div>
  )
}
