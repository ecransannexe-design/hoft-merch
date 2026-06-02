import React, { useState } from 'react'
import { PRODUCTS } from '../../data/stores'
import type { ChecklistAnswers } from '../../types'

interface Props {
  answers: ChecklistAnswers
  missingProducts: string[]
  onAnswer: (key: keyof ChecklistAnswers, value: boolean) => void
  onMissingProducts: (products: string[]) => void
}

const QUESTIONS: { key: keyof ChecklistAnswers; label: string }[] = [
  { key: 'missing_stock',      label: 'Any out of stock?' },
  { key: 'correct_pricing',    label: 'Is the POP displayed correctly?' },
  { key: 'competitor_present', label: 'Competitor presence!' },
]

function YesNoToggle({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      {([true, false] as const).map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{
          border: 'none', borderRadius: 999, padding: '8px 16px', cursor: 'pointer',
          fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 13, letterSpacing: '0.04em',
          background: value === v ? (v ? '#2FA84F' : '#ED1C24') : '#d2d2d2',
          color: value === v ? '#fff' : '#3a3a3a',
          transition: 'background 0.15s',
          WebkitTapHighlightColor: 'transparent',
        }}>
          {v ? 'YES' : 'NO'}
        </button>
      ))}
    </div>
  )
}

export function ChecklistFolder({ answers, missingProducts, onAnswer, onMissingProducts }: Props) {
  const [showProds, setShowProds] = useState(false)
  const toggleProd = (p: string) =>
    onMissingProducts(missingProducts.includes(p) ? missingProducts.filter(x => x !== p) : [...missingProducts, p])

  return (
    <div>
      {QUESTIONS.map(({ key, label }) => (
        <div key={key} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '12px 14px', borderRadius: 12, background: '#f4f4f4', marginBottom: 10,
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.01em', color: '#1b1b1b', lineHeight: 1.3, flex: 1 }}>
            {label}
          </span>
          <YesNoToggle value={answers[key]} onChange={v => onAnswer(key, v)} />
        </div>
      ))}

      {/* Missing products — only if missing_stock is YES */}
      {answers.missing_stock === true && (
        <>
          <button onClick={() => setShowProds(s => !s)} style={{
            width: '100%', border: 'none', borderRadius: 12, padding: '13px 16px',
            marginTop: 4, cursor: 'pointer', background: '#8f8f8f', color: '#fff',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span>Select missing products ({PRODUCTS.length} options)</span>
            <span style={{ fontWeight: 800 }}>{missingProducts.length ? missingProducts.length : showProds ? '▲' : '▼'}</span>
          </button>

          <div style={{ maxHeight: showProds ? 320 : 0, overflow: 'hidden', transition: 'max-height 0.34s cubic-bezier(0.22,0.61,0.36,1)' }}>
            <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], maxHeight: 320, marginTop: 8 }}>
              {PRODUCTS.map(p => {
                const sel = missingProducts.includes(p)
                return (
                  <div key={p} onClick={() => toggleProd(p)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px',
                    cursor: 'pointer', borderBottom: '1px solid #ededed',
                    WebkitTapHighlightColor: 'transparent',
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: sel ? 'none' : '2px solid #c4c4c4',
                      background: sel ? '#ED1C24' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>{sel ? '✓' : ''}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12.5, color: '#1b1b1b' }}>{p}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
