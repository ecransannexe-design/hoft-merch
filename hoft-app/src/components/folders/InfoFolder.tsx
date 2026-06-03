import React from 'react'
import type { Store } from '../../types'

interface Props {
  store: Store
  allStores: Store[]
}

function variationPct(store: Store): number {
  if (!store.ly) return store.tw > 0 ? 100 : 0
  return Math.round((store.tw - store.ly) / store.ly * 100)
}

function rankFor(store: Store, all: Store[]): number {
  const sorted = all.map(s => s.tw).sort((a, b) => a - b)
  const idx = sorted.findIndex(v => v >= store.tw)
  const pct = idx / Math.max(1, sorted.length - 1)
  return Math.max(1, Math.round(pct * 5))
}

const REF_NAMES = ['Mike', 'Sarah', 'Marc', 'Jessica', 'David', 'Karen', 'Tom', 'Luc', 'Nadia', 'Steve']
const REF_ISSUES = ['None', 'Low inventory', 'Out of stock', 'Planogram not respected', 'POP missing / damaged']

function refInfo(store: Store) {
  const n = parseInt(store.id, 10) || 0
  const d = new Date()
  d.setDate(d.getDate() - (14 + (n % 70)))
  const p = (x: number) => String(x).padStart(2, '0')
  return {
    associate: REF_NAMES[n % REF_NAMES.length],
    issue: REF_ISSUES[n % REF_ISSUES.length],
    followup: n % 3 === 0,
    lastVisit: `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`,
  }
}

function Stars({ value = 0, size = 17 }: { value?: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= value ? '#F2B007' : 'none'}
          stroke={i <= value ? '#F2B007' : 'rgba(0,0,0,0.25)'}
          strokeWidth="1.6"
        >
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.4l-5.8 3.05 1.1-6.45-4.7-4.6 6.5-.95z"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ fontSize: 14, color: '#26241f' }}>
      <strong style={{ fontWeight: 800 }}>{label} : </strong>{value}
    </span>
  )
}

export function InfoFolder({ store, allStores }: Props) {
  const v = variationPct(store)
  const rank = rankFor(store, allStores)
  const ref = refInfo(store)
  const down = v < 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: '#26241f' }}>
      {/* Store name */}
      <div
        style={{
          fontFamily: 'var(--font-label)',
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: '-0.01em',
        }}
      >
        {store.name.toUpperCase()}
      </div>

      {/* Sales stat card */}
      <div style={{ background: 'rgba(255,255,255,0.42)', borderRadius: 999, padding: '4px 4px' }}>
        <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: 13.5,
                color: '#26241f',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Sales vs last year
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg
                width="18"
                height="16"
                viewBox="0 0 20 18"
                style={{ transform: down ? 'none' : 'rotate(180deg)' }}
              >
                <path d="M10 17L0.5 1h19z" fill={down ? '#DE1A0F' : '#2f7d52'} />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 800,
                  fontSize: 15,
                  color: down ? '#DE1A0F' : '#2f7d52',
                }}
              >
                {v > 0 ? '+' : ''}
                {v}%
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: 13.5,
                color: '#26241f',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Sales rank among stores :
            </span>
            <Stars value={rank} size={17} />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
        <Field label="Last visit" value={ref.lastVisit} />
        <Field label="Store Associate" value={ref.associate} />
      </div>
      <Field label="Issue" value={ref.issue} />
      <Field label="Follow-up Required" value={ref.followup ? 'Yes' : 'No'} />

      {/* In-store presence */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 800,
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          HOFT's In-store presence :
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 14 }}>
          {['Planogram Bay', 'End Cap', 'Pallet Program composite', 'Seasonal Demo'].map(p => (
            <span key={p} style={{ fontSize: 14 }}>
              - {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
