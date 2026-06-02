import React from 'react'
import type { Folder } from '../types'

const GRAY = ['#e4e4e4', '#d2d2d2', '#bcbcbc', '#a6a6a6', '#8f8f8f']

interface Props {
  active: number
  setActive: (i: number) => void
  folders: Folder[]
}

export function FolderAccordion({ active, setActive, folders }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 16px 32px' }}>
      {folders.map((f, i) => {
        const isActive = i === active
        const labelColor = isActive ? '#141414' : i >= 3 ? '#fff' : '#1b1b1b'

        return (
          <div
            key={f.key}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              background: isActive ? '#fff' : GRAY[i],
              border: isActive ? '1px solid #e3e3e3' : 'none',
              boxShadow: isActive
                ? '0 4px 16px rgba(0,0,0,0.12)'
                : 'inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'background 0.26s, box-shadow 0.26s',
            }}
          >
            {/* folder tab button */}
            <button
              onClick={() => setActive(isActive ? -1 : i)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '13px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-label)',
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 23,
                letterSpacing: '-0.01em',
                color: labelColor,
                textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span>{f.label}</span>

              {f.badge != null && f.badge > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontStyle: 'normal',
                    fontWeight: 800,
                    fontSize: 11,
                    minWidth: 20,
                    height: 20,
                    padding: '0 6px',
                    borderRadius: 999,
                    background: isActive ? '#141414' : 'rgba(0,0,0,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {f.badge}
                </span>
              )}
            </button>

            {/* collapsible content */}
            <div
              style={{
                maxHeight: isActive ? 1600 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.42s cubic-bezier(0.22,0.61,0.36,1)',
              }}
            >
              <div style={{ padding: '0 18px 18px' }}>{f.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
