import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return data.text.trim()
  } catch (err: any) {
    console.error('[PDF Parse Error]', err.message)
    throw new Error(`PDF 解析失败：${err.message || '文件损坏或格式不支持'}`)
  }
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  } catch (err: any) {
    console.error('[Docx Parse Error]', err.message)
    throw new Error(`Word 解析失败：${err.message || '文件损坏或格式不支持'}`)
  }
}

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPdf(buffer)
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractTextFromDocx(buffer)
  }
  throw new Error(`Unsupported file type: ${mimeType}`)
}
