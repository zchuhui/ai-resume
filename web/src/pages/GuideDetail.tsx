import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { guideMap } from '@/lib/guides'

export default function GuideDetail() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? guideMap[slug] : undefined

  if (!guide) {
    return <Navigate to="/guides" replace />
  }

  const related = guide.related.map((s) => guideMap[s]).filter(Boolean)

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="面包屑" className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              首页
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/guides" className="hover:text-slate-900">
              简历指南
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 line-clamp-1">{guide.title}</span>
          </nav>

          <h1 className="mt-8 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-slate-950">
            {guide.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{guide.intro}</p>

          <div className="mt-10 space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-[15px] leading-7 text-slate-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[15px] leading-7 text-slate-600">
                        <CheckCircle2 className="mt-1 w-4 h-4 shrink-0 text-blue-600" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-slate-950">把这些方法用到你的简历上</p>
              <p className="mt-1 text-sm text-slate-600">上传简历，按目标岗位优化并套用专业模板。</p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="mt-4 sm:mt-0 shrink-0 rounded-md bg-blue-600 hover:bg-blue-700"
            >
              开始制作
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {related.length > 0 ? (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-semibold text-slate-950">相关指南</h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/guides/${item.slug}`} className="text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </main>

      <Footer />
    </div>
  )
}
