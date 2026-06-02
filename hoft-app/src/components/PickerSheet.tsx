import React from 'react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function PickerSheet({ open, title, onClose, children }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.26s',
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          maxHeight: '78%',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 0.34s cubic-bezier(0.22,0.61,0.36,1)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.22)',
          paddingBottom: 'max(24px, var(--safe-bottom))',
        }}
      >
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: '#d2d2d2' }} />
        </div>

        {/* title */}
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 22,
            padding: '10px 22px 6px',
            color: '#1b1b1b',
            flexShrink: 0,
          }}
        >
          {title}
        </div>

        {/* scrollable list */}
        <div
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            padding: '4px 14px 8px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
