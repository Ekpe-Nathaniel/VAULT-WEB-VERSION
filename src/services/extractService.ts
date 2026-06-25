import type { EmbedFile } from '@/types'

const API_BASE = 'http://localhost:8000'

async function apiFetch(path: string, options: RequestInit): Promise<Response> {
  try {
    const res = await fetch(`${API_BASE}${path}`, options)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Request failed (HTTP ${res.status})`)
    }
    return res
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error(
        `Cannot connect to backend at ${API_BASE}. Make sure the server is running.`,
      )
    }
    throw err
  }
}

export const extractService = {
  async extractMessage(
    file: EmbedFile,
    fileType: string,
    password: string,
    token: string,
  ): Promise<string> {
    const formData = new FormData()
    const response = await fetch(file.dataUrl)
    const blob = await response.blob()
    formData.append('stego_file', blob, file.name)
    formData.append('file_type', fileType)
    formData.append('password', password)

    const res = await apiFetch('/api/stego/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await res.json()
    return data.secret_message
  },
}
