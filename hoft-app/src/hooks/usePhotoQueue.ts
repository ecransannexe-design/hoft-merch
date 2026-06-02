import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '../lib/storage'
import type { QueuedPhoto } from '../types'

const QUEUE_KEY = 'hoft_photo_queue'

/**
 * Offline-first photo upload queue.
 *
 * Photos are stored in @capacitor/preferences until a backend
 * endpoint is configured. Wire `uploadFn` to your API and call
 * `flush()` when the app comes back online.
 *
 * Example backend stub (replace with real endpoint):
 *   const upload = async (p: QueuedPhoto) => {
 *     await fetch('https://api.hoft.com/photos', {
 *       method: 'POST',
 *       body: JSON.stringify(p),
 *       headers: { 'Content-Type': 'application/json' },
 *     })
 *   }
 */
export function usePhotoQueue() {
  const [queue, setQueue] = useState<QueuedPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const uploadFnRef = useRef<((photo: QueuedPhoto) => Promise<void>) | null>(null)

  // Load queue from persistent storage on mount
  useEffect(() => {
    storage.get<QueuedPhoto[]>(QUEUE_KEY).then(q => setQueue(q ?? []))
  }, [])

  // Persist queue whenever it changes
  const persistQueue = useCallback(async (next: QueuedPhoto[]) => {
    setQueue(next)
    await storage.set(QUEUE_KEY, next)
  }, [])

  const enqueue = useCallback(async (
    photo: Omit<QueuedPhoto, 'id' | 'capturedAt'>
  ): Promise<string> => {
    const item: QueuedPhoto = {
      ...photo,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      capturedAt: new Date().toISOString(),
    }
    setQueue(prev => {
      const next = [...prev, item]
      storage.set(QUEUE_KEY, next)
      return next
    })
    return item.id
  }, [])

  /** Register the upload function to use when flush() is called. */
  const setUploadFn = useCallback((fn: (photo: QueuedPhoto) => Promise<void>) => {
    uploadFnRef.current = fn
  }, [])

  /** Attempt to upload all pending photos. Safe to call repeatedly. */
  const flush = useCallback(async () => {
    const fn = uploadFnRef.current
    if (!fn || uploading) return

    setUploading(true)
    try {
      const pending = queue.filter(p => !p.uploadedAt)
      for (const photo of pending) {
        try {
          await fn(photo)
          setQueue(prev => {
            const next = prev.map(p =>
              p.id === photo.id
                ? { ...p, uploadedAt: new Date().toISOString() }
                : p
            )
            storage.set(QUEUE_KEY, next)
            return next
          })
        } catch {
          // leave in queue for next flush
        }
      }
    } finally {
      setUploading(false)
    }
  }, [queue, uploading])

  const clearUploaded = useCallback(async () => {
    const next = queue.filter(p => !p.uploadedAt)
    await persistQueue(next)
  }, [queue, persistQueue])

  return {
    queue,
    pendingCount: queue.filter(p => !p.uploadedAt).length,
    uploadedCount: queue.filter(p => !!p.uploadedAt).length,
    uploading,
    enqueue,
    flush,
    setUploadFn,
    clearUploaded,
  }
}
