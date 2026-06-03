import React from 'react'
import type { AssessmentState } from '../../types'
import { CONFIG } from '../../data/stores'

interface Props {
  state: AssessmentState
  onStateChange: (key: string, value: unknown) => void
}

const CL = {
  card: '#C8CACB',
  dark: '#6E7072',
  ink: '#26241f',
}

// ── Toggle ───────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onChange(!on)
      }}
      style={{
        width: 52,
        height: 31,
        flexShrink: 0,
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        background: on ? '#3E9E52' : '#CF4631',
        position: 'relative',
        transition: 'background .18s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 24 : 3,
          width: 25,
          height: 25,
          borderRadius: 999,
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left .18s',
        }}
      />
    </button>
  )
}

// ── Check ────────────────────────────────────────────────────────
function Check({
  checked,
  onChange,
  size = 16,
  tick = CL.dark,
}: {
  checked: boolean
  onChange: () => void
  size?: number
  tick?: string
}) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onChange()
      }}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 4,
        cursor: 'pointer',
        padding: 0,
        border: '1.7px solid rgba(255,255,255,0.92)',
        background: checked ? '#fff' : 'rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && (
        <svg
          width={size * 0.66}
          height={size * 0.66}
          viewBox="0 0 24 24"
          fill="none"
          stroke={tick}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12.5l5 5L20 5.5" />
        </svg>
      )}
    </button>
  )
}

// ── Stepper (for dark panels — white controls) ────────────────────
function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  const btn: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    background: 'rgba(255,255,255,0.32)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-label)',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <button
        style={btn}
        onClick={e => {
          e.stopPropagation()
          onChange(Math.max(min, (value || 0) - 1))
        }}
      >
        −
      </button>
      <span
        style={{
          minWidth: 14,
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'var(--font-label)',
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {value || 0}
      </span>
      <button
        style={btn}
        onClick={e => {
          e.stopPropagation()
          onChange((value || 0) + 1)
        }}
      >
        +
      </button>
    </div>
  )
}

// ── DarkStepper (for light cards — dark controls) ─────────────────
function DarkStepper({
  value,
  onChange,
  min = 0,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  const btn: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    background: 'rgba(0,0,0,0.16)',
    color: CL.ink,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-label)',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <button style={btn} onClick={() => onChange(Math.max(min, (value || 0) - 1))}>
        −
      </button>
      <span
        style={{
          minWidth: 14,
          textAlign: 'center',
          color: CL.ink,
          fontFamily: 'var(--font-label)',
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {value || 0}
      </span>
      <button style={btn} onClick={() => onChange((value || 0) + 1)}>
        +
      </button>
    </div>
  )
}

// ── Group label ──────────────────────────────────────────────────
function ClGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-label)',
        fontWeight: 800,
        fontSize: 11.5,
        letterSpacing: '0.07em',
        color: CL.ink,
        opacity: 0.8,
        margin: '16px 2px 8px',
      }}
    >
      {children}
    </div>
  )
}

// ── Question row ─────────────────────────────────────────────────
function ClQuestion({ q, on, onChange }: { q: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        background: CL.card,
        borderRadius: 13,
        padding: '13px 16px',
        marginBottom: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-label)',
          fontWeight: 700,
          fontSize: 12.5,
          color: CL.ink,
          lineHeight: 1.3,
        }}
      >
        {q}
      </span>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────
export function ChecklistFolder({ state, onStateChange }: Props) {
  const num = (k: string, d: number) => (state[k] === undefined ? d : (state[k] as number))

  const set = (k: string, v: unknown) => onStateChange(k, v)
  const toggle = (k: string) => {
    if (state[k]) {
      onStateChange(k, undefined)
    } else {
      onStateChange(k, true)
    }
  }

  return (
    <div style={{ paddingBottom: 4 }}>
      {/* Yes/no groups */}
      {CONFIG.checklistGroups.map((g, gi) => (
        <div key={gi}>
          <ClGroupLabel>{g.group}</ClGroupLabel>
          {g.items.map((q, ii) => {
            const key = `cl/q/${gi}/${ii}`
            return (
              <ClQuestion key={ii} q={q} on={!!state[key]} onChange={v => set(key, v)} />
            )
          })}
        </div>
      ))}

      {/* Inventory */}
      <ClGroupLabel>INVENTORY CHECK</ClGroupLabel>
      <div style={{ background: CL.card, borderRadius: 13, padding: '13px 16px', marginBottom: 9 }}>
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 700,
            fontSize: 12.5,
            color: CL.ink,
          }}
        >
          Select all products currently in stock (bay and pallet) :
        </span>
      </div>
      <div style={{ background: CL.dark, borderRadius: 13, padding: '8px 16px', marginBottom: 4 }}>
        {CONFIG.inventory.map((p, i) => {
          const key = `cl/inv/${i}`
          return (
            <label
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0', cursor: 'pointer' }}
            >
              <Check size={16} checked={!!state[key]} tick={CL.dark} onChange={() => toggle(key)} />
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 600,
                  fontSize: 12.5,
                  color: '#fff',
                }}
              >
                {p}
              </span>
            </label>
          )
        })}
      </div>

      {/* Demo components missing */}
      <ClGroupLabel>DEMO COMPONENTS MISSING</ClGroupLabel>
      {CONFIG.demoMissing.map((q, i) => {
        const onKey = `cl/demo/${i}`
        const qtyKey = `cl/demoqty/${i}`
        return (
          <div
            key={i}
            style={{
              background: CL.card,
              borderRadius: 13,
              padding: '14px 16px',
              marginBottom: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: CL.ink,
                  lineHeight: 1.3,
                }}
              >
                {q}
              </span>
              <Toggle on={!!state[onKey]} onChange={v => set(onKey, v)} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: CL.ink,
                }}
              >
                Quantity missing?
              </span>
              <DarkStepper
                value={num(qtyKey, 0)}
                onChange={v => set(qtyKey, v === 0 ? undefined : v)}
              />
            </div>
          </div>
        )
      })}

      {/* Board missing */}
      <div style={{ background: CL.dark, borderRadius: 13, padding: '14px 16px', marginTop: 4 }}>
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 800,
            fontSize: 12.5,
            color: '#fff',
            marginBottom: 8,
          }}
        >
          How many board missing :
        </div>
        {CONFIG.boardMissing.map((b, i) => {
          const onKey = `cl/board/${i}`
          const qtyKey = `cl/boardqty/${i}`
          return (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '7px 0' }}
            >
              <Check size={16} checked={!!state[onKey]} tick={CL.dark} onChange={() => toggle(onKey)} />
              <span
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-label)',
                  fontWeight: 600,
                  fontSize: 12.5,
                  color: '#fff',
                }}
              >
                {b}
              </span>
              <Stepper
                value={num(qtyKey, 1)}
                min={1}
                onChange={v => set(qtyKey, v)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
