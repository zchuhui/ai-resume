import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Resume, TemplateStyle, OptimizeRequest } from '@/types/resume'

interface ResumeState {
  rawText: string
  parsedResume: Resume | null
  optimizedResume: Resume | null
  optimizeRequest: OptimizeRequest | null
  selectedTemplate: TemplateStyle | null
  setRawText: (text: string) => void
  setParsedResume: (resume: Resume) => void
  setOptimizedResume: (resume: Resume) => void
  setOptimizeRequest: (request: OptimizeRequest) => void
  setSelectedTemplate: (template: TemplateStyle) => void
  reset: () => void
}

const initialState = {
  rawText: '',
  parsedResume: null,
  optimizedResume: null,
  optimizeRequest: null,
  selectedTemplate: null,
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...initialState,
      setRawText: (text) => set({ rawText: text }),
      setParsedResume: (resume) => set({ parsedResume: resume }),
      setOptimizedResume: (resume) => set({ optimizedResume: resume, selectedTemplate: null }),
      setOptimizeRequest: (request) => set({ optimizeRequest: request }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      reset: () => set(initialState),
    }),
    {
      name: 'ai-resume-store',
      partialize: (state) => ({
        optimizedResume: state.optimizedResume,
        optimizeRequest: state.optimizeRequest,
        selectedTemplate: state.selectedTemplate,
      }),
    }
  )
)
