import axios from 'axios'
import { OptimizeRequest, Resume, TemplateStyle } from '@/types/resume'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

export async function uploadResume(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function parseResume(text: string) {
  const res = await api.post('/parse-structure', { text })
  return res.data
}

export async function optimizeResume(resume: Resume, request: OptimizeRequest) {
  const res = await api.post('/optimize', { resume, ...request })
  return res.data
}

export async function exportResume(resume: Resume, template: TemplateStyle, format: 'pdf' | 'docx') {
  const res = await api.post(
    '/export',
    { resume, template, format },
    { responseType: 'blob', timeout: format === 'pdf' ? 120000 : 60000 }
  )
  return res.data
}
