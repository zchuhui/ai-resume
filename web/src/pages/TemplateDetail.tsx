import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { getTemplateDemoResume } from '@/lib/mock-resume'
import { categoryLabels, strategyLabels, templateList, templateRegistry } from '@/lib/template-config'
import type { TemplateStyle } from '@/types/resume'

export default function TemplateDetail() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const template = slug ? templateRegistry[slug as TemplateStyle] : undefined

  if (!template) {
    return <Navigate to="/templates" replace />
  }

  const resume = getTemplateDemoResume(template.id)
  const related = templateList
    .filter((item) => item.category === template.category && item.id !== template.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_65%,#ffffff_100%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <nav aria-label="面包屑" className="flex items-center gap-1.5 text-sm text-slate-500">
              <Link to="/" className="hover:text-slate-900">
                首页
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/templates" className="hover:text-slate-900">
                简历模板
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900">{template.label}</span>
            </nav>

            <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="lg:sticky lg:top-28">
                <div className="aspect-[1/1.414] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
                  <ResumePreview resume={resume} style={template.id} />
                </div>
              </div>

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  <Sparkles className="w-4 h-4" />
                  {categoryLabels[template.category]} · {strategyLabels[template.strategy]}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
                  {template.label}简历模板
                </h1>
                <p className="mt-5 text-lg leading-8 text-slate-600">{template.description}</p>
                <p className="mt-3 text-sm leading-7 text-slate-500">{template.mood}</p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={() => navigate(`/upload?template=${template.id}`)}
                    className="rounded-md bg-blue-600 hover:bg-blue-700"
                  >
                    用这个模板生成简历
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate('/templates')}
                    className="rounded-md bg-white border border-slate-200"
                  >
                    查看全部模板
                  </Button>
                </div>

                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="text-sm font-semibold text-slate-950">适合岗位</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {template.bestFor.map((job) => (
                        <span
                          key={job}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          {job}
                        </span>
                      ))}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-semibold text-slate-950">推荐场景</dt>
                    <dd className="mt-2 text-sm leading-7 text-slate-600">
                      {template.recommended.join('、')}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-semibold text-slate-950">视觉特点</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {template.visualTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>

                  {template.avoidFor.length > 0 ? (
                    <div>
                      <dt className="text-sm font-semibold text-slate-950">不太适合</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {template.avoidFor.map((job) => (
                          <span
                            key={job}
                            className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs text-rose-600"
                          >
                            <XCircle className="w-3 h-3" />
                            {job}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-slate-200 bg-slate-50/70 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                同类「{categoryLabels[template.category]}」模板
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((item) => {
                  const demo = getTemplateDemoResume(item.id)
                  return (
                    <Link key={item.id} to={`/templates/${item.id}`} className="group block">
                      <div className="aspect-[1/1.414] rounded-lg border border-slate-200 bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_18px_48px_rgba(15,23,42,0.11)]">
                        <ResumePreview resume={demo} style={item.id} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                        {item.label}简历模板
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              如何用好「{template.label}」模板
            </h2>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="font-semibold text-slate-950">突出匹配岗位</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  适合{template.bestFor.slice(0, 3).join('、')}等方向，建议把最相关的经历放在前两屏。
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="font-semibold text-slate-950">控制信息密度</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  根据「{strategyLabels[template.strategy]}」定位取舍内容，优先保留成果、关键词和项目贡献。
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                <h3 className="font-semibold text-slate-950">按 JD 微调</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  上传简历并粘贴目标岗位 JD 后，可以先优化关键词，再默认套用这个模板导出。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
