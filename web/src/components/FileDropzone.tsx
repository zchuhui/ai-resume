import { useState, useRef, useCallback } from 'react'
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  file: File | null
  onClear: () => void
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export function FileDropzone({
  onFileSelect,
  file,
  onClear,
  accept = '.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (!validTypes.includes(file.type)) {
        return '仅支持 PDF 或 Word 格式'
      }
      if (file.size > maxSize) {
        return '文件大小不能超过 10MB'
      }
      return null
    },
    [maxSize]
  )


  const handleFile = useCallback(
    (selectedFile: File) => {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      onFileSelect(selectedFile)
    },
    [onFileSelect, validateFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [disabled, handleFile]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) handleFile(selectedFile)
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)
    onClear()
    if (inputRef.current) inputRef.current.value = ''
  }

  if (file) {
    return (
      <div
        className={cn(
          'w-full rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {file.name}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            删除重新上传
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200',
        isDragging
          ? 'border-blue-500 bg-blue-50 scale-[1.01]'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200',
          isDragging ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-slate-100 text-slate-500'
        )}
      >
        <UploadCloud className="w-7 h-7" />
      </div>
      <div className="text-center">
        <p className="text-slate-900 font-medium">
          点击或拖拽上传简历
        </p>
        <p className="text-sm text-slate-500 mt-1">
          支持 PDF、Word，最大 10MB
        </p>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
