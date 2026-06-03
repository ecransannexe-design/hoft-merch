import React, { useState, useMemo } from 'react'
import type { Store } from '../types'
import { REPS, STORES } from '../data/stores'
import { PickerSheet } from './PickerSheet'

interface Props {
  rep: string | null
  store: Store | null
  onPickRep: (r: string) => void
  onPickStore: (s: Store) => void
  onEnter: () => void
  safeTop?: number
}

function variationPct(store: Store): number {
  if (!store.ly) return store.tw > 0 ? 100 : 0
  return Math.round((store.tw - store.ly) / store.ly * 100)
}

function SplashPill({
  label,
  value,
  fill,
  onClick,
}: {
  label: string
  value: string | null
  fill: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        background: fill,
        borderRadius: 999,
        padding: '15px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-label)',
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: '0.04em',
          color: '#1c1c1c',
        }}
      >
        {label}
      </span>
      {value && (
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'rgba(0,0,0,0.55)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      )}
    </button>
  )
}

export function SplashScreen({ rep, store, onPickRep, onPickStore, onEnter, safeTop = 0 }: Props) {
  const [sheet, setSheet] = useState<'who' | 'where' | null>(null)
  const [query, setQuery] = useState('')

  const ready = !!(rep && store)

  const handleRep = (r: string) => {
    onPickRep(r)
    setSheet(null)
  }

  const handleStore = (s: Store) => {
    onPickStore(s)
    setSheet(null)
  }

  const filteredByProv = useMemo(() => {
    const t = query.trim().toLowerCase()
    const list = t
      ? STORES.filter(s => s.name.toLowerCase().includes(t) || s.id.includes(t))
      : STORES
    const byProv: Record<string, Store[]> = {}
    list.forEach(s => {
      ;(byProv[s.prov] = byProv[s.prov] || []).push(s)
    })
    return byProv
  }, [query])

  const provOrder = ['QC', 'ON', 'AB', 'SK', 'MB', 'BC', 'NB', 'NS']

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#29292b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: `${Math.max(safeTop + 20, 48)}px 22px max(46px, var(--safe-bottom, 46px))`,
      }}
    >
      {/* Logo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/assets/hoft-logo.png"
          alt="HOFT merchandising"
          style={{ width: 210, opacity: 0.92, filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Pills + button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <SplashPill label="WHO?" value={rep} fill="#F2F2F0" onClick={() => setSheet('who')} />
        <SplashPill
          label="WHERE?"
          value={store ? store.name : null}
          fill="#9A9A9C"
          onClick={() => setSheet('where')}
        />
        <button
          disabled={!ready}
          onClick={onEnter}
          style={{
            marginTop: 5,
            width: '100%',
            border: 'none',
            borderRadius: 999,
            padding: '15px',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? '#1c1c1c' : 'rgba(255,255,255,0.08)',
            color: ready ? '#fff' : 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-label)',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.08em',
            transition: 'all .2s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          START VISIT
        </button>
      </div>

      {/* WHO sheet */}
      <PickerSheet open={sheet === 'who'} title="who is visiting?" onClose={() => setSheet(null)}>
        {REPS.map((r, i) => (
          <button
            key={r}
            onClick={() => handleRep(r)}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '15px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              borderBottom: i < REPS.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: '#7d7d7f',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-label)',
                fontWeight: 800,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {r[0]}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontWeight: 700,
                fontSize: 14.5,
                letterSpacing: '0.03em',
                color: '#26241f',
              }}
            >
              {r}
            </span>
          </button>
        ))}
      </PickerSheet>

      {/* WHERE sheet */}
      <PickerSheet open={sheet === 'where'} title="which store?" onClose={() => setSheet(null)}>
        <div
          style={{
            padding: '4px 20px 12px',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 2,
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search store or # …"
            style={{
              width: '100%',
              border: '1px solid rgba(0,0,0,0.14)',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 15,
              background: '#fff',
              outline: 'none',
              color: '#26241f',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {provOrder
          .filter(p => filteredByProv[p])
          .map(prov => (
            <div key={prov}>
              <div
                style={{
                  padding: '8px 20px 4px',
                  fontFamily: 'var(--font-label)',
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  color: '#888',
                }}
              >
                {prov}
              </div>
              {filteredByProv[prov].map(s => {
                const p = variationPct(s)
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStore(s)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '11px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: 14.5, color: '#26241f' }}>{s.name}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>#{s.id}</span>
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: s.tw >= s.ly ? '#2f7d52' : '#CF4631',
                        flexShrink: 0,
                      }}
                    >
                      {(p > 0 ? '+' : '') + p + '%'}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
      </PickerSheet>
    </div>
  )
}
