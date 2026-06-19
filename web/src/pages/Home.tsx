import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Download, FileText, Layers3, Sparkles, Target, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { getTemplateDemoResume } from '@/lib/mock-resume'
import { templateList } from '@/lib/template-config'
import type { TemplateStyle } from '@/types/resume'

interface HomeProps {
  onStart: () => void
}

const steps = [
  {
    icon: Upload,
    title: '上传简历',
    description: '解析 PDF / Word 内容，保留原始经历与关键信息。',
  },
  {
    icon: Target,
    title: '匹配岗位',
    description: '粘贴 JD 后，围绕关键词、成果和项目重写表达。',
  },
  {
    icon: Download,
    title: '导出投递',
    description: '选择合适模板，下载 PDF 或 Word 版本。',
  },
]

const heroTemplates: Array<{ style: TemplateStyle; offset: string; rotate: string; width: string }> = [
  { style: 'cobalt', offset: 'left-[4%] top-[22%]', rotate: '-rotate-3', width: 'w-[34%]' },
  { style: 'corporate', offset: 'left-[32%] top-[8%]', rotate: 'rotate-0', width: 'w-[42%]' },
  { style: 'compact', offset: 'right-[2%] top-[24%]', rotate: 'rotate-3', width: 'w-[34%]' },
]

const styles = templateList.map((t) => ({
  style: t.id,
  label: t.label,
  description: t.description,
  recommended: t.recommended.slice(0, 3).join(' / '),
})) as { style: TemplateStyle; label: string; description: string; recommended: string }[]

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={onStart} />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#ffffff_100%)] pt-28">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 72%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.86fr_1.14fr] gap-12 items-center lg:min-h-[620px] pb-14 lg:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.05] tracking-tight text-slate-950">
                AI 按目标岗位，
                <span className="block text-blue-600">优化你的简历</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                上传简历、粘贴岗位 JD，系统会重组经历表达、补齐关键词，并生成适合不同岗位场景的专业模板。
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  id="hero-cta"
                  size="lg"
                  onClick={onStart}
                  className="h-12 px-6 rounded-md bg-blue-600 hover:bg-blue-700 shadow-[0_18px_36px_rgba(37,99,235,0.22)]"
                >
                  开始制作
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 px-6 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  浏览模板
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                {['支持 PDF / Word', '按 JD 优化关键词', '多岗位模板预览'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="relative hidden lg:block h-[560px]"
            >
              <div className="absolute inset-x-10 bottom-10 h-10 rounded-full bg-blue-950/10 blur-2xl" />
              <div className="absolute inset-0 rounded-[28px] border border-slate-200/70 bg-white/55 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm" />
              {heroTemplates.map((item, index) => (
                <motion.div
                  key={item.style}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 + index * 0.12 }}
                  className={`absolute ${item.offset} ${item.width} ${item.rotate}`}
                >
                  <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-[0_22px_56px_rgba(15,23,42,0.16)]">
                    <ResumePreview resume={getTemplateDemoResume(item.style)} style={item.style} className="rounded-md shadow-none" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="w-11 h-11 shrink-0 rounded-md border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">0{index + 1}</div>
                <h2 className="text-lg font-semibold text-slate-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
                {styles.length} 种岗位化简历模板
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                每套模板都用对应职业场景演示，从国企综合岗到数据分析、品牌内容、UI/UX，不再只展示同一个前端工程师样例。
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-fit rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={onStart}
            >
              <Layers3 className="w-4 h-4" />
              用我的简历生成
            </Button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {styles.map((item) => {
              const resume = getTemplateDemoResume(item.style)
              return (
                <div key={item.style} className="group">
                  <div className="aspect-[1/1.414] rounded-lg border border-slate-200 bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_48px_rgba(15,23,42,0.11)]">
                    <ResumePreview resume={resume} style={item.style} />
                  </div>
                  <div className="pt-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">{item.label}</h3>
                      <span className="text-sm font-medium text-blue-600">{resume.basicInfo.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.recommended}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 w-12 h-12 rounded-md bg-blue-600 text-white flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
            用真实岗位目标，生成更像投递成品的简历
          </h2>
          <p className="mt-4 text-slate-600">
            你的经历不会被模板限制，AI 会围绕岗位要求调整表达，再匹配最合适的视觉风格。
          </p>
          <Button size="lg" onClick={onStart} className="mt-8 rounded-md bg-blue-600 hover:bg-blue-700">
            立即开始制作
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
