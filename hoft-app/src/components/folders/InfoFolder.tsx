import React from 'react'
import type { Store } from '../../types'
import { BANNER_LABEL, fmtMoney } from '../../data/stores'

interface Props {
  store: Store
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '7px 0',
        borderBottom: '1px solid #f0f0f0',
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
          color: strong ? '#141414' : '#1b1b1b',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function InfoFolder({ store }: Props) {
  const up = store.ytd >= store.lastYear
  const pct = ((store.ytd - store.lastYear) / store.lastYear * 100).toFixed(1)
  const arrow = up ? '▲' : '▼'

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 800,
          fontSize: 17,
          letterSpacing: '0.01em',
          color: '#141414',
          marginBottom: 14,
        }}
      >
        {BANNER_LABEL[store.banner]} — {store.name.toUpperCase()}
      </div>

      <Row label="Year to date" value={fmtMoney(store.ytd)} strong />
      <Row label="Last year"    value={fmtMoney(store.lastYear)} />

      <div style={{ marginTop: 14, marginBottom: 16 }}>
        <button
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 999,
            padding: '14px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            fontSize: 16,
            color: '#fff',
            background: up ? '#2FA84F' : '#ED1C24',
          }}
        >
          {up ? 'CONGRATS!' : 'WHY?'}&nbsp;{arrow} {Math.abs(parseFloat(pct))}%
        </button>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: '#4a4a4a',
          lineHeight: 1.8,
        }}
      >
        <div><b>Last visit:</b> {store.lastVisit}</div>
        <div style={{ marginTop: 4, color: '#7d7d7d' }}>– Stock Issues</div>
        <div style={{ color: '#7d7d7d' }}>– Knowledge</div>
        <div style={{ color: '#7d7d7d' }}>– MORE INFO</div>
      </div>
    </div>
  )
}
