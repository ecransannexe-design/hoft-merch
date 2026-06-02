import React from 'react'
import type { Store, VisitSummary } from '../../types'
import { BANNER_LABEL } from '../../data/stores'

interface Props {
  rep: string
  store: Store
  summary: VisitSummary
  completed: boolean
  onComplete: () => void
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '7px 0',
        borderBottom: '1px solid #eaeaea',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: '#4a4a4a',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-num)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          fontSize: 16,
          color: '#141414',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function CompleteFolder({ rep, store, summary, completed, onComplete }: Props) {
  if (completed) {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#2FA84F',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 14px',
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 24,
            color: '#141414',
          }}
        >
          Visit logged
        </div>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: '#7d7d7d',
            marginTop: 6,
            marginBottom: 0,
          }}
        >
          {BANNER_LABEL[store.banner]} · {store.name} — {rep}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          color: '#1b1b1b',
          margin: '0 0 12px',
        }}
      >
        Review &amp; submit this visit.
      </p>

      <div
        style={{
          background: '#f4f4f4',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 16,
        }}
      >
        <Row label="Arrival photos" value={`${summary.captures}/6`} />
        <Row label="Checklist"      value={`${summary.answered}/3`} />
        <Row label="Missing SKUs"   value={summary.missing} />
        <Row label="After photos"   value={summary.pics} />
      </div>

      <button
        onClick={onComplete}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 999,
          padding: '15px 0',
          cursor: 'pointer',
          background: '#141414',
          color: '#fff',
          fontFamily: 'var(--font-ui)',
          fontWeight: 800,
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          fontSize: 16,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        COMPLETE VISIT
      </button>
    </div>
  )
}
