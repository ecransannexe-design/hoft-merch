import React from 'react'

interface Props {
  topics: string[]
}

export function StaffFolder({ topics }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: '#26241f' }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45 }}>
        Now head over to the PRO Desk and ask to speak with one of the following team members :
      </p>
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-label)',
          fontWeight: 800,
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        Manager / Assistant Manager<br />PRO Desk Associates
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45 }}>
        Put your HOFT expertise to work by covering these key topics with Associates
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {topics.map((t, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              background: 'rgba(255,255,255,0.28)',
              borderRadius: 16,
              padding: '13px 16px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontWeight: 800,
                fontSize: 20,
                color: '#26241f',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {i + 1}.
            </span>
            <span
              style={{
                flex: 1,
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: '0.01em',
                color: '#26241f',
                textTransform: 'uppercase',
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
