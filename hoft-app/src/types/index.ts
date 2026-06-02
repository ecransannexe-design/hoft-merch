export type Banner = 'HD' | 'RONA' | 'RONA+'

export interface Store {
  id: string
  banner: Banner
  name: string
  prov: string
  ytd: number
  lastYear: number
  lastVisit: string
}

export interface ChecklistItem {
  id: string
  q: string
}

export interface Folder {
  key: string
  label: string
  badge?: number | null
  content: React.ReactNode
}

export interface VisitSummary {
  captures: number
  answered: number
  missing: number
  pics: number
}

export interface QueuedPhoto {
  id: string
  visitId: string
  storeId: string
  rep: string
  type: 'arrival' | 'after'
  dataUrl: string
  capturedAt: string
  uploadedAt?: string
}
