import React, { useState } from 'react'
import { CHECKLIST, PRODUCTS } from '../../data/stores'

interface Props {
  answers: Record<string, boolean>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  missing: string[]
  setMissing: React.Dispatch<React.SetStateAction<string[]>>
}

export function ChecklistFolder({ answers, setAnswers, missing, setMissing }: Props) {
  const [showProds, setShowProds] = useState(false)

  const toggleAns = (id: string) =>
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }))

  const toggleProd = (p: string) =>
    setMissing(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )

  return (
    <div>
      {CHECKLIST.map(item => {
        const on = !!answers[item.id]
        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 12,
              background: '#f4f4f4',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                color: '#1b1b1b',
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {item.q}
            </span>
            <button
              onClick={() => toggleAns(item.id)}
              style={{
                flexShrink: 0,
                border: 'none',
                borderRadius: 999,
                padding: '9px 22px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.05em',
                background: on ? '#141414' : '#d2d2d2',
                color: on ? '#fff' : '#3a3a3a',
                transition: 'background 0.15s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              YES
            </button>
          </div>
        )
      })}

      {/* missing products expander */}
      <button
        onClick={() => setShowProds(s => !s)}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 12,
          padding: '13px 16px',
          marginTop: 2,
          cursor: 'pointer',
          background: '#8f8f8f',
          color: '#fff',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span>select missing products ({PRODUCTS.length} options)</span>
        <span style={{ fontWeight: 800 }}>
          {missing.length ? missing.length : showProds ? '▲' : '▼'}
        </span>
      </button>

      <div
        style={{
          maxHeight: showProds ? 320 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.34s cubic-bezier(0.22,0.61,0.36,1)',
        }}
      >
        <div
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            maxHeight: 320,
            marginTop: 10,
          }}
        >
          {PRODUCTS.map(p => {
            const sel = missing.includes(p)
            return (
              <div
                key={p}
                onClick={() => toggleProd(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ededed',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    flexShrink: 0,
                    border: sel ? 'none' : '2px solid #c4c4c4',
                    background: sel ? '#ED1C24' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {sel ? '✓' : ''}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12.5,
                    color: '#1b1b1b',
                  }}
                >
                  {p}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
