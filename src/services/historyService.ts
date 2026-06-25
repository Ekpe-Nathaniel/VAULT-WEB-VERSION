const API_BASE = 'http://localhost:8000'

export interface HistoryItem {
  id: number
  operation: 'embed' | 'extract'
  original_filename: string
  stego_filename: string
  file_type: string
  created_at: string
}

async function apiFetch(path: string, options: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed (HTTP ${res.status})`)
  }
  return res
}

export const historyService = {
  async list(token: string): Promise<HistoryItem[]> {
    const res = await apiFetch('/api/history/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return data.records
  },

  downloadUrl(recordId: number): string {
    return `${API_BASE}/api/history/${recordId}/download`
  },
}
