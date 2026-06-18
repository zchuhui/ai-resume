import { Sparkles } from 'lucide-react'

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
            <a href="#" className="hover:text-white transition-colors">隐私声明</a>
            <a href="#" className="hover:text-white transition-colors">使用条款</a>
            <a href="#" className="hover:text-white transition-colors">联系我们</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
