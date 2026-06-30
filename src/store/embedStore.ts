import { create } from 'zustand'
import type { EmbedFile, EmbedStatus } from '@/types'
import { embedService } from '@/services/embedService'
import { useAuthStore } from './authStore'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

    set({ status: 'processing', progress: 5, currentStage: 'Processing media...' })
    await sleep(600)

    try {
      const token = await useAuthStore.getState().ensureApiToken()

      const fileType = file.type.startsWith('audio') ? 'audio' : 'image'
      const identifyStage =
        fileType === 'image'
          ? 'Identifying complex pixel...'
          : 'Identifying complex frequency...'

      set({ progress: 35, currentStage: identifyStage })
      await sleep(700)

      set({ progress: 65, currentStage: 'Embedding payload...' })

      const blob = await embedService.embedPayload(file, message, fileType, password, token)

      set({ progress: 100, currentStage: 'Done \u2713' })
      await sleep(500)

      const url = URL.createObjectURL(blob)

      set({
        status: 'success',
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
