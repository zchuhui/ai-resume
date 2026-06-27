import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { faqItems } from '@/lib/faq'

export default function Faq() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_65%,#ffffff_100%)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <HelpCircle className="w-4 h-4" />
              常见问题
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
              ResumeCraft 常见问题
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              关于 AI 简历优化、ATS 匹配、文件格式、模板选择和数据隐私的常见问题解答。
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className="divide-y divide-slate-200">
              {faqItems.map((item) => (
                <div key={item.question} className="py-7">
                  <dt>
                    <h2 className="text-lg font-semibold text-slate-950">{item.question}</h2>
                  </dt>
                  <dd className="mt-3 text-[15px] leading-7 text-slate-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/70 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">还没找到答案？直接上手试试</h2>
            <p className="mt-3 text-slate-600">
              上传一份简历即可体验解析、模板套用和按岗位 JD 的 AI 优化。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/upload')} className="rounded-md bg-blue-600 hover:bg-blue-700">
                开始制作简历
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/templates')}
                className="rounded-md bg-white border border-slate-200"
              >
                浏览简历模板
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              想系统学习怎么写简历？查看
              <Link to="/guides" className="text-blue-600 hover:underline">
                简历指南
              </Link>
              ，或了解
              <Link to="/ai-resume-optimizer" className="text-blue-600 hover:underline">
                AI 简历优化工具
              </Link>
              。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
