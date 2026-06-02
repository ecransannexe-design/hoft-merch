import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

/** Take a photo (camera) — returns a data URL or null if cancelled. */
export async function capturePhoto(): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
      })
      return result.dataUrl ?? null
    } catch {
      // user cancelled or permission denied
      return null
    }
  }
  return pickFileWeb({ capture: 'environment' })
}

/** Pick from photo library — returns a data URL or null. */
export async function pickFromLibrary(): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      })
      return result.dataUrl ?? null
    } catch {
      return null
    }
  }
  return pickFileWeb({})
}

/** Present native prompt (Camera or Gallery) — preferred for most tiles. */
export async function promptCapture(): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const result = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      })
      return result.dataUrl ?? null
    } catch {
      return null
    }
  }
  return pickFileWeb({ capture: 'environment' })
}

// --------------- web fallback ---------------
function pickFileWeb(opts: { capture?: string; multiple?: boolean }): Promise<string | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    if (opts.capture) input.setAttribute('capture', opts.capture)
    if (opts.multiple) input.multiple = true

    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) { resolve(null); return }
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    }
    input.oncancel = () => resolve(null)

    // Needs to be in the DOM briefly so Safari triggers correctly
    input.style.display = 'none'
    document.body.appendChild(input)
    input.click()
    setTimeout(() => document.body.removeChild(input), 30_000)
  })
}
