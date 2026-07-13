import { useResumeStore } from '@/lib/store'
import { templateRegistry } from '@/lib/template-config'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { PageTransition } from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CertificationItem, EducationItem, ExperienceItem, LanguageItem, ProjectItem, Resume } from '@/types/resume'
import { ArrowLeft, FileDown, Plus, RotateCcw, Trash2 } from 'lucide-react'

interface EditProps {
  onBack: () => void
  onNext: () => void
}

type BasicInfoKey = keyof Resume['basicInfo']

const cloneResume = (resume: Resume): Resume => JSON.parse(JSON.stringify(resume))

const splitList = (value: string) =>
  value
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean)

const emptyExperience = (): ExperienceItem => ({
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  location: '',
  description: [''],
})

const emptyProject = (): ProjectItem => ({
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  link: '',
  description: [''],
})

const emptyEducation = (): EducationItem => ({
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
})

const emptyCertification = (): CertificationItem => ({
  name: '',
  issuer: '',
  date: '',
})

const emptyLanguage = (): LanguageItem => ({
  language: '',
  proficiency: '',
})

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <Label className="mb-2 block text-xs text-slate-500">{label}</Label>
      <Input value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  )
}

function BulletEditor({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  const list = items.length > 0 ? items : ['']

  return (
    <div className="space-y-2">
      <Label className="block text-xs text-slate-500">描述要点</Label>
      {list.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(event) => {
              const next = [...list]
              next[index] = event.target.value
              onChange(next)
            }}
            placeholder="例如：负责核心模块开发，提升转化率 20%"
          />
          <Button
            type="button"
            variant="danger"
            size="icon"
            aria-label="删除描述"
            onClick={() => onChange(list.filter((_, itemIndex) => itemIndex !== index))}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...list, ''])}>
        <Plus className="w-4 h-4" />
        添加要点
      </Button>
    </div>
  )
}

