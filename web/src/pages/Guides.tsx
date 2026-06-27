import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { guides } from '@/lib/guides'

export default function Guides() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <section className="border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <BookOpen className="w-4 h-4" />
              简历指南
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
              简历写作与求职指南
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              从「简历怎么写」到「ATS 优化」「应届生简历」，这些指南帮你把经历整理成更容易拿到面试的表达。
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <article key={guide.slug}>
                  <Link to={`/guides/${guide.slug}`} className="group block rounded-xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.1)]">
                    <h2 className="text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                      {guide.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                      阅读指南
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/70 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">边看边做，效果最好</h2>
            <p className="mt-3 text-slate-600">上传一份简历，按指南里的方法直接优化并套用模板。</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/upload')} className="rounded-md bg-blue-600 hover:bg-blue-700">
                开始制作简历
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/templates')} className="rounded-md bg-white border border-slate-200">
                浏览简历模板
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
