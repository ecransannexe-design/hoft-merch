import React, { useRef, useState } from 'react'
import type { AssessmentState } from '../../types'
import { PLANOGRAM_TREE, FLOOR_TREE } from '../../data/stores'
import type { TreeNode as TreeNodeType } from '../../data/stores'

// Theme types
interface Theme {
  body: string
  topLine: string
  subLine: string
  reveal: string
}

// ── Palette ──────────────────────────────────────────────────────
const oliveTheme: Theme = {
  body: '#606458',
  topLine: 'rgba(0,0,0,0.24)',
  subLine: 'rgba(255,255,255,0.16)',
  reveal: '#6E7263',
}
const brickTheme: Theme = {
  body: '#644D46',
  topLine: 'rgba(0,0,0,0.22)',
  subLine: 'rgba(255,255,255,0.15)',
  reveal: '#79584C',
}
const oliveDark = '#3E3F36'
const brickDark = '#622F1B'

const PLANOGRAM_BLOCKS = 2
const FLOOR_BLOCKS = 5

interface Props {
  state: AssessmentState
  onStateChange: (key: string, value: unknown) => void
}

// ── API helpers ──────────────────────────────────────────────────
interface Api {
  toggle: (k: string) => void
  set: (k: string, v: unknown) => void
}

// ── Square checkbox ──────────────────────────────────────────────
function Check({
  checked,
  onChange,
  size = 17,
  tick = '#3E3F36',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  size?: number
  tick?: string
}) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onChange(!checked)
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

// ── Filled disclosure triangle ──────────────────────────────────
function Tri({ open, onClick, color = '#fff' }: { open: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      style={{
        width: 18,
        height: 18,
        flexShrink: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="9"
        height="11"
        viewBox="0 0 9 11"
        style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .18s' }}
      >
        <path d="M0 0l9 5.5L0 11z" fill={color} />
      </svg>
    </button>
  )
}

// ── Caret ────────────────────────────────────────────────────────
function Caret({ open, color = '#fff', size = 13 }: { open: boolean; color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
    >
      <path d="M6 15l6-6 6 6" />
    </svg>
  )
}

// ── usePhoto hook ────────────────────────────────────────────────
function usePhoto(onChange: (v: string) => void) {
  const ref = useRef<HTMLInputElement>(null)
  const pick = () => ref.current && ref.current.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => onChange(r.result as string)
    r.readAsDataURL(f)
  }
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onFile}
      style={{ display: 'none' }}
    />
  )
  return { pick, input }
}

