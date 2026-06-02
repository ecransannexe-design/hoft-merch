import React, { useState } from 'react'
import type { Store } from '../types'
import { REPS, STORES, BANNER_LABEL } from '../data/stores'
import { PickerSheet } from './PickerSheet'

interface Props {
  rep: string | null
  store: Store | null
  onPickRep: (r: string) => void
  onPickStore: (s: Store) => void
  onEnter: () => void
  safeTop?: number
}

function Pill({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  const filled = !!value
  return (
    <button
      onClick={onClick}
      onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      style={{
        width: '100%',
        borderRadius: 999,
        cursor: 'pointer',
        background: filled ? '#fff' : 'rgba(255,255,255,0.12)',
        border: filled ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(255,255,255,0.3)',
        color: filled ? '#1b1b1b' : '#fff',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-ui)',
        transition: 'transform 0.12s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: 14 }}>
        {label}
      </span>
      {filled ? (
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginLeft: 12,
            color: '#1b1b1b',
            maxWidth: '55%',
            textAlign: 'right',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      ) : (
        <span style={{ fontSize: 20, opacity: 0.5 }}>›</span>
      )}
    </button>
  )
}

export function SplashScreen({ rep, store, onPickRep, onPickStore, onEnter, safeTop = 0 }: Props) {
  const [sheet, setSheet] = useState<'who' | 'where' | null>(null)

  const handleRep = (r: string) => {
    onPickRep(r)
    setSheet(null)
    if (store) onEnter()
  }

  const handleStore = (s: Store) => {
    onPickStore(s)
    setSheet(null)
    if (rep) onEnter()
  }

  const rowStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    marginBottom: 8,
    background: active ? '#141414' : '#f4f4f4',
    color: active ? '#fff' : '#1b1b1b',
    fontFamily: 'var(--font-ui)',
    WebkitTapHighlightColor: 'transparent',
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#4a4a4a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: `max(${safeTop + 56}px, 90px)`,
        paddingBottom: 'max(48px, var(--safe-bottom))',
        paddingLeft: 28,
        paddingRight: 28,
      }}
    >
      {/* logo — inverted to white on dark background */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/assets/hoft-logo.png"
          alt="HOFT merchandising"
          style={{ width: 'min(220px, calc(100vw - 80px))', filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* pickers */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Pill label="WHO?"   value={rep ?? ''}   onClick={() => setSheet('who')} />
        <Pill
          label="WHERE?"
          value={store ? `${BANNER_LABEL[store.banner]} · ${store.name}` : ''}
          onClick={() => setSheet('where')}
        />
      </div>

      {/* WHO sheet */}
      <PickerSheet open={sheet === 'who'} title="who is visiting?" onClose={() => setSheet(null)}>
        {REPS.map(r => (
          <div key={r} style={rowStyle(r === rep)} onClick={() => handleRep(r)}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{r}</span>
            {r === rep && <span>✓</span>}
          </div>
        ))}
      </PickerSheet>

      {/* WHERE sheet */}
      <PickerSheet open={sheet === 'where'} title="which store?" onClose={() => setSheet(null)}>
        {STORES.map(s => (
          <div key={s.id} style={rowStyle(store?.id === s.id)} onClick={() => handleStore(s)}>
            <span>
              <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.02em' }}>
                {BANNER_LABEL[s.banner]}
              </span>
              <span style={{ fontWeight: 500, fontSize: 14, opacity: 0.85 }}> · {s.name}</span>
              <span style={{ display: 'block', fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                {s.prov} · #{s.id}
              </span>
            </span>
            {store?.id === s.id && <span>✓</span>}
          </div>
        ))}
      </PickerSheet>
    </div>
  )
}
