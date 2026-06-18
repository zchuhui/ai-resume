import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { templateRegistry } from '@/lib/template-config'
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

export function TemplateCard({
  style,
  label,
  selected,
  onClick,
  onExpand,
  children,
}: TemplateCardProps) {
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
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-xs text-slate-400">{templateRegistry[style].label}</span>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute bottom-10 right-3 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-md"
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}
    </motion.div>
  )
}
