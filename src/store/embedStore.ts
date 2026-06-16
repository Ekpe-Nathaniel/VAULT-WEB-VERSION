import { create } from 'zustand'
import type { EmbedFile, EmbedStatus, EmbedStage } from '@/types'
import { embedService } from '@/services/embedService'

interface EmbedStore {
  file: EmbedFile | null
  message: string
  password: string
  status: EmbedStatus
  progress: number
  currentStage: string
  stages: EmbedStage[]
  downloadUrl: string | null

  setFile: (file: EmbedFile | null) => void
  setMessage: (message: string) => void
  setPassword: (password: string) => void
  startEmbedding: () => Promise<void>
  resetWorkflow: () => void
}

const initialStages: EmbedStage[] = [
  { label: 'Encrypting Secret', progress: 0 },
  { label: 'Analyzing Cover File', progress: 25 },
  { label: 'Mapping Data Regions', progress: 50 },
  { label: 'Embedding Payload', progress: 75 },
  { label: 'Finalizing Vault', progress: 95 },
]

export const useEmbedStore = create<EmbedStore>((set, get) => ({
  file: null,
  message: '',
  password: '',
  status: 'idle',
  progress: 0,
  currentStage: '',
  stages: initialStages,
  downloadUrl: null,

  setFile: (file) => set({ file, status: 'idle', downloadUrl: null, progress: 0 }),

  setMessage: (message) => set({ message }),

  setPassword: (password) => set({ password }),

  startEmbedding: async () => {
    const { file, message, password } = get()
    if (!file || !message || !password) return

    set({ status: 'processing', progress: 0, currentStage: 'Encrypting Secret', downloadUrl: null })

    try {
      const encrypted = await embedService.encryptMessage(message, password)

      for (const stage of initialStages) {
        set({ currentStage: stage.label, progress: stage.progress })
        await new Promise((r) => setTimeout(r, 800))
      }

      const result = await embedService.embedPayload(file, encrypted)
      const protectedFile = await embedService.generateProtectedFile(result)

      set({
        status: 'success',
        progress: 100,
        currentStage: 'Complete',
        downloadUrl: protectedFile,
      })
    } catch {
      set({ status: 'error', progress: 0, currentStage: 'Failed' })
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
      stages: initialStages,
      downloadUrl: null,
    }),
}))