export default function Edit({ onBack, onNext }: EditProps) {
  const { editedResume, optimizedResume, selectedTemplate, setEditedResume, resetEditedResume } = useResumeStore()

  if (!editedResume || !selectedTemplate) {
    return null
  }

  const resume = editedResume
  const template = selectedTemplate
  const templateMeta = templateRegistry[template]

  const updateResume = (updater: (draft: Resume) => void) => {
    const draft = cloneResume(resume)
    updater(draft)
    setEditedResume(draft)
  }

  const updateBasicInfo = (key: BasicInfoKey, value: string) => {
    updateResume((draft) => {
      draft.basicInfo[key] = value
    })
  }

  const updateExperience = (index: number, patch: Partial<ExperienceItem>) => {
    updateResume((draft) => {
      draft.experience[index] = { ...draft.experience[index], ...patch }
    })
  }

  const updateProject = (index: number, patch: Partial<ProjectItem>) => {
    updateResume((draft) => {
      draft.projects[index] = { ...draft.projects[index], ...patch }
    })
  }

  const updateEducation = (index: number, patch: Partial<EducationItem>) => {
    updateResume((draft) => {
      draft.education[index] = { ...draft.education[index], ...patch }
    })
  }

  const updateCertification = (index: number, patch: Partial<CertificationItem>) => {
    updateResume((draft) => {
      const certifications = draft.certifications ?? []
      certifications[index] = { ...certifications[index], ...patch }
      draft.certifications = certifications
    })
  }

  const updateLanguage = (index: number, patch: Partial<LanguageItem>) => {
    updateResume((draft) => {
      const languages = draft.languages ?? []
      languages[index] = { ...languages[index], ...patch }
      draft.languages = languages
    })
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回选择模板
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900">编辑简历内容</h1>
          <p className="mt-2 text-slate-500">
            当前模板：{templateMeta?.label ?? template}。修改左侧信息后，右侧预览会实时更新。
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_520px] gap-8 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Field label="姓名" value={resume.basicInfo.name} onChange={(value) => updateBasicInfo('name', value)} />
                <Field label="职位" value={resume.basicInfo.title} onChange={(value) => updateBasicInfo('title', value)} />
                <Field label="邮箱" value={resume.basicInfo.email} onChange={(value) => updateBasicInfo('email', value)} />
                <Field label="电话" value={resume.basicInfo.phone} onChange={(value) => updateBasicInfo('phone', value)} />
                <Field label="城市" value={resume.basicInfo.location} onChange={(value) => updateBasicInfo('location', value)} />
                <Field label="网站" value={resume.basicInfo.website} onChange={(value) => updateBasicInfo('website', value)} />
                <Field label="LinkedIn" value={resume.basicInfo.linkedin} onChange={(value) => updateBasicInfo('linkedin', value)} />
                <Field label="GitHub" value={resume.basicInfo.github} onChange={(value) => updateBasicInfo('github', value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>个人总结</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resume.summary}
                  onChange={(event) => updateResume((draft) => {
                    draft.summary = event.target.value
                  })}
                  rows={5}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>工作经历</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateResume((draft) => {
                    draft.experience = [...draft.experience, emptyExperience()]
                  })}
                >
                  <Plus className="w-4 h-4" />
                  添加经历
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {resume.experience.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 p-4 space-y-4">
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">工作经历 {index + 1}</p>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => updateResume((draft) => {
                          draft.experience = draft.experience.filter((_, itemIndex) => itemIndex !== index)
                        })}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="公司" value={item.company} onChange={(value) => updateExperience(index, { company: value })} />
                      <Field label="职位" value={item.position} onChange={(value) => updateExperience(index, { position: value })} />
                      <Field label="开始时间" value={item.startDate} onChange={(value) => updateExperience(index, { startDate: value })} />
                      <Field label="结束时间" value={item.endDate} onChange={(value) => updateExperience(index, { endDate: value })} />
                      <Field label="地点" value={item.location} onChange={(value) => updateExperience(index, { location: value })} />
                    </div>
                    <BulletEditor items={item.description} onChange={(description) => updateExperience(index, { description })} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>项目经历</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateResume((draft) => {
                    draft.projects = [...draft.projects, emptyProject()]
                  })}
                >
                  <Plus className="w-4 h-4" />
                  添加项目
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {resume.projects.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 p-4 space-y-4">
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">项目 {index + 1}</p>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => updateResume((draft) => {
                          draft.projects = draft.projects.filter((_, itemIndex) => itemIndex !== index)
                        })}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="项目名称" value={item.name} onChange={(value) => updateProject(index, { name: value })} />
                      <Field label="角色" value={item.role} onChange={(value) => updateProject(index, { role: value })} />
                      <Field label="开始时间" value={item.startDate} onChange={(value) => updateProject(index, { startDate: value })} />
                      <Field label="结束时间" value={item.endDate} onChange={(value) => updateProject(index, { endDate: value })} />
                      <Field label="链接" value={item.link} onChange={(value) => updateProject(index, { link: value })} />
                    </div>
                    <BulletEditor items={item.description} onChange={(description) => updateProject(index, { description })} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>教育经历</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateResume((draft) => {
                    draft.education = [...draft.education, emptyEducation()]
                  })}
                >
                  <Plus className="w-4 h-4" />
                  添加教育
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                {resume.education.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 p-4 space-y-4">
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">教育经历 {index + 1}</p>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => updateResume((draft) => {
                          draft.education = draft.education.filter((_, itemIndex) => itemIndex !== index)
                        })}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="学校" value={item.school} onChange={(value) => updateEducation(index, { school: value })} />
                      <Field label="学历" value={item.degree} onChange={(value) => updateEducation(index, { degree: value })} />
                      <Field label="专业" value={item.field} onChange={(value) => updateEducation(index, { field: value })} />
                      <Field label="开始时间" value={item.startDate} onChange={(value) => updateEducation(index, { startDate: value })} />
                      <Field label="结束时间" value={item.endDate} onChange={(value) => updateEducation(index, { endDate: value })} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>技能</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resume.skills.join('\n')}
                  onChange={(event) => updateResume((draft) => {
                    draft.skills = splitList(event.target.value)
                  })}
                  rows={6}
                  placeholder="每行一个技能，也可以用逗号分隔"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>证书</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateResume((draft) => {
                    draft.certifications = [...(draft.certifications ?? []), emptyCertification()]
                  })}
                >
                  <Plus className="w-4 h-4" />
                  添加证书
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(resume.certifications ?? []).map((item, index) => (
                  <div key={index} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                    <Field label="证书名称" value={item.name} onChange={(value) => updateCertification(index, { name: value })} />
                    <Field label="颁发机构" value={item.issuer} onChange={(value) => updateCertification(index, { issuer: value })} />
                    <Field label="日期" value={item.date} onChange={(value) => updateCertification(index, { date: value })} />
                    <Button
                      type="button"
                      variant="danger"
                      size="icon"
                      aria-label="删除证书"
                      onClick={() => updateResume((draft) => {
                        draft.certifications = (draft.certifications ?? []).filter((_, itemIndex) => itemIndex !== index)
                      })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>语言</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => updateResume((draft) => {
                    draft.languages = [...(draft.languages ?? []), emptyLanguage()]
                  })}
                >
                  <Plus className="w-4 h-4" />
                  添加语言
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(resume.languages ?? []).map((item, index) => (
                  <div key={index} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <Field label="语言" value={item.language} onChange={(value) => updateLanguage(index, { language: value })} />
                    <Field label="熟练度" value={item.proficiency} onChange={(value) => updateLanguage(index, { proficiency: value })} />
                    <Button
                      type="button"
                      variant="danger"
                      size="icon"
                      aria-label="删除语言"
                      onClick={() => updateResume((draft) => {
                        draft.languages = (draft.languages ?? []).filter((_, itemIndex) => itemIndex !== index)
                      })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="rounded-xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden">
              <div className="max-h-[78vh] overflow-auto">
                <ResumePreview resume={resume} style={template} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">编辑完成后，PDF 和 Word 都会使用当前内容生成。</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              返回选模板
            </Button>
            <Button variant="secondary" onClick={resetEditedResume} disabled={!optimizedResume}>
              <RotateCcw className="w-4 h-4" />
              恢复 AI 版本
            </Button>
            <Button onClick={onNext}>
              <FileDown className="w-4 h-4" />
              继续导出
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
