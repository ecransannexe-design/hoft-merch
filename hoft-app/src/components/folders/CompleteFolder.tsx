import React from 'react'
import type { Store, LocalVisit } from '../../types'
import { BANNER_LABEL } from '../../data/stores'
import { SignatureCapture } from '../SignatureCapture'

interface Props {
  rep: string
  store: Store
  visit: LocalVisit
  onSetComments: (c: string) => void
  onSetSignature: (s: string | null) => void
  onComplete: () => void
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '7px 0', borderBottom: '1px solid #eaeaea',
    }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#4a4a4a' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 16, color: '#141414' }}>
        {value}
      </span>
    </div>
  )
}

const STATUS_LABEL: Record<LocalVisit['status'], string> = {
  in_progress:  'In progress',
  pending_sync: 'Waiting for connection…',
  syncing:      'Syncing…',
  synced:       '✓ Synced to server',
  error:        '⚠ Sync error',
}

export function CompleteFolder({ rep, store, visit, onSetComments, onSetSignature, onComplete }: Props) {
  const { answers, missingProducts, photos, signature, status, comments, errorMessage } = visit

  const photoCount = Object.values(photos).filter(Boolean).length
  const answeredCount = Object.values(answers).filter(v => v !== null).length
  const canSubmit = !!signature && status === 'in_progress'

  if (status === 'synced') {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2FA84F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 14px' }}>
          ✓
        </div>
        <div style={{ fontFamily: 'var(--font-label)', fontWeight: 800, fontStyle: 'italic', fontSize: 24, color: '#141414' }}>
          Visit synced
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#7d7d7d', marginTop: 6 }}>
          {BANNER_LABEL[store.banner]} · {store.name} — {rep}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#1b1b1b', margin: '0 0 12px' }}>
        Review, sign &amp; submit this visit.
      </p>

      {/* Summary */}
      <div style={{ background: '#f4f4f4', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
        <Row label="Photos"        value={`${photoCount}/4`} />
        <Row label="Checklist"     value={`${answeredCount}/3`} />
        <Row label="Missing SKUs"  value={missingProducts.length} />
      </div>

      {/* Comments */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', display: 'block', marginBottom: 6 }}>
          Comments
        </label>
        <textarea
          value={comments}
          onChange={e => onSetComments(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Optional notes about this visit…"
          style={{
            width: '100%', border: '1.5px solid #e3e3e3', borderRadius: 12, padding: '10px 12px',
            fontFamily: 'var(--font-ui)', fontSize: 14, color: '#1b1b1b', resize: 'none',
            background: '#fff', outline: 'none',
          }}
        />
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#bcbcbc', textAlign: 'right', marginTop: 2 }}>
          {comments.length}/500
        </div>
      </div>

      {/* Signature */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', display: 'block', marginBottom: 6 }}>
          Signature
        </label>
        <SignatureCapture
          saved={signature}
          onSave={onSetSignature}
          onClear={() => onSetSignature(null)}
        />
      </div>

      {/* Sync status / error */}
      {status !== 'in_progress' && (
        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: status === 'error' ? '#fff5f5' : '#f0fdf4' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: status === 'error' ? '#ED1C24' : '#2FA84F' }}>
            {STATUS_LABEL[status]}
          </span>
          {status === 'error' && errorMessage && (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#ED1C24', margin: '4px 0 0' }}>{errorMessage}</p>
          )}
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!canSubmit}
        style={{
          width: '100%', border: 'none', borderRadius: 999, padding: '15px 0', cursor: canSubmit ? 'pointer' : 'default',
          background: canSubmit ? '#141414' : '#d2d2d2',
          color: canSubmit ? '#fff' : '#8f8f8f',
          fontFamily: 'var(--font-ui)', fontWeight: 800, fontStyle: 'italic',
          letterSpacing: '0.05em', fontSize: 16,
          WebkitTapHighlightColor: 'transparent',
          transition: 'background 0.15s',
        }}
      >
        {canSubmit ? 'COMPLETE VISIT' : 'Signature required'}
      </button>
    </div>
  )
}
