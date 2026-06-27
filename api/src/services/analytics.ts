import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

export interface AnalyticsEventInput {
  name: string
  sessionId: string
  path?: string
  title?: string
  referrer?: string
  properties?: Record<string, unknown>
}

export interface AnalyticsEvent extends AnalyticsEventInput {
  id: string
  timestamp: string
  userAgent?: string
  ipHash?: string
}

const EVENT_NAME_RE = /^[a-z][a-z0-9_:.]{1,63}$/
const MAX_PROPERTY_KEYS = 20
const MAX_STRING_LENGTH = 200
const MAX_RECENT_ERRORS = 20

const dataDir = process.env.ANALYTICS_DATA_DIR || path.resolve(process.cwd(), 'data')
const eventsFile = path.join(dataDir, 'analytics-events.jsonl')

const allowedPropertyKeys = new Set([
  'template',
  'format',
  'mode',
  'source',
  'success',
  'durationMs',
  'error',
  'errorType',
  'category',
  'guide',
])

function hashIp(ip?: string) {
  if (!ip) return undefined
  const salt = process.env.ANALYTICS_IP_SALT || 'resume-craft-analytics'
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16)
}

function safeString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > MAX_STRING_LENGTH ? trimmed.slice(0, MAX_STRING_LENGTH) : trimmed
}

function sanitizeProperties(properties?: Record<string, unknown>) {
  if (!properties || typeof properties !== 'object') return {}

  const sanitized: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(properties).slice(0, MAX_PROPERTY_KEYS)) {
    if (!allowedPropertyKeys.has(key)) continue

    if (typeof value === 'string') {
      sanitized[key] = safeString(value) || ''
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      sanitized[key] = value
    } else if (typeof value === 'boolean') {
      sanitized[key] = value
    }
  }

  return sanitized
}

export function normalizeEvent(input: AnalyticsEventInput, meta: { ip?: string; userAgent?: string }): AnalyticsEvent {
  const name = safeString(input.name)
  const sessionId = safeString(input.sessionId)

  if (!name || !EVENT_NAME_RE.test(name)) {
    throw new Error('Invalid analytics event name')
  }

  if (!sessionId || sessionId.length < 12 || sessionId.length > 96) {
    throw new Error('Invalid analytics session id')
  }

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    name,
    sessionId,
    path: safeString(input.path),
    title: safeString(input.title),
    referrer: safeString(input.referrer),
    properties: sanitizeProperties(input.properties),
    userAgent: safeString(meta.userAgent),
    ipHash: hashIp(meta.ip),
  }
}

export async function recordAnalyticsEvent(event: AnalyticsEvent) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.appendFile(eventsFile, `${JSON.stringify(event)}\n`, 'utf8')
}

async function readEvents(): Promise<AnalyticsEvent[]> {
  try {
    const content = await fs.readFile(eventsFile, 'utf8')
    return content
      .split('\n')
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as AnalyticsEvent]
        } catch {
          return []
        }
      })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

function isSameLocalDate(timestamp: string, date: Date) {
  const target = new Date(timestamp)
  return target.toDateString() === date.toDateString()
}

function countBy<T extends string>(items: T[]) {
  const counts = new Map<T, number>()
  for (const item of items) counts.set(item, (counts.get(item) || 0) + 1)
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

function uniqueSessions(events: AnalyticsEvent[]) {
  return new Set(events.map((event) => event.sessionId)).size
}

function getTemplate(event: AnalyticsEvent) {
  const template = event.properties?.template
  return typeof template === 'string' ? template : undefined
}

function getEventSummary(events: AnalyticsEvent[]) {
  const pageViews = events.filter((event) => event.name === 'page_view')
  const exports = events.filter((event) => event.name === 'export_success')
  const errors = events.filter((event) => event.name.endsWith('_failed') || event.properties?.success === false)

  return {
    events: events.length,
    visitors: uniqueSessions(events),
    pageViews: pageViews.length,
    uploads: events.filter((event) => event.name === 'upload_started').length,
    parseSuccess: events.filter((event) => event.name === 'parse_success').length,
    parseFailure: events.filter((event) => event.name === 'parse_failed').length,
    optimizeSuccess: events.filter((event) => event.name === 'optimize_success').length,
    optimizeFailure: events.filter((event) => event.name === 'optimize_failed').length,
    exports: exports.length,
    errors: errors.length,
  }
}

export async function getAnalyticsSummary(rangeDays = 7) {
  const days = Math.min(Math.max(Math.floor(rangeDays) || 7, 1), 90)
  const now = new Date()
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const allEvents = await readEvents()
  const rangeEvents = allEvents.filter((event) => new Date(event.timestamp) >= since)
  const todayEvents = allEvents.filter((event) => isSameLocalDate(event.timestamp, now))
  const pageViews = rangeEvents.filter((event) => event.name === 'page_view')

  const pageStats = countBy(pageViews.map((event) => event.path || '/')).slice(0, 20)
  const templateStats = countBy(
    rangeEvents
      .map(getTemplate)
      .filter((template): template is string => Boolean(template))
  ).slice(0, 20)

  const seoPageStats = pageStats.filter(({ key }) =>
    key === '/' ||
    key === '/templates' ||
    key.startsWith('/templates/') ||
    key === '/ai-resume-optimizer' ||
    key === '/faq' ||
    key === '/guides' ||
    key.startsWith('/guides/')
  )

  return {
    rangeDays: days,
    generatedAt: now.toISOString(),
    totals: getEventSummary(rangeEvents),
    today: getEventSummary(todayEvents),
    funnel: {
      homeViews: pageViews.filter((event) => event.path === '/').length,
      templateDetailViews: pageViews.filter((event) => event.path?.startsWith('/templates/')).length,
      templateCtaClicks: rangeEvents.filter((event) => event.name === 'template_cta_clicked').length,
      uploadStarted: rangeEvents.filter((event) => event.name === 'upload_started').length,
      parseSuccess: rangeEvents.filter((event) => event.name === 'parse_success').length,
      previewViews: pageViews.filter((event) => event.path === '/preview').length,
      templateSelected: rangeEvents.filter((event) => event.name === 'template_selected').length,
      exportSuccess: rangeEvents.filter((event) => event.name === 'export_success').length,
    },
    pages: pageStats.map(({ key, count }) => ({ path: key, views: count })),
    seoPages: seoPageStats.map(({ key, count }) => ({ path: key, views: count })),
    templates: templateStats.map(({ key, count }) => ({ template: key, count })),
    recentErrors: rangeEvents
      .filter((event) => event.name.endsWith('_failed') || event.properties?.success === false)
      .slice(-MAX_RECENT_ERRORS)
      .reverse()
      .map((event) => ({
        timestamp: event.timestamp,
        name: event.name,
        path: event.path,
        error: event.properties?.error || event.properties?.errorType || 'unknown',
      })),
  }
}
