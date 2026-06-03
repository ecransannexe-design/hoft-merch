export type PhotoType = 'bay_before' | 'display_before' | 'competitor' | 'final'

export interface ChecklistAnswers {
  missing_stock: boolean | null
  correct_pricing: boolean | null
  competitor_present: boolean | null
}

export type VisitStatus = 'in_progress' | 'pending_sync' | 'syncing' | 'synced' | 'error'

export type AssessmentState = Record<string, string | boolean | number | undefined>

export interface Store {
  id: string
  name: string   // includes banner e.g. "RONA+ Carrefour Laval"
  prov: string
  tw: number     // sales this week
  ly: number     // last year same week
}

export interface LocalVisit {
  localId: string
  status: VisitStatus
  rep: string
  storeName: string
  storeId: string
  visitDate: string           // ISO date YYYY-MM-DD
  photos: Partial<Record<PhotoType, string>> // dataURL
  answers: ChecklistAnswers
  missingProducts: string[]
  comments: string
  signature: string | null    // PNG dataURL
  assessmentState: AssessmentState
  errorMessage?: string
  supabaseId?: string         // set after successful sync
}

export interface Folder {
  key: string
  label: string
  tint: string
  badge?: number | null
  content: React.ReactNode
}

// Supabase row shapes (snake_case mirrors DB)
export interface SupabaseVisit {
  id: string
  created_at: string
  local_id: string | null
  store_name: string
  representative_name: string
  visit_date: string
  latitude: number | null
  longitude: number | null
  comments: string | null
  signature_url: string | null
  synced_at: string | null
}

export interface SupabaseAnswer {
  id: string
  visit_id: string
  question: string
  answer: string
}

export interface SupabasePhoto {
  id: string
  visit_id: string
  photo_type: PhotoType
  photo_url: string
  uploaded_at: string
}

export interface SyncResult {
  success: boolean
  visitId?: string
  error?: string
}
