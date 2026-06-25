import { create } from 'zustand'
import type { EmbedFile, EmbedStatus } from '@/types'
import { embedService } from '@/services/embedService'
import { useAuthStore } from './authStore'

interface EmbedStore {
  file: EmbedFile | null
  message: string
  password: string
  status: EmbedStatus
  progress: number
  currentStage: string
  downloadUrl: string | null
  setFile: (file: EmbedFile | null) => void
  setMessage: (message: string) => void
  setPassword: (password: string) => void
  startEmbedding: () => Promise<void>
  resetWorkflow: () => void
}

export const useEmbedStore = create<EmbedStore>((set, get) => ({
  file: null,
  message: '',
  password: '',
  status: 'idle',
  progress: 0,
  currentStage: '',
  downloadUrl: null,

  setFile: (file) => set({ file, status: 'idle', downloadUrl: null, progress: 0 }),
  setMessage: (message) => set({ message }),
  setPassword: (password) => set({ password }),

  startEmbedding: async () => {
    const { file, message, password } = get()
    if (!file || !message) return

    set({ status: 'processing', progress: 10, currentStage: 'Authenticating...' })

    try {
      const token = await useAuthStore.getState().ensureApiToken()
      set({ progress: 25, currentStage: 'Sending to backend...' })

      const fileType = file.type.startsWith('audio') ? 'audio' : 'image'
      const blob = await embedService.embedPayload(file, message, fileType, password, token)

      set({ progress: 90, currentStage: 'Finalizing...' })
      const url = URL.createObjectURL(blob)

      set({
        status: 'success',
        progress: 100,
        currentStage: 'Complete',
        downloadUrl: url,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      set({ status: 'error', progress: 0, currentStage: msg })
    }
  },

  resetWorkflow: () =>
    set({
      file: null,
      message: '',
      password: '',
      status: 'idle',
      progress: 0,
      currentStage: '',
      downloadUrl: null,
    }),
}))
