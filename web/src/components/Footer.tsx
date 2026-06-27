import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-semibold">ResumeCraft</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ResumeCraft. AI 驱动的简历优化工具。
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/templates" className="hover:text-white transition-colors">简历模板</Link>
            <Link to="/ai-resume-optimizer" className="hover:text-white transition-colors">AI 优化</Link>
            <Link to="/upload" className="hover:text-white transition-colors">开始制作</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
