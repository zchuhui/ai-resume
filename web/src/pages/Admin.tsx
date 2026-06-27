import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, BarChart3, Download, Eye, FileCheck2, FileUp, KeyRound, MousePointerClick, RefreshCw, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchAnalyticsSummary, type AdminCredentials, type AnalyticsSummary } from '@/lib/analytics'
import { templateRegistry } from '@/lib/template-config'

const ADMIN_USERNAME_KEY = 'resume-craft-admin-username'

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Activity }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  )
}

function ProgressRow({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
        <span className="truncate text-slate-700">{label}</span>
        <span className="shrink-0 text-slate-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function formatRate(value: number, base: number) {
  if (!base) return '0%'
  return `${Math.round((value / base) * 100)}%`
}

export default function Admin() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [days, setDays] = useState(7)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxPageViews = useMemo(() => Math.max(...(summary?.pages.map((item) => item.views) || [0]), 1), [summary])
  const maxTemplateClicks = useMemo(() => Math.max(...(summary?.templates.map((item) => item.count) || [0]), 1), [summary])

  const loadSummary = async (credentialsOverride?: AdminCredentials) => {
    const credentials = credentialsOverride ?? { username, password }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAnalyticsSummary(credentials, days)
      setSummary(data)
      if (credentials.username) localStorage.setItem(ADMIN_USERNAME_KEY, credentials.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : '统计数据加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedUsername = localStorage.getItem(ADMIN_USERNAME_KEY)
    if (savedUsername) setUsername(savedUsername)
  }, [])

  useEffect(() => {
    if (!summary) return
    void loadSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <BarChart3 className="h-4 w-4" />
              ResumeCraft Analytics
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">运营后台</h1>
            <p className="mt-2 text-sm text-slate-500">
              查看访问、模板转化、上传解析、导出和错误事件。后台不展示简历正文、JD、文件名或用户身份信息。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[150px_180px_120px_auto]">
            <div>
              <Label className="mb-1.5 block text-xs text-slate-500">管理员账号</Label>
              <Input
                value={username}
                placeholder="admin"
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-slate-500">管理员密码</Label>
              <Input
                type="password"
                value={password}
                placeholder="生产环境必填"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-slate-500">统计周期</Label>
              <select
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
              >
                <option value={1}>今日</option>
                <option value={7}>7 日</option>
                <option value={30}>30 日</option>
                <option value={90}>90 日</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => loadSummary()} disabled={loading} className="w-full rounded-md bg-blue-600 hover:bg-blue-700">
                <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                刷新
              </Button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <KeyRound className="h-4 w-4" />
            {error}
          </div>
        )}

        {summary && (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="今日访问用户" value={summary.today.visitors} icon={Users} />
              <StatCard label={`${summary.rangeDays} 日页面浏览`} value={summary.totals.pageViews} icon={Eye} />
              <StatCard label="上传开始" value={summary.totals.uploads} icon={FileUp} />
              <StatCard label="导出成功" value={summary.totals.exports} icon={Download} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">核心漏斗</h2>
                  <span className="text-xs text-slate-400">更新时间 {new Date(summary.generatedAt).toLocaleString()}</span>
                </div>
                <div className="space-y-4">
                  {[
                    ['首页访问', summary.funnel.homeViews],
                    ['模板详情访问', summary.funnel.templateDetailViews],
                    ['模板 CTA 点击', summary.funnel.templateCtaClicks],
                    ['上传开始', summary.funnel.uploadStarted],
                    ['解析成功', summary.funnel.parseSuccess],
                    ['预览页访问', summary.funnel.previewViews],
                    ['模板选择', summary.funnel.templateSelected],
                    ['导出成功', summary.funnel.exportSuccess],
                  ].map(([label, value]) => (
                    <ProgressRow key={label} label={label.toString()} value={Number(value)} max={Math.max(summary.funnel.homeViews, 1)} />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <h2 className="text-lg font-semibold">转化质量</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <StatCard label="解析成功率" value={formatRate(summary.totals.parseSuccess, summary.totals.parseSuccess + summary.totals.parseFailure)} icon={FileCheck2} />
                  <StatCard label="优化成功率" value={formatRate(summary.totals.optimizeSuccess, summary.totals.optimizeSuccess + summary.totals.optimizeFailure)} icon={Activity} />
                  <StatCard label="错误事件" value={summary.totals.errors} icon={AlertTriangle} />
                  <StatCard label="总事件数" value={summary.totals.events} icon={MousePointerClick} />
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <h2 className="text-lg font-semibold">页面访问排行</h2>
                <div className="mt-5 space-y-4">
                  {summary.pages.length > 0 ? summary.pages.map((item) => (
                    <ProgressRow key={item.path} label={item.path} value={item.views} max={maxPageViews} />
                  )) : <p className="text-sm text-slate-500">暂无访问数据</p>}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <h2 className="text-lg font-semibold">SEO 页面排行</h2>
                <div className="mt-5 space-y-4">
                  {summary.seoPages.length > 0 ? summary.seoPages.map((item) => (
                    <ProgressRow key={item.path} label={item.path} value={item.views} max={maxPageViews} />
                  )) : <p className="text-sm text-slate-500">暂无 SEO 页面访问</p>}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <h2 className="text-lg font-semibold">模板热度</h2>
                <div className="mt-5 space-y-4">
                  {summary.templates.length > 0 ? summary.templates.map((item) => (
                    <ProgressRow
                      key={item.template}
                      label={templateRegistry[item.template as keyof typeof templateRegistry]?.label || item.template}
                      value={item.count}
                      max={maxTemplateClicks}
                    />
                  )) : <p className="text-sm text-slate-500">暂无模板事件</p>}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <h2 className="text-lg font-semibold">最近错误事件</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 font-medium">时间</th>
                      <th className="py-3 pr-4 font-medium">事件</th>
                      <th className="py-3 pr-4 font-medium">页面</th>
                      <th className="py-3 pr-4 font-medium">错误</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.recentErrors.length > 0 ? summary.recentErrors.map((item) => (
                      <tr key={`${item.timestamp}-${item.name}`}>
                        <td className="py-3 pr-4 text-slate-500">{new Date(item.timestamp).toLocaleString()}</td>
                        <td className="py-3 pr-4 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 pr-4 text-slate-500">{item.path || '-'}</td>
                        <td className="py-3 pr-4 text-red-600">{String(item.error)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="py-6 text-slate-500" colSpan={4}>暂无错误事件</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
