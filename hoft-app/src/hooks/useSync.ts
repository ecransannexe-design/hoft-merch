import { useCallback, useEffect, useState } from 'react'
import { storage } from '../lib/storage'
import { syncVisit } from '../lib/sync'
import type { LocalVisit, SyncResult } from '../types'
import { useNetwork } from './useNetwork'

const PENDING_KEY = 'hoft_pending_visits'

export function useSync() {
  const { online } = useNetwork()
  const [syncing, setSyncing] = useState(false)
  const [pending, setPending] = useState<LocalVisit[]>([])
  const [lastError, setLastError] = useState<string | null>(null)

  // Load pending list on mount
  useEffect(() => {
    storage.get<LocalVisit[]>(PENDING_KEY).then(p => setPending(p ?? []))
  }, [])

  const savePending = async (list: LocalVisit[]) => {
    setPending(list)
    await storage.set(PENDING_KEY, list)
  }

  const enqueue = useCallback(async (visit: LocalVisit) => {
    const current = await storage.get<LocalVisit[]>(PENDING_KEY) ?? []
    if (current.some(v => v.localId === visit.localId)) return
    await savePending([...current, { ...visit, status: 'pending_sync' }])
  }, [])

  const flush = useCallback(async (): Promise<SyncResult[]> => {
    const queue = await storage.get<LocalVisit[]>(PENDING_KEY) ?? []
    if (!queue.length || syncing) return []

    setSyncing(true)
    setLastError(null)
    const results: SyncResult[] = []

    for (const visit of queue) {
      const result = await syncVisit(visit)
      results.push(result)
      if (result.success) {
        const updated = (await storage.get<LocalVisit[]>(PENDING_KEY) ?? [])
          .filter(v => v.localId !== visit.localId)
        await savePending(updated)
      } else {
        setLastError(result.error ?? 'Unknown error')
      }
    }

    setSyncing(false)
    return results
  }, [syncing])

  // Auto-flush when coming back online
  useEffect(() => {
    if (online && pending.length > 0 && !syncing) {
      flush()
    }
  }, [online]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    online,
    syncing,
    pendingCount: pending.length,
    lastError,
    enqueue,
    flush,
  }
}
