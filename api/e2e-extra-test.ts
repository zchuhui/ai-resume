import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import pdf from 'pdf-parse'

// 使用 pdf-parse 的内部工具生成最小 PDF 文本会失败，改用纯文本方式构造简单 PDF
// 这里我们直接生成一个有效的最小 PDF（不含文本对象，仅用于测试解析路径）

async function createTestPdf(outputPath: string) {
  // 最小的 PDF 1.4 文件结构，实际不含文本，仅用于测试 fileFilter 和 parser 路径
  const pdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n100\n%%EOF\n`
  fs.writeFileSync(outputPath, pdf, 'utf8')
}

async function createTestDocx(outputPath: string) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [new TextRun({ text: '李四', bold: true, size: 32 })] }),
        new Paragraph({ children: [new TextRun({ text: '后端工程师 | 13900139000 | lisi@example.com' })] }),
        new Paragraph({ children: [new TextRun({ text: '工作经历', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'XYZ科技 | 后端工程师 | 2020-03 至今' })] }),
        new Paragraph({ children: [new TextRun({ text: '使用 Go 和 Python 构建高并发微服务。' })] }),
        new Paragraph({ children: [new TextRun({ text: '教育背景', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: '清华大学 | 软件工程 | 硕士 | 2018-09 至 2020-06' })] }),
        new Paragraph({ children: [new TextRun({ text: '技能', bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'Go, Python, PostgreSQL, Docker, Kubernetes' })] }),
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
  const docxFile = path.join(__dirname, 'test-resume-2.docx')
  const pdfFile = path.join(__dirname, 'test-resume-2.pdf')
  await createTestDocx(docxFile)
  await createTestPdf(pdfFile)
  console.log('✓ 创建测试文件')

  // 1. 不同文件类型：PDF
  {
    const form = new FormData()
    form.append('file', fs.createReadStream(pdfFile), { filename: 'test-resume-2.pdf', contentType: 'application/pdf' })
    const res = await request(`${baseUrl}/upload`, { method: 'POST', body: form })
    assert('上传 PDF 文件', res.status === 400 || res.status === 200, `status=${res.status}, body=${res.text.slice(0, 200)}`)
  }

  // 2. 超大文件被拒
  {
    const big = Buffer.alloc(11 * 1024 * 1024)
    const form = new FormData()
    form.append('file', big, { filename: 'big.pdf', contentType: 'application/pdf' })
    const res = await request(`${baseUrl}/upload`, { method: 'POST', body: form })
    assert('超大文件被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 3. 空文本解析
  {
    const res = await request(`${baseUrl}/parse-structure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    })
    assert('空文本解析被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 4. 优化缺少 resume
  {
    const res = await request(`${baseUrl}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription: 'test' }),
    })
    assert('优化缺少 resume 被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 5. 导出缺少 resume
  {
    const res = await request(`${baseUrl}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format: 'docx' }),
    })
    assert('导出缺少 resume 被拒', !res.ok && res.status === 400, `status=${res.status}`)
  }

  // 6. 不同模板导出
  {
    const resume = {
      basicInfo: { name: '王五', title: '产品经理', email: 'wangwu@example.com', phone: '13700137000', location: '上海', website: '', linkedin: '', github: '' },
      summary: '3 年 B 端产品经验',
      education: [{ school: '复旦大学', degree: '本科', field: '工商管理', startDate: '2015-09', endDate: '2019-06' }],
      experience: [{ company: 'QWE 科技', position: '产品经理', startDate: '2019-07', endDate: '至今', location: '上海', description: ['负责 CRM 产品设计与落地'] }],
      projects: [],
      skills: ['Axure', 'SQL', '数据分析'],
      certifications: [],
      languages: [],
    }
    for (const template of ['elegant', 'minimalist', 'tech']) {
      const res = await request(`${baseUrl}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, format: 'docx', template, accent: '#10B981' }),
      })
      assert(`模板 ${template} 导出 Word`, res.ok && res.text.startsWith('PK'), `status=${res.status}, size=${res.text.length}`)
    }
  }

  // 7. CORS 预检
  {
    const res = await request(`${baseUrl}/parse-structure`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST' },
    })
    assert('CORS 预检响应', res.status === 204 || res.status === 200, `status=${res.status}`)
  }

  // 8. 未授权路径 404
  {
    const res = await request(`${baseUrl}/not-exist`, { method: 'GET' })
    assert('不存在路径返回 404', res.status === 404, `status=${res.status}`)
  }

  fs.unlinkSync(docxFile)
  fs.unlinkSync(pdfFile)

  console.log(`\n补充测试完成:`)
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  results.forEach(r => {
    console.log(`  [${r.status}] ${r.name}${r.message !== 'OK' ? ' — ' + r.message : ''}`)
  })
  console.log(`\n通过: ${passed} / 失败: ${failed}`)
  if (failed > 0) process.exit(1)
}

run().catch(err => {
  console.error('补充测试运行异常:', err)
  process.exit(1)
})
