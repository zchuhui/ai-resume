import { useState, useEffect } from 'react'
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

  const handleStart = () => {
    if (onStart) {
      onStart()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.getElementById('hero-cta')?.focus()
    }
  }


  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className={`text-lg font-bold tracking-tight transition-colors ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            ResumeCraft
          </span>
        </a>
          <Button
            variant={scrolled ? 'default' : 'secondary'}
            size="sm"
            className={scrolled ? '' : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white'}
            onClick={handleStart}
          >
          <FileText className="w-4 h-4" />
          开始制作
        </Button>
      </div>
    </motion.header>
  )
}
