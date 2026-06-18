import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
})

const MODEL = process.env.AI_MODEL || 'gpt-4o-mini'
const TIMEOUT_MS = 30000

async function callLLM(systemPrompt: string, userPrompt: string, retries = 1): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
    } catch (error) {
      if (attempt === retries) {
        console.error(`LLM call failed after ${retries + 1} attempts:`, error)
        throw error
      }
      console.warn(`LLM call attempt ${attempt + 1} failed, retrying...`)
    }
  }
  throw new Error('Unreachable')
}

export async function parseStructure(text: string): Promise<string> {
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

  return callLLM(systemPrompt, `简历文本：\n${text}`)
}

export async function optimizeResume(
  resumeJson: string,
  jobDescription: string,
  tone: string,
  focus: string[],
  otherRequirements?: string
): Promise<string> {
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
1. 严格返回 JSON 格式，结构与输入 Resume 一致
2. 不要添加输入中没有的虚假信息
3. 自我评价（summary）需要重新撰写，突出与岗位的匹配度
4. 同时返回 changes 数组，列出你做的关键改动说明`

  const userPrompt = `目标岗位 JD：\n${jobDescription}\n\n输入简历：\n${resumeJson}`

  return callLLM(systemPrompt, userPrompt)
}
