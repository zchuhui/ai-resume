import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Layers3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { getTemplateDemoResume } from '@/lib/mock-resume'
import { categoryLabels, templateList } from '@/lib/template-config'

export default function Templates() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <section className="border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <Layers3 className="w-4 h-4" />
                专业中文简历模板
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
                按岗位场景选择简历模板
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                ResumeCraft 提供多套可直接导出的简历模板，覆盖技术、产品、运营、设计、金融、学术等求职场景。上传简历后可以保留原内容只换排版，也可以先按 JD 优化再套用模板。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => navigate('/upload')} className="rounded-md bg-blue-600 hover:bg-blue-700">
                  用我的简历生成
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/ai-resume-optimizer')} className="rounded-md bg-white border border-slate-200">
                  了解 AI 优化
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {templateList.map((template) => {
                const resume = getTemplateDemoResume(template.id)
                return (
                  <article key={template.id} className="group">
                    <Link to={`/templates/${template.id}`} className="block" aria-label={`查看${template.label}简历模板`}>
                      <div className="aspect-[1/1.414] rounded-lg border border-slate-200 bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_48px_rgba(15,23,42,0.11)]">
                        <ResumePreview resume={resume} style={template.id} />
                      </div>
                      <div className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-semibold text-slate-950 group-hover:text-blue-700">{template.label}简历模板</h2>
                            <p className="mt-1 text-sm text-slate-500">{categoryLabels[template.category]} · 示例：{template.demoRole}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {resume.basicInfo.title}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{template.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {template.bestFor.slice(0, 4).map((job) => (
                            <span key={job} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
