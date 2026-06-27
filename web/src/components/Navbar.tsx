import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  onStart?: () => void
}

export function Navbar({ onStart }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleStart = () => onStart?.()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'}`

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ResumeCraft
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <nav className="hidden md:flex items-center gap-5">
            <NavLink to="/templates" className={linkClass}>简历模板</NavLink>
            <NavLink to="/ai-resume-optimizer" className={linkClass}>AI 优化</NavLink>
            <NavLink to="/guides" className={linkClass}>简历指南</NavLink>
          </nav>
          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleStart}
          >
            <FileText className="w-4 h-4" />
            开始制作
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
