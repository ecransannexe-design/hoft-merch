import React from 'react'
import type { Folder } from '../types'

interface Props {
  active: number
  setActive: (i: number) => void
  folders: Folder[]
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#26241f"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
    >
      <path d="M6 15l6-6 6 6" />
    </svg>
  )
}

export function FolderAccordion({ active, setActive, folders }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      {folders.map((f, i) => {
        const isFirst = i === 0
        const isOpen = i === active

        return (
          <div
            key={f.key}
            style={{
              position: 'relative',
              zIndex: i + 1,
              marginTop: isFirst ? 0 : -24,
              background: f.tint,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            {/* Tab header button */}
            <button
              onClick={() => setActive(isOpen ? -1 : i)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isFirst ? '24px 24px 18px' : '30px 24px 18px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  fontSize: 26,
                  color: '#26241f',
                  textAlign: 'left',
                }}
              >
                {f.label}
              </span>
              <Caret open={isOpen} />
            </button>

            {/* Collapsible content */}
            {isOpen && (
              <div style={{ padding: '0 18px 30px' }}>
                {f.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
