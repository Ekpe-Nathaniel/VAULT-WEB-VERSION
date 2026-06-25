import { create } from 'zustand'
import type { EmbedFile, ExtractResult, ExtractStatus } from '@/types'
import { extractService } from '@/services/extractService'
import { useAuthStore } from './authStore'

interface ExtractStore {
  file: EmbedFile | null
  password: string
  status: ExtractStatus
  errorMessage: string
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
  errorMessage: '',
  result: null,

  setFile: (file) => set({ file, status: 'idle', errorMessage: '', result: null }),
  setPassword: (password) => set({ password }),

  startExtraction: async () => {
    const { file, password } = get()
    if (!file) return

    set({ status: 'processing', errorMessage: '' })

    try {
      const token = await useAuthStore.getState().ensureApiToken()
      const fileType = file.type.startsWith('audio') ? 'audio' : 'image'

      const message = await extractService.extractMessage(file, fileType, password, token)

      set({
        status: 'success',
        result: {
          message,
          format: file.type,
          integrity: 'Verified — Password Match',
          timestamp: Date.now(),
        },
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      set({ status: 'error', errorMessage: msg })
    }
  },

  reset: () => set({ file: null, password: '', status: 'idle', errorMessage: '', result: null }),
}))
