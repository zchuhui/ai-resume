import { motion } from 'framer-motion'
import { Upload, Sparkles, Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { defaultResume } from '@/lib/mock-resume'
import { templateList } from '@/lib/template-config'
import type { TemplateStyle } from '@/types/resume'

interface HomeProps {
  onStart: () => void
}

const steps = [
  {
    icon: Upload,
    title: '上传简历',
    description: '支持 PDF、Word 格式，智能提取简历内容',
  },
  {
    icon: Sparkles,
    title: 'AI 优化',
    description: '按目标岗位 JD 扩写、精简、改写，提升匹配度',
  },
  {
    icon: Download,
    title: '选择导出',
    description: '多种专业模板任选，一键下载 PDF 或 Word',
  },
]

const styles = templateList.map((t) => ({
  style: t.id,
  label: t.label,
  description: t.description,
})) as { style: TemplateStyle; label: string; description: string }[]

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onStart={onStart} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-white leading-[1.15] tracking-tight">
              AI 按目标岗位，<br />
              优化你的简历
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-lg leading-relaxed">
              上传简历、粘贴岗位 JD，30 秒获得多套专业设计。
              让简历内容更精准、排版更高级、面试机会更多。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                id="hero-cta"
                size="lg"
                onClick={onStart}
                className="group bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
              >
                立即开始制作
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              >
                查看模板
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-green-400" />
                </div>
                AI 智能解析
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Download className="w-3 h-3 text-blue-400" />
                </div>
                一键导出
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-violet-400" />
                </div>
                数据安全
              </div>
            </div>
          </motion.div>

          {/* Right: 3D stacked templates */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative h-[400px] sm:h-[500px] hidden lg:block"
            style={{ perspective: '1200px' }}
          >
            {([
              { style: 'minimalist', z: 60, x: -40, rotate: -12, delay: 0 },
              { style: 'tech', z: 30, x: 0, rotate: 0, delay: 0.15 },
              { style: 'elegant', z: 0, x: 40, rotate: 12, delay: 0.3 },
            ] as { style: TemplateStyle; z: number; x: number; rotate: number; delay: number }[]).map(
              (item, index) => (
                <motion.div
                  key={item.style}
                  initial={{ opacity: 0, rotateY: item.rotate - 20, translateZ: item.z - 40 }}
                  animate={{
                    opacity: 1,
                    rotateY: item.rotate,
                    translateZ: item.z,
                    translateX: item.x,
                    translateY: [0, -6, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.3 + item.delay },
                    rotateY: { duration: 0.7, delay: 0.3 + item.delay },
                    translateY: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 },
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] origin-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <ResumePreview resume={defaultResume} style={item.style} className="rounded-lg shadow-2xl" />
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900">三步完成简历升级</h2>
            <p className="mt-3 text-slate-500">简单、快速、专业</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <Card key={step.title} className="group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center text-blue-600 mb-4">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates preview */}
      <section id="templates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900">六种专业模板风格</h2>
            <p className="mt-3 text-slate-500">AI 会根据你的简历内容智能生成，任选其一</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {styles.map((item) => (
              <div key={item.style} className="group">
                <div className="aspect-[1/1.414] rounded-xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)] hover:scale-[1.02]">
                  <ResumePreview resume={defaultResume} style={item.style} />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            准备好让你的简历脱颖而出了吗？
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            现在上传简历，体验 AI 驱动的专业优化。
          </p>
          <Button size="lg" onClick={onStart} className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]">
            立即开始制作
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
