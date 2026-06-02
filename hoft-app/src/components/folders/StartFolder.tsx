import React from 'react'
import { PhotoTile } from '../PhotoTile'

interface Props {
  captures: Record<number, string>
  setCaptures: React.Dispatch<React.SetStateAction<Record<number, string>>>
}

export function StartFolder({ captures, setCaptures }: Props) {
  const setPhoto = (i: number, url: string) =>
    setCaptures(prev => ({ ...prev, [i]: url }))

  const done = Object.values(captures).filter(Boolean).length

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          color: '#1b1b1b',
          lineHeight: 1.45,
          margin: '0 0 4px',
        }}
      >
        Photos when you arrived:{' '}
        <span style={{ color: '#ED1C24' }}>do not replace any product!</span>
      </p>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: '#7d7d7d',
          margin: '0 0 16px',
        }}
      >
        (we want the real thing) — tap a circle to open camera
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {([0, 1, 2, 3, 4, 5] as const).map(i => (
          <PhotoTile
            key={i}
            idx={i}
            photo={captures[i] ?? null}
            onPick={url => setPhoto(i, url)}
            round
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: '#7d7d7d',
          textAlign: 'center',
        }}
      >
        {done}/6 arrival photos captured
      </div>
    </div>
  )
}
