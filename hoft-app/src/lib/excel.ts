import * as XLSX from 'xlsx'
import type { SupabaseVisit, SupabaseAnswer, SupabasePhoto } from '../types'

export function exportToExcel(
  visits: SupabaseVisit[],
  answers: SupabaseAnswer[],
  photos: SupabasePhoto[],
) {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Visits ──────────────────────────────────────
  const getAnswer = (visitId: string, question: string) =>
    answers.find(a => a.visit_id === visitId && a.question === question)?.answer ?? ''

  const visitsSheet = visits.map(v => ({
    Date:               v.visit_date,
    Representative:     v.representative_name,
    Store:              v.store_name,
    'Missing Stock':    getAnswer(v.id, 'missing_stock'),
    'Correct Pricing':  getAnswer(v.id, 'correct_pricing'),
    'Competitor':       getAnswer(v.id, 'competitor_present'),
    Comments:           v.comments ?? '',
    'Signature':        v.signature_url ? 'Yes' : 'No',
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(visitsSheet), 'Visits')

  // ── Sheet 2: Photos ──────────────────────────────────────
  const photosSheet = photos.map(p => ({
    'Visit ID':   p.visit_id,
    'Photo Type': p.photo_type,
    'Photo URL':  p.photo_url,
    'Uploaded':   p.uploaded_at,
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(photosSheet), 'Photos')

  // ── Sheet 3: Missing Products ────────────────────────────
  const missingSheet = answers
    .filter(a => a.question === 'missing_product')
    .map(a => ({
      'Visit ID': a.visit_id,
      Product:    a.answer,
    }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(missingSheet), 'Missing Products')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `hoft-report-${date}.xlsx`)
}