// ── Section card ─────────────────────────────────────────────────
function SectionCard({
  label,
  dark,
  value,
  onChange,
}: {
  label: string
  dark: string
  value: string | undefined
  onChange: (v: string) => void
}) {
  const { pick, input } = usePhoto(onChange)
  return (
    <div
      onClick={pick}
      style={{
        position: 'relative',
        height: 118,
        borderRadius: 16,
        background: dark,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {value && (
        <img
          src={value}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-label)',
          fontWeight: 700,
          fontSize: 12.5,
          letterSpacing: '0.06em',
          color: '#fff',
          textShadow: value ? '0 1px 4px rgba(0,0,0,0.55)' : 'none',
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: 999,
          background: value ? 'rgba(0,0,0,0.45)' : 'transparent',
          marginTop: 8,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      {input}
    </div>
  )
}

// ── Photo reveal ─────────────────────────────────────────────────
function PhotoReveal({
  value,
  onChange,
  accent,
}: {
  value: string | undefined
  onChange: (v: string) => void
  accent: string
}) {
  const { pick, input } = usePhoto(onChange)
  return (
    <div
      onClick={pick}
      style={{
        position: 'relative',
        height: value ? 120 : 72,
        borderRadius: 11,
        background: accent,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        margin: '2px 0 10px',
      }}
    >
      {value ? (
        <img
          src={value}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            ADD PHOTO
          </span>
        </>
      )}
      {input}
    </div>
  )
}

// ── WhatInput ────────────────────────────────────────────────────
function WhatInput({ value, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  return (
    <input
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder="WHAT?"
      style={{
        width: '100%',
        border: 'none',
        outline: 'none',
        borderRadius: 999,
        padding: '11px 18px',
        margin: '2px 0 10px',
        background: 'rgba(0,0,0,0.22)',
        color: '#fff',
        fontFamily: 'var(--font-label)',
        fontWeight: 600,
        fontSize: 12.5,
        letterSpacing: '0.06em',
        boxSizing: 'border-box',
      }}
    />
  )
}

// ── Select panel ─────────────────────────────────────────────────
function SelectPanel({
  dark,
  body,
  count,
  children,
}: {
  dark: string
  body: string
  count: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', marginTop: 11 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          border: 'none',
          cursor: 'pointer',
          background: dark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 600,
            fontSize: 12.5,
            letterSpacing: '0.02em',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          select what you see{count ? ` (${count})` : ''}
        </span>
        <Caret open={open} />
      </button>
      {open && <div style={{ background: body, padding: '2px 16px 8px' }}>{children}</div>}
    </div>
  )
}

// ── TreeNode ─────────────────────────────────────────────────────
function TreeNode({
  node,
  path,
  depth,
  state,
  api,
  theme,
  last,
}: {
  node: TreeNodeType
  path: string
  depth: number
  state: AssessmentState
  api: Api
  theme: Theme
  last: boolean
}) {
  const isDisc = node.kind === 'disc'
  const openKey = isDisc ? path + '#open' : path
  const on = !!state[openKey]
  const indent = depth * 22
  const line = depth === 0 ? theme.topLine : theme.subLine
  const kids = node.children || []

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '11px 0',
          paddingLeft: indent,
          borderBottom: last ? 'none' : `1px solid ${line}`,
        }}
      >
        {isDisc ? (
          <Tri open={on} onClick={() => api.toggle(openKey)} />
        ) : (
          <Check
            size={17}
            checked={on}
            tick={theme.body}
            onChange={() => api.toggle(openKey)}
          />
        )}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: 'var(--font-label)',
            fontWeight: 600,
            fontSize: depth === 0 ? 12.5 : 11.5,
            letterSpacing: '0.04em',
            color: isDisc ? 'rgba(255,255,255,0.92)' : '#fff',
          }}
        >
          {node.label}
        </span>
      </div>

      {/* Reveals (only when on) */}
      {on && (
        <div style={{ paddingLeft: indent + 28 }}>
          {node.input && (
            <WhatInput
              value={state[path + ':what'] as string | undefined}
              onChange={v => api.set(path + ':what', v)}
            />
          )}
          {node.photo && (
            <PhotoReveal
              value={state[path + ':photo'] as string | undefined}
              accent={theme.reveal}
              onChange={v => api.set(path + ':photo', v)}
            />
          )}
        </div>
      )}

      {/* Children */}
      {on &&
        kids.length > 0 &&
        kids.map((c, i) => (
          <TreeNode
            key={c.id}
            node={c}
            path={path + '/' + c.id}
            depth={depth + 1}
            state={state}
            api={api}
            theme={theme}
            last={last && i === kids.length - 1}
          />
        ))}
    </div>
  )
}

// ── Count checked ────────────────────────────────────────────────
function countChecked(state: AssessmentState, prefix: string): number {
  return Object.keys(state).filter(
    k => k.startsWith(prefix) && state[k] === true && !k.includes('#') && !k.includes(':')
  ).length
}

// ── Main component ───────────────────────────────────────────────
export function AssessmentFolder({ state, onStateChange }: Props) {
  const api: Api = {
    toggle: (k: string) => {
      if (state[k]) {
        // Remove key and cascade
        onStateChange(k, undefined)
      } else {
        onStateChange(k, true)
      }
    },
    set: (k: string, v: unknown) => {
      onStateChange(k, v)
    },
  }

  const Block = ({
    label,
    dark,
    body,
    theme,
    tree,
    prefix,
  }: {
    label: string
    dark: string
    body: string
    theme: Theme
    tree: TreeNodeType[]
    prefix: string
  }) => (
    <div style={{ marginBottom: 26 }}>
      <SectionCard
        label={label}
        dark={dark}
        value={state[prefix + '#photo'] as string | undefined}
        onChange={v => api.set(prefix + '#photo', v)}
      />
      <SelectPanel dark={dark} body={body} count={countChecked(state, prefix + '/')}>
        {tree.map((n, i) => (
          <TreeNode
            key={n.id}
            node={n}
            path={prefix + '/' + n.id}
            depth={0}
            state={state}
            api={api}
            theme={theme}
            last={i === tree.length - 1}
          />
        ))}
      </SelectPanel>
    </div>
  )

  return (
    <div style={{ paddingBottom: 8 }}>
      {Array.from({ length: PLANOGRAM_BLOCKS }).map((_, bi) => (
        <Block
          key={'pg' + bi}
          label="PLANOGRAM BAY"
          dark={oliveDark}
          body={oliveTheme.body}
          theme={oliveTheme}
          tree={PLANOGRAM_TREE}
          prefix={'pg' + bi}
        />
      ))}
      {Array.from({ length: FLOOR_BLOCKS }).map((_, bi) => (
        <Block
          key={'fp' + bi}
          label="FLOOR PROGRAM"
          dark={brickDark}
          body={brickTheme.body}
          theme={brickTheme}
          tree={FLOOR_TREE}
          prefix={'fp' + bi}
        />
      ))}
    </div>
  )
}
