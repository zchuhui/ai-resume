import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useResumeStore } from '@/lib/store'
import { exportResume } from '@/lib/api'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/PageTransition'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { RotateCcw, CheckCircle2, ArrowLeft, FileDown, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DownloadProps {
  onRestart: () => void
  onBackHome: () => void
}

export default function Download({ onRestart, onBackHome }: DownloadProps) {
  const { optimizedResume, selectedTemplate } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<'pdf' | 'docx' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const resume = optimizedResume
  const template = selectedTemplate

  if (!resume || !template) {
    return (
      <PageTransition className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">请先选择模板</p>
          <Button onClick={onRestart} className="mt-4">
            返回选择
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (format === 'pdf') {
        // PDF: render page-by-page so each page has the template's full background
        // and content can span multiple A4 pages without being clipped.
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf'),
        ])

        const sourceEl = previewRef.current
        if (!sourceEl) throw new Error('预览内容未找到')

        // A4 dimensions in px @96dpi: 794 x 1123
        const A4_WIDTH_PX = 794
        const A4_HEIGHT_PX = 1123
        // Page margin around the content (keeps text away from the page edge)
        const PAGE_MARGIN_PX = 40

        // sourceEl -> ResumePreview wrapper -> actual template root
        const previewRoot = sourceEl.firstElementChild as HTMLElement
        const templateRoot = previewRoot?.firstElementChild as HTMLElement
        if (!templateRoot) throw new Error('模板内容未找到')

        // Content is rendered in a slightly smaller area so the template background
        // shows through the page margins.
        const contentWidth = A4_WIDTH_PX - PAGE_MARGIN_PX * 2
        const contentHeight = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2

        // Clone the actual template root (not the ResumePreview wrapper with its white bg / aspect ratio)
        const contentClone = templateRoot.cloneNode(true) as HTMLElement
        contentClone.style.width = `${contentWidth}px`
        contentClone.style.height = 'auto'
        contentClone.style.minHeight = '100%'
        contentClone.style.overflow = 'visible'
        contentClone.style.aspectRatio = 'auto'
        contentClone.querySelectorAll('*').forEach((el) => {
          const htmlEl = el as HTMLElement
          htmlEl.style.maxHeight = 'none'
          htmlEl.style.overflow = 'visible'
          htmlEl.style.aspectRatio = 'auto'
        })

        // Measure the natural full height and collect text-line boundaries for smart pagination
        const measureWrapper = document.createElement('div')
        measureWrapper.style.position = 'fixed'
        measureWrapper.style.left = '-9999px'
        measureWrapper.style.top = '0'
        measureWrapper.style.width = `${contentWidth}px`
        measureWrapper.appendChild(contentClone)
        document.body.appendChild(measureWrapper)

        const totalContentHeight = contentClone.scrollHeight
        const contentRect = contentClone.getBoundingClientRect()

        // Collect exact bounding boxes of every rendered text line so we can avoid
        // cutting through the middle of a line of text when splitting pages.
        const collectTextLineIntervals = (root: HTMLElement) => {
          const rootRect = root.getBoundingClientRect()
          const intervals: Array<{ x: number; y: number; width: number; height: number; top: number; bottom: number }> = []
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false)
          let textNode: Node | null
          while ((textNode = walker.nextNode())) {
            if (!textNode.textContent?.trim().length) continue
            const parentEl = textNode.parentElement
            if (!parentEl) continue
            const parentStyle = window.getComputedStyle(parentEl)
            if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') continue
            const range = document.createRange()
            range.selectNode(textNode)
            const rects = range.getClientRects()
            for (const rect of Array.from(rects)) {
              if (rect.width > 0 && rect.height > 0) {
                intervals.push({
                  x: rect.left - rootRect.left,
                  y: rect.top - rootRect.top,
                  width: rect.width,
                  height: rect.height,
                  top: rect.top - rootRect.top,
                  bottom: rect.bottom - rootRect.top,
                })
              }
            }
          }
          return intervals
        }

        const textElements = collectTextLineIntervals(contentClone)

        const mergeIntervals = (intervals: Array<{ top: number; bottom: number }>) => {
          intervals.sort((a, b) => a.top - b.top)
          const merged: Array<{ top: number; bottom: number }> = []
          for (const interval of intervals) {
            if (merged.length === 0 || interval.top > merged[merged.length - 1].bottom) {
              merged.push(interval)
            } else {
              merged[merged.length - 1].bottom = Math.max(merged[merged.length - 1].bottom, interval.bottom)
            }
          }
          return merged
        }

        // Determine columns. In sidebar templates we prioritize the main (wider) column
        // so its text is never cut; the sidebar can follow its own natural breaks.
        let mainIntervals: Array<{ top: number; bottom: number }> = []
        let otherIntervals: Array<{ top: number; bottom: number }> = []

        if (textElements.length > 0) {
          const minX = Math.min(...textElements.map((el) => el.x))
          const maxX = Math.max(...textElements.map((el) => el.x + el.width))
          const xRange = maxX - minX

          if (xRange > 200) {
            const midpoint = (minX + maxX) / 2
            const left: Array<{ top: number; bottom: number }> = []
            const right: Array<{ top: number; bottom: number }> = []
            for (const el of textElements) {
              const centerX = el.x + el.width / 2
              if (centerX < midpoint) left.push({ top: el.top, bottom: el.bottom })
              else right.push({ top: el.top, bottom: el.bottom })
            }
            const leftMerged = mergeIntervals(left)
            const rightMerged = mergeIntervals(right)
            if (right.length >= left.length) {
              mainIntervals = rightMerged
              otherIntervals = leftMerged
            } else {
              mainIntervals = leftMerged
              otherIntervals = rightMerged
            }
          } else {
            mainIntervals = mergeIntervals(textElements.map((el) => ({ top: el.top, bottom: el.bottom })))
          }
        }

        // Convert text intervals into safe gaps (regions where no text line exists).
        const buildGaps = (intervals: Array<{ top: number; bottom: number }>, maxY: number) => {
          const gaps: Array<{ start: number; end: number }> = []
          let lastBottom = 0
          for (const interval of intervals) {
            if (interval.top > lastBottom + 1) {
              gaps.push({ start: lastBottom, end: interval.top })
            }
            lastBottom = Math.max(lastBottom, interval.bottom)
          }
          if (lastBottom + 1 < maxY) {
            gaps.push({ start: lastBottom, end: maxY })
          }
          return gaps
        }

        const mainGaps = buildGaps(mainIntervals, totalContentHeight)
        const otherGaps = buildGaps(otherIntervals, totalContentHeight)

        const inGaps = (y: number, gaps: Array<{ start: number; end: number }>) =>
          gaps.some((gap) => y >= gap.start - 1 && y <= gap.end + 1)

        document.body.removeChild(measureWrapper)

        // Pick page break points that avoid cutting text lines. We prefer a break
        // slightly above the target height so the current page ends cleanly, rather
        // than cutting the last line of text in half.
        const findBestBreakY = (targetY: number, currentY: number) => {
          // If the target is already safe for both columns, use it as-is.
          if (inGaps(targetY, mainGaps) && inGaps(targetY, otherGaps)) return targetY

          // Find the closest safe point in the main column that is also safe for the other column.
          let bestY = targetY
          let minDistance = Infinity
          for (const gap of mainGaps) {
            const candidate = targetY < gap.start ? gap.start : targetY > gap.end ? gap.end : targetY
            if (!inGaps(candidate, otherGaps)) continue
            const distance = Math.abs(candidate - targetY)
            if (distance < minDistance) {
              minDistance = distance
              bestY = candidate
            }
          }

          // If no break is safe for both columns, fall back to the main column alone.
          if (minDistance === Infinity) {
            for (const gap of mainGaps) {
              const candidate = targetY < gap.start ? gap.start : targetY > gap.end ? gap.end : targetY
              const distance = Math.abs(candidate - targetY)
              if (distance < minDistance) {
                minDistance = distance
                bestY = candidate
              }
            }
          }

          // Prefer a break above the target so we never cut a line of text.
          // Only move up if the resulting page is not unreasonably short.
          if (bestY > targetY) {
            let upperBestY = -1
            let upperMinDistance = Infinity
            for (const gap of mainGaps) {
              if (gap.end > targetY + 1) continue
              const candidate = gap.end
              if (candidate <= currentY) continue
              if (!inGaps(candidate, otherGaps)) continue
              const distance = targetY - candidate
              if (distance < upperMinDistance) {
                upperMinDistance = distance
                upperBestY = candidate
              }
            }
            if (upperBestY >= 0) {
              bestY = upperBestY
            }
          }

          return bestY
        }

        const pageBreakYs: number[] = [0]
        let currentY = 0
        while (currentY < totalContentHeight) {
          const targetY = currentY + contentHeight
          if (targetY >= totalContentHeight) break

          let bestY = findBestBreakY(targetY, currentY)
          if (bestY <= currentY) bestY = targetY
          pageBreakYs.push(bestY)
          currentY = bestY
        }
        pageBreakYs.push(totalContentHeight)
        const totalPages = pageBreakYs.length - 1

        // Detect the background color from the actual template root, not the white preview wrapper
        let bgColor = '#ffffff'
        const computed = window.getComputedStyle(templateRoot)
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          bgColor = computed.backgroundColor
        }

        // Create the PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidthMm = pdf.internal.pageSize.getWidth()
        const pdfHeightMm = pdf.internal.pageSize.getHeight()

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
          const sliceTop = pageBreakYs[pageNum]

          // Create a page-sized offscreen container with the template background
          const pageContainer = document.createElement('div')
          pageContainer.style.position = 'fixed'
          pageContainer.style.left = '-9999px'
          pageContainer.style.top = '0'
          pageContainer.style.width = `${A4_WIDTH_PX}px`
          pageContainer.style.height = `${A4_HEIGHT_PX}px`
          pageContainer.style.background = bgColor
          pageContainer.style.overflow = 'hidden'

          // Content wrapper insets the resume from the page edge
          const contentWrapper = document.createElement('div')
          contentWrapper.style.position = 'absolute'
          contentWrapper.style.left = `${PAGE_MARGIN_PX}px`
          contentWrapper.style.top = `${PAGE_MARGIN_PX}px`
          contentWrapper.style.width = `${contentWidth}px`
          contentWrapper.style.height = `${contentHeight}px`
          contentWrapper.style.overflow = 'hidden'

          // Clone the content for this page, offset it upward to show the right slice
          const pageContent = contentClone.cloneNode(true) as HTMLElement
          pageContent.style.position = 'absolute'
          pageContent.style.left = '0'
          pageContent.style.top = `${-sliceTop}px`
          pageContent.style.width = `${contentWidth}px`

          contentWrapper.appendChild(pageContent)
          pageContainer.appendChild(contentWrapper)
          document.body.appendChild(pageContainer)

          try {
            const canvas = await html2canvas(pageContainer, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: bgColor,
              windowWidth: A4_WIDTH_PX,
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
            })

            const imgData = canvas.toDataURL('image/jpeg', 0.92)

            if (pageNum > 0) {
              pdf.addPage()
            }
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm)
          } finally {
            document.body.removeChild(pageContainer)
          }
        }

        pdf.save(`resume_${template}.pdf`)
      } else {
        // Word: call backend API
        const blob = await exportResume(resume, template, format)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `resume_${template}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
      setSuccess(format)
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition className="min-h-screen bg-slate-50">
      {loading && <LoadingOverlay message="正在生成文件..." subMessage="请稍候，正在导出你的简历" />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onRestart}
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回重新选择
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-semibold text-slate-900">
            简历已生成，准备下载
          </h1>
          <p className="mt-2 text-slate-500">
            选择导出格式，即可获得最终简历文件
          </p>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-[700px] bg-white rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          <div ref={previewRef} className="max-h-[70vh] overflow-auto">
            <ResumePreview resume={resume} style={template} />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => handleDownload('pdf')}
            loading={loading && success !== 'pdf'}
            className={cn(
              'w-full sm:w-auto min-w-[180px]',
              success === 'pdf' && 'bg-green-500 hover:bg-green-500'
            )}
          >
            {success === 'pdf' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                下载成功
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                下载 PDF
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleDownload('docx')}
            loading={loading && success !== 'docx'}
            className={cn(
              'w-full sm:w-auto min-w-[180px]',
              success === 'docx' && 'border-green-500 text-green-600 bg-green-50'
            )}
          >
            {success === 'docx' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                下载成功
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                下载 Word
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {success && (
          <p className="mt-4 text-center text-sm text-green-600">
            文件已下载到本地，祝你求职顺利！
          </p>
        )}

        <div className="mt-12 text-center">
          <Button variant="ghost" onClick={onBackHome}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重新制作一份简历
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
