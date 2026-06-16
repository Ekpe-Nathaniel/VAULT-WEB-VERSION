export type Theme = 'light' | 'dark'

export interface AuthFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface FeatureCardData {
  title: string
  description: string
  icon: string
}

export interface NavLink {
  label: string
  href: string
  icon: string
}

export type ExtractStatus = 'idle' | 'processing' | 'success' | 'error'

export interface ExtractResult {
  message: string
  format: string
  integrity: string
  timestamp: number
}

export type EmbedStatus = 'idle' | 'processing' | 'success' | 'error'

export interface EmbedFile {
  name: string
  size: number
  type: string
  dataUrl: string
}

export interface EmbedStage {
  label: string
  progress: number
}

export interface EmbedState {
  file: EmbedFile | null
  message: string
  password: string
  status: EmbedStatus
  progress: number
  currentStage: string
  stages: EmbedStage[]
  downloadUrl: string | null
}
