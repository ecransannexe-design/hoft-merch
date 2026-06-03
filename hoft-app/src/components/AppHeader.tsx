import React from 'react'

interface Props {
  onBack: () => void
  onDashboard: () => void
  safeTop?: number
}

export function AppHeader({ onBack, onDashboard, safeTop = 0 }: Props) {
  const circleBtn: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: 'none',
    background: 'rgba(0,0,0,0.06)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    WebkitTapHighlightColor: 'transparent',
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        paddingTop: Math.max(safeTop + 14, 54),
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(#E9EAEA, #CFD0D1)`,
      }}
    >
      {/* Back button */}
      <button onClick={onBack} style={circleBtn} title="Back">
        <svg
          width="11"
          height="18"
          viewBox="0 0 12 20"
          fill="none"
          stroke="#26241f"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2L2 10l8 8" />
        </svg>
      </button>

      {/* HOFT mark */}
      <img src="/assets/hoft-mark.png" alt="HOFT" style={{ height: 24, display: 'block' }} />

      {/* Dashboard / download button */}
      <button onClick={onDashboard} style={circleBtn} title="Dashboard">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#26241f"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v12M8 11l4 4 4-4" />
          <path d="M5 20h14" />
        </svg>
      </button>
    </div>
  )
}
