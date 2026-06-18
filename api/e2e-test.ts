import { Document, Packer, Paragraph, TextRun } from 'docx'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

async function createTestDocx(outputPath: string) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [new TextRun({ text: '张三', bold: true, size: 32 })] }),
        new Paragraph({ children: [new TextRun({ text: '高级前端工程师 | 13800138000 | zhangsan@example.com' })] }),
        new Paragraph({ children: [new TextRun({ text: '个人总结', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: '5年前端开发经验，专注于 React 生态系统和性能优化。' })] }),
        new Paragraph({ children: [new TextRun({ text: '工作经历', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'ABC科技有限公司 | 高级前端工程师 | 2021-06 至今' })] }),
        new Paragraph({ children: [new TextRun({ text: '负责公司核心 SaaS 平台前端架构设计，使用 React + TypeScript 重构旧系统，性能提升 40%。' })] }),
        new Paragraph({ children: [new TextRun({ text: '教育背景', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: '北京大学 | 计算机科学与技术 | 本科 | 2017-09 至 2021-06' })] }),
        new Paragraph({ children: [new TextRun({ text: '技能', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'React, TypeScript, Node.js, Webpack, Docker' })] }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(outputPath, buffer)
}

const baseUrl = 'http://localhost:3001/api'
const results: { name: string; status: 'PASS' | 'FAIL'; message: string }[] = []

async function request(url: string, options: { method?: string; headers?: Record<string, string>; body?: string | Buffer | FormData }): Promise<{ ok: boolean; status: number; data: any; text: string; headers: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const http = url.startsWith('https') ? require('https') : require('http')
    const u = new URL(url)
    const isFormData = options.body instanceof FormData
    const headers: Record<string, string> = { ...(options.headers || {}) }

    if (isFormData) {
      Object.assign(headers, (options.body as FormData).getHeaders())
    }

    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers,
      },
      (res: any) => {
        let text = ''
        res.on('data', (chunk: Buffer) => (text += chunk.toString('utf8')))
        res.on('end', () => {
          let data: any = null
          try { data = JSON.parse(text) } catch { data = text }
          const responseHeaders: Record<string, string> = {}
          for (const [key, value] of Object.entries(res.headers)) {
            responseHeaders[key] = Array.isArray(value) ? value.join(', ') : String(value)
          }
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode || 0, data, text, headers: responseHeaders })
        })
      }
    )

    req.on('error', reject)

    if (options.body) {
      if (isFormData) {
        (options.body as FormData).pipe(req)
      } else {
        req.write(options.body)
        req.end()
      }
    } else {
      req.end()
    }
  })
}

function assert(name: string, condition: boolean, message: string) {
  results.push({ name, status: condition ? 'PASS' : 'FAIL', message: condition ? 'OK' : message })
}

async function run() {
  const testFile = path.join(__dirname, 'test-resume.docx')
  await createTestDocx(testFile)
  console.log(`✓ 创建测试简历文件: ${testFile}`)

  // 1. Health check
  {
    const res = await request(`${baseUrl}/health`, { method: 'GET' })
    assert('Health 接口', res.ok && res.data?.status === 'ok', `status=${res.status}, body=${res.text}`)
  }

  // 2. Upload file
  let resumeText = ''
  {
    const form = new FormData()
    form.append('file', fs.createReadStream(testFile), { filename: 'test-resume.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

    const res = await request(`${baseUrl}/upload`, { method: 'POST', body: form })
    assert('上传 Word 文件', res.ok && typeof res.data?.data?.text === 'string' && res.data.data.text.length > 0, `status=${res.status}, body=${res.text.slice(0, 200)}`)
    resumeText = res.data?.data?.text || ''
    console.log('  提取文本长度:', resumeText.length)
  }

  // 3. Parse structure
  let resume: any = null
  {
    const res = await request(`${baseUrl}/parse-structure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: resumeText }),
    })
    assert('AI 结构化解析', res.ok && res.data?.data?.resume?.basicInfo?.phone === '13800138000', `status=${res.status}, body=${res.text.slice(0, 200)}`)
    resume = res.data?.data?.resume
  }

  // 4. Optimize
  let optimizedResume: any = null
  {
    const res = await request(`${baseUrl}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume,
        jobDescription: '招聘高级前端工程师，要求 5 年以上 React/TypeScript 经验，有性能优化和架构设计经验。',
        tone: 'professional',
        focus: ['achievements', 'skills'],
        otherRequirements: '突出量化成果',
      }),
    })
    assert('AI 按岗位优化', res.ok && Array.isArray(res.data?.data?.changes) && res.data?.data?.optimizedResume?.summary?.length > 0, `status=${res.status}, body=${res.text.slice(0, 200)}`)
    optimizedResume = res.data?.data?.optimizedResume
  }

  // 5. Export Word
  {
    const res = await request(`${baseUrl}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: optimizedResume, format: 'docx', template: 'tech', accent: '#2563EB' }),
    })
    const isDocx = res.text.startsWith('PK')
    assert('导出 Word', res.ok && isDocx && res.text.length > 1000, `status=${res.status}, content-type=${res.headers['content-type']}, size=${res.text.length}`)
  }

  // 6. Export PDF (HTML)
  {
    const res = await request(`${baseUrl}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: optimizedResume, format: 'pdf', template: 'tech', accent: '#2563EB' }),
    })
    const isHtml = res.text.includes('<!DOCTYPE html>') || res.text.includes('<html')
    assert('导出 PDF HTML', res.ok && isHtml && res.text.includes(optimizedResume.basicInfo.name), `status=${res.status}, size=${res.text.length}`)
  }

  // 7. Invalid file type
  {
    const form = new FormData()
    form.append('file', Buffer.from('not a pdf'), { filename: 'test.txt', contentType: 'text/plain' })
    const res = await request(`${baseUrl}/upload`, { method: 'POST', body: form })
    assert('非法文件类型被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 8. Export invalid format
  {
    const res = await request(`${baseUrl}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: optimizedResume, format: 'xlsx', template: 'tech', accent: '#2563EB' }),
    })
    assert('非法导出格式被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 清理
  fs.unlinkSync(testFile)
  console.log(`\n测试完成:`)
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  results.forEach(r => {
    console.log(`  [${r.status}] ${r.name}${r.message !== 'OK' ? ' — ' + r.message : ''}`)
  })
  console.log(`\n通过: ${passed} / 失败: ${failed}`)
  if (failed > 0) process.exit(1)
}

run().catch(err => {
  console.error('测试运行异常:', err)
  process.exit(1)
})
