import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, FileText, Search, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

const benefits = [
  '提取岗位 JD 中的关键技能、职责和成果要求',
  '把经历改写成更适合投递的项目和业绩表达',
  '保留真实经历，不凭空编造公司、项目或数据',
  '生成 ATS 关键词匹配报告，方便继续补充简历',
]

const scenarios = [
  {
    title: '已有简历，但投递不同岗位',
    description: '同一份经历可以针对产品、运营、数据、技术等岗位调整表达重点，减少手工重写时间。',
  },
  {
    title: '简历内容太散，缺少成果感',
    description: '把职责描述整理成动作、方法、结果的结构，让招聘方更快看到你的贡献。',
  },
  {
    title: '担心 ATS 筛选不过',
    description: '对照 JD 检查关键词覆盖情况，发现技能、工具、行业词和职责词的缺口。',
  },
]

export default function AiResumeOptimizer() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar onStart={() => navigate('/upload')} />

      <main className="pt-28">
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_65%,#ffffff_100%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <Target className="w-4 h-4" />
                AI 简历优化工具
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-tight tracking-tight text-slate-950">
                按目标岗位 JD 优化简历表达
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                上传简历并粘贴目标岗位 JD，ResumeCraft 会解析简历结构，围绕岗位关键词、项目成果和职责要求优化表达，再选择专业模板导出 PDF 或 Word。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => navigate('/upload')} className="rounded-md bg-blue-600 hover:bg-blue-700">
                  开始优化简历
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/templates')} className="rounded-md bg-white border border-slate-200">
                  查看模板
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 w-5 h-5 shrink-0 text-blue-600" />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">适合这些投递场景</h2>
              <p className="mt-3 text-slate-600">
                AI 优化不是替你虚构经历，而是把已有经历整理成更贴近招聘要求的表达。
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <article key={scenario.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <h3 className="text-lg font-semibold text-slate-950">{scenario.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">上传原始简历</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">支持 PDF / Word 文件，先解析出教育、经历、项目、技能等结构化内容。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">分析目标岗位</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">粘贴 JD 后，系统围绕岗位职责、技能关键词和成果要求进行改写。</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">导出可投递版本</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">选择模板后导出 PDF 或 Word，并查看 ATS 关键词匹配情况。</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
