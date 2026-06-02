import { supabase, supabaseConfigured } from './supabase'
import { compressImage, dataUrlToBlob } from './imageCompression'
import type { LocalVisit, SyncResult, PhotoType } from '../types'

async function uploadFile(
  bucket: string,
  path: string,
  blob: Blob,
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: blob.type, upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function syncVisit(visit: LocalVisit): Promise<SyncResult> {
  if (!supabaseConfigured) {
    return { success: false, error: 'Supabase not configured — add .env' }
  }

  try {
    // 1. Insert the visit row
    const { data: visitRow, error: visitErr } = await supabase
      .from('visits')
      .insert({
        local_id:            visit.localId,
        store_name:          visit.storeName,
        representative_name: visit.rep,
        visit_date:          visit.visitDate,
        comments:            visit.comments || null,
      })
      .select('id')
      .single()

    if (visitErr) {
      // Duplicate local_id means it was already synced
      if (visitErr.code === '23505') {
        const { data: existing } = await supabase
          .from('visits')
          .select('id')
          .eq('local_id', visit.localId)
          .single()
        return { success: true, visitId: existing?.id }
      }
      throw visitErr
    }

    const visitId = visitRow.id

    // 2. Upload photos + insert visit_photos rows
    const photoTypes: PhotoType[] = ['bay_before', 'display_before', 'competitor', 'final']
    for (const type of photoTypes) {
      const dataUrl = visit.photos[type]
      if (!dataUrl) continue
      const compressed = await compressImage(dataUrl)
      const blob = dataUrlToBlob(compressed)
      const path = `${visitId}/${type}.jpg`
      const url = await uploadFile('visit-photos', path, blob)
      await supabase.from('visit_photos').insert({
        visit_id:   visitId,
        photo_type: type,
        photo_url:  url,
      })
    }

    // 3. Insert checklist answers
    const answerRows = [
      { question: 'missing_stock',      answer: visit.answers.missing_stock     === true ? 'yes' : visit.answers.missing_stock === false ? 'no' : null },
      { question: 'correct_pricing',    answer: visit.answers.correct_pricing   === true ? 'yes' : visit.answers.correct_pricing === false ? 'no' : null },
      { question: 'competitor_present', answer: visit.answers.competitor_present === true ? 'yes' : visit.answers.competitor_present === false ? 'no' : null },
    ]
      .filter(r => r.answer !== null)
      .map(r => ({ visit_id: visitId, question: r.question, answer: r.answer as string }))

    if (answerRows.length) {
      await supabase.from('visit_answers').insert(answerRows)
    }

    // 4. Insert missing products as individual answer rows
    for (const product of visit.missingProducts) {
      await supabase.from('visit_answers').insert({
        visit_id: visitId,
        question: 'missing_product',
        answer:   product,
      })
    }

    // 5. Upload signature
    if (visit.signature) {
      const blob = dataUrlToBlob(visit.signature)
      const sigUrl = await uploadFile('signatures', `${visitId}/signature.png`, blob)
      await supabase.from('visits').update({ signature_url: sigUrl }).eq('id', visitId)
    }

    // 6. Mark synced_at
    await supabase
      .from('visits')
      .update({ synced_at: new Date().toISOString() })
      .eq('id', visitId)

    return { success: true, visitId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
