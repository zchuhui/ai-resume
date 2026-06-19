import OpenAI from 'openai'

const MODEL = process.env.AI_MODEL || 'gpt-4o-mini'
const TIMEOUT_MS = 30000

export interface AtsReport {
  matchScore: number // 0-100
  matchedKeywords: string[]
  missingKeywords: string[]
}

export interface OptimizeResult {
  resume: Record<string, unknown>
  changes: string[]
  atsReport?: AtsReport
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_api_key') {
    throw new Error('AI_API_KEY 或 OPENAI_API_KEY 环境变量未配置')
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  })
}

// 去掉模型偶尔包裹的 ```json ... ``` 代码块，保证 JSON.parse 可用
function stripCodeFence(content: string): string {
  const trimmed = content.trim()
  if (trimmed.startsWith('```')) {
    const end = trimmed.lastIndexOf('```')
    const inner = trimmed.slice(trimmed.indexOf('\n') + 1, end)
    return inner.trim()
  }
  return trimmed
}

// 单次网络调用，出错即抛
async function rawChat(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getOpenAIClient()
  const response = await client.chat.completions.create(
    {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    },
    { timeout: TIMEOUT_MS }
  )
  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Empty response from LLM')
  return content
}

// 统一的重试圈：网络异常与 JSON 解析失败都会触发重试。
// 重试时回灌提示，要求模型只输出纯 JSON，从源头降低坏 JSON 概率。
async function callLLMJson<T>(systemPrompt: string, userPrompt: string, retries = 2): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const hint =
        attempt > 0
          ? '\n\n【重要】上一次返回的内容不是合法 JSON，请只输出纯 JSON 对象，不要包含 ``` 代码块或任何解释文字。'
          : ''
      const content = await rawChat(systemPrompt, userPrompt + hint)
      return JSON.parse(stripCodeFence(content)) as T
    } catch (error) {
      lastError = error
      if (attempt === retries) {
        console.error(`LLM/JSON call failed after ${retries + 1} attempts:`, error)
        throw error
      }
      console.warn(`LLM/JSON attempt ${attempt + 1} failed, retrying...`, error instanceof Error ? error.message : error)
    }
  }
  throw lastError instanceof Error ? lastError : new Error('LLM 调用失败')
}

export async function parseStructure(text: string): Promise<Record<string, unknown>> {
  const systemPrompt = `你是一名专业的简历解析专家。请从用户提供的简历文本中提取关键信息，并严格按照 JSON 格式返回。

要求：
1. 字段必须完整，缺失字段用空字符串或空数组填充
2. 日期统一格式为 YYYY-MM 或 YYYY
3. 工作经历按时间倒序排列
4. 描述内容拆分为要点数组，每点不超过 2 行
5. 如果信息无法判断，不要编造，使用空值

输出 JSON 格式：
{
  "basicInfo": { "name": "", "title": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "" },
  "summary": "",
  "education": [{ "school": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
  "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "location": "", "description": [] }],
  "projects": [{ "name": "", "role": "", "startDate": "", "endDate": "", "description": [], "link": "" }],
  "skills": [],
  "certifications": [{ "name": "", "issuer": "", "date": "" }],
  "languages": [{ "language": "", "proficiency": "" }]
}`

  // 用分隔符包裹用户内容，降低 prompt 注入风险
  const userPrompt = `以下是用 <resume_text> 标签包裹的简历文本，请提取结构化信息：\n<resume_text>\n${text}\n</resume_text>`
  return callLLMJson(systemPrompt, userPrompt)
}

export async function optimizeResume(
  resumeJson: string,
  jobDescription: string,
  tone: string,
  focus: string[],
  otherRequirements?: string
): Promise<OptimizeResult> {
  const toneMap: Record<string, string> = {
    professional: '专业、正式',
    calm: '沉稳、低调',
    active: '活泼、有感染力',
    creative: '创意、独特',
  }
  const focusMap: Record<string, string> = {
    achievements: '量化业绩成果',
    skills: '技能关键词匹配',
    projects: '项目经验深度展示',
    leadership: '领导力与团队管理',
  }

  const toneText = toneMap[tone] || '专业、正式'
  const focusText = focus.map(f => focusMap[f] || f).join('、')

  const systemPrompt = `你是一名资深简历优化专家，拥有 10 年 HR 与招聘经验。请根据用户提供的简历结构、目标岗位 JD 和优化需求，对简历进行专业化改写。

优化规则：
1. 如果某模块内容过少，进行合理扩写；如果内容过多，进行精简。
2. 优先使用目标岗位 JD 中的关键词，提升 ATS 匹配度。
3. 工作经历描述尽量量化成果，使用 STAR 或 PAR 结构。
4. 语气要求：${toneText}
5. 重点突出：${focusText}
${otherRequirements ? `6. 其他要求：${otherRequirements}` : ''}

输出要求：
1. 严格返回 JSON 格式，结构如下：
{
  "resume": { /* 与输入 Resume 结构一致，为优化后的简历 */ },
  "changes": [ "本次关键改动说明1", "改动说明2" ],
  "atsReport": {
    "matchScore": 0-100 的整数,表示优化后简历与岗位 JD 的关键词匹配度,
    "matchedKeywords": [ "简历中已包含的 JD 关键词" ],
    "missingKeywords": [ "JD 中要求但简历仍缺失的关键词" ]
  }
}
2. 不要添加输入中没有的虚假信息
3. 自我评价（summary）需要重新撰写，突出与岗位的匹配度
4. atsReport.matchScore 必须是基于关键词比对得出的真实评估，不要编造`

  // 用分隔符包裹 JD 与简历，降低 prompt 注入风险
  const userPrompt = `目标岗位 JD：\n<job_description>\n${jobDescription}\n</job_description>\n\n输入简历：\n<resume_json>\n${resumeJson}\n</resume_json>`

  return callLLMJson<OptimizeResult>(systemPrompt, userPrompt)
}
