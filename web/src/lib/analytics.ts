import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const SESSION_KEY = 'resume-craft-session-id'

export type AnalyticsProperties = Record<string, string | number | boolean | undefined>

export interface AnalyticsEventPayload {
  name: string
  sessionId: string
  path?: string
  title?: string
  referrer?: string
  properties?: AnalyticsProperties
}

export interface AnalyticsSummary {
  rangeDays: number
  generatedAt: string
  totals: AnalyticsTotals
  today: AnalyticsTotals
  funnel: {
    homeViews: number
    templateDetailViews: number
    templateCtaClicks: number
    uploadStarted: number
    parseSuccess: number
    previewViews: number
    templateSelected: number
    exportSuccess: number
  }
  pages: Array<{ path: string; views: number }>
  seoPages: Array<{ path: string; views: number }>
  templates: Array<{ template: string; count: number }>
  recentErrors: Array<{ timestamp: string; name: string; path?: string; error: string | number | boolean }>
}

export interface AnalyticsTotals {
  events: number
  visitors: number
  pageViews: number
  uploads: number
  parseSuccess: number
  parseFailure: number
  optimizeSuccess: number
  optimizeFailure: number
  exports: number
  errors: number
}

export interface AdminCredentials {
  username: string
  password: string
}

const analyticsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
})

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function getSessionId() {
  if (!isBrowser()) return 'ssg-session-placeholder'

  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const sessionId = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}

function cleanProperties(properties?: AnalyticsProperties) {
  if (!properties) return undefined

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) =>
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    )
  )
}

export function trackEvent(name: string, properties?: AnalyticsProperties) {
  if (!isBrowser()) return

  const payload: AnalyticsEventPayload = {
    name,
    sessionId: getSessionId(),
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    properties: cleanProperties(properties),
  }

  const body = JSON.stringify(payload)
  const url = `${API_BASE_URL}/analytics/events`

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
    if (sent) return
  }

  void analyticsApi.post('/analytics/events', payload).catch(() => {
    // 埋点不能影响用户主流程。
  })
}

export function trackPageView() {
  trackEvent('page_view')
}

export async function fetchAnalyticsSummary(credentials: AdminCredentials, days = 7) {
  try {
    const res = await analyticsApi.get<{ success: boolean; data: AnalyticsSummary; error?: string }>('/analytics/summary', {
      params: { days },
      headers: credentials.password
        ? {
            'x-admin-username': credentials.username,
            'x-admin-password': credentials.password,
          }
        : undefined,
    })

    if (!res.data.success) {
      throw new Error(res.data.error || '获取统计数据失败')
    }

    return res.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message || '获取统计数据失败'
      throw new Error(message)
    }
    throw error
  }
}
