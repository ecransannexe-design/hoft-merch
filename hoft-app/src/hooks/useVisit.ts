import { useCallback, useEffect, useRef, useState } from 'react'
import { storage } from '../lib/storage'
import type { LocalVisit, PhotoType, ChecklistAnswers, AssessmentState } from '../types'

const CURRENT_VISIT_KEY = 'hoft_current_visit'

function newVisit(rep: string, storeId: string, storeName: string): LocalVisit {
  return {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'in_progress',
    rep,
    storeId,
    storeName,
    visitDate: new Date().toISOString().slice(0, 10),
    photos: {},
    answers: { missing_stock: null, correct_pricing: null, competitor_present: null },
    missingProducts: [],
    comments: '',
    signature: null,
    assessmentState: {},
  }
}

export function useVisit() {
  const [visit, setVisit] = useState<LocalVisit | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore any in-progress visit on mount
  useEffect(() => {
    storage.get<LocalVisit>(CURRENT_VISIT_KEY).then(saved => {
      if (saved && saved.status === 'in_progress') setVisit(saved)
    })
  }, [])

  // Debounced auto-save whenever visit changes
  useEffect(() => {
    if (!visit) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      storage.set(CURRENT_VISIT_KEY, visit)
    }, 600)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [visit])

  const startVisit = useCallback((rep: string, storeId: string, storeName: string) => {
    const v = newVisit(rep, storeId, storeName)
    setVisit(v)
    return v
  }, [])

  const setPhoto = useCallback((type: PhotoType, dataUrl: string) => {
    setVisit(v => v ? { ...v, photos: { ...v.photos, [type]: dataUrl } } : v)
  }, [])

  const setAnswer = useCallback((key: keyof ChecklistAnswers, value: boolean) => {
    setVisit(v => v ? { ...v, answers: { ...v.answers, [key]: value } } : v)
  }, [])

  const setMissingProducts = useCallback((products: string[]) => {
    setVisit(v => v ? { ...v, missingProducts: products } : v)
  }, [])

  const setComments = useCallback((comments: string) => {
    setVisit(v => v ? { ...v, comments } : v)
  }, [])

  const setSignature = useCallback((signature: string | null) => {
    setVisit(v => v ? { ...v, signature } : v)
  }, [])

  const setAssessmentValue = useCallback((key: string, value: unknown) => {
    setVisit(v => {
      if (!v) return v
      const newState: AssessmentState = { ...v.assessmentState }
      if (value === undefined || value === '' || value === false || value === null) {
        delete newState[key]
        // Also remove child keys (toggle cascade)
        Object.keys(newState).forEach(k => {
          if (k.startsWith(key + '/') || k.startsWith(key + ':') || k.startsWith(key + '#')) {
            delete newState[k]
          }
        })
      } else {
        newState[key] = value as string | boolean | number
      }
      return { ...v, assessmentState: newState }
    })
  }, [])

  const toggleAssessmentValue = useCallback((key: string) => {
    setVisit(v => {
      if (!v) return v
      const newState: AssessmentState = { ...v.assessmentState }
      if (newState[key]) {
        delete newState[key]
        // Cascade: remove all child keys
        Object.keys(newState).forEach(k => {
          if (k.startsWith(key + '/') || k.startsWith(key + ':') || k.startsWith(key + '#')) {
            delete newState[k]
          }
        })
      } else {
        newState[key] = true
      }
      return { ...v, assessmentState: newState }
    })
  }, [])

  const markStatus = useCallback((status: LocalVisit['status'], extra?: Partial<LocalVisit>) => {
    setVisit(v => v ? { ...v, status, ...extra } : v)
  }, [])

  const resetVisit = useCallback(async () => {
    await storage.remove(CURRENT_VISIT_KEY)
    setVisit(null)
  }, [])

  return {
    visit,
    startVisit,
    setPhoto,
    setAnswer,
    setMissingProducts,
    setComments,
    setSignature,
    setAssessmentValue,
    toggleAssessmentValue,
    markStatus,
    resetVisit,
  }
}
