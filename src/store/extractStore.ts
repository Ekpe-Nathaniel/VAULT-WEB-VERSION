import { create } from 'zustand'
import type { EmbedFile, ExtractResult, ExtractStatus } from '@/types'
import { extractService } from '@/services/extractService'

interface ExtractStore {
  file: EmbedFile | null
  password: string
  status: ExtractStatus
  result: ExtractResult | null

  setFile: (file: EmbedFile | null) => void
  setPassword: (password: string) => void
  startExtraction: () => Promise<void>
  reset: () => void
}

export const useExtractStore = create<ExtractStore>((set, get) => ({
  file: null,
  password: '',
  status: 'idle',
  result: null,

  setFile: (file) => set({ file, status: 'idle', result: null }),
  setPassword: (password) => set({ password }),

  startExtraction: async () => {
    const { file, password } = get()
    if (!file || !password) return

    set({ status: 'processing' })

    try {
      const result = await extractService.extractMessage(file, password)
      set({ status: 'success', result })
    } catch {
      set({ status: 'error' })
    }
  },

  reset: () => set({ file: null, password: '', status: 'idle', result: null }),
}))
