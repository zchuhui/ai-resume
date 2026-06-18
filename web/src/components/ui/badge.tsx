import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-500 border border-slate-200 hover:border-slate-300",
        selected:
          "bg-gradient-to-r from-blue-500 to-violet-500 text-white border-transparent shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }

