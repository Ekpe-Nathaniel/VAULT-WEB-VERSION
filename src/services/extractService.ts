import type { EmbedFile, ExtractResult } from '@/types'

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const extractService = {
  async extractMessage(file: EmbedFile, password: string): Promise<ExtractResult> {
    await simulateDelay(2500)

    const demoMessages: Record<string, string> = {
      '/9j/': 'Access granted. The rendezvous point is the Grand Hotel at 19:00. Look for the person holding a crimson umbrella. Authentication code: DELTA-7.',
      'iVBOR': 'Decryption complete. Archive #734 contains the financial records spanning Q1–Q4. Encryption key fragment: XK29-MN41-PQ88. Proceed with caution.',
    }

    const prefix = file.dataUrl.slice(0, 10)
    const message = demoMessages[prefix] || demoMessages['iVBOR'] || `Decrypted payload from "${file.name}":\n\nEsteemed curator,\n\nThe documents you requested have been secured within the vault. Use the master key provided during our initial exchange to access the deep archive.\n\nCoordinates: 48°51'29.6"N 2°17'40.1"E\nTemporal window: 72 hours from receipt.\n\n— The Archivist`

    return {
      message,
      format: file.type || 'image/png',
      integrity: 'Verified — SHA-256 Match',
      timestamp: Date.now(),
    }
  },
}
