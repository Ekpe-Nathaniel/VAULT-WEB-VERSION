import type { EmbedFile } from '@/types'

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const embedService = {
  async encryptMessage(message: string, password: string): Promise<string> {
    await simulateDelay(600)
    const encoder = new TextEncoder()
    const data = encoder.encode(message + ':' + password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return `${hashHex}:${btoa(message)}`
  },

  async embedPayload(file: EmbedFile, encryptedPayload: string): Promise<string> {
    await simulateDelay(900)
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.src = file.dataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
    })

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const payloadBytes = new TextEncoder().encode(encryptedPayload)
    const totalBits = payloadBytes.length * 8 + 32

    if (totalBits > data.length) {
      throw new Error('Payload too large for this image')
    }

    const sizeBits = payloadBytes.length.toString(2).padStart(32, '0')
    const allBits = sizeBits + [...payloadBytes].map((b) => b.toString(2).padStart(8, '0')).join('')

    for (let i = 0; i < allBits.length && i < data.length; i++) {
      data[i] = (data[i] & 0xfe) | parseInt(allBits[i], 10)
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL('image/png')
  },

  async generateProtectedFile(dataUrl: string): Promise<string> {
    await simulateDelay(400)
    return dataUrl
  },
}
