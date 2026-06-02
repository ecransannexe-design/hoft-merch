import React from 'react'
import { promptCapture } from '../lib/camera'
import { HEAT_COLORS } from '../data/stores'

interface Props {
  idx: number
  photo: string | null
  onPick: (dataUrl: string) => void
  /** Round heat-colored circles (arrival). Rectangular add-tile otherwise. */
  round?: boolean
}

export function PhotoTile({ idx, photo, onPick, round = false }: Props) {
  const heatColor = HEAT_COLORS[idx % HEAT_COLORS.length]

  const handleTap = async () => {
    const result = await promptCapture()
    if (result) onPick(result)
  }

  const baseStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  }

  if (round) {
    return (
      <div
        onClick={handleTap}
        style={{
          ...baseStyle,
          borderRadius: '50%',
          background: photo ? '#000' : heatColor,
          color: 'rgba(255,255,255,0.92)',
          fontSize: 28,
          fontWeight: 300,
          transition: 'transform 0.12s',
        }}
        onTouchStart={e => (e.currentTarget.style.transform = 'scale(0.93)')}
        onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {photo ? (
          <>
            <img
              src={photo}
              alt="arrival"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* ring overlay */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.8)',
              }}
            />
          </>
        ) : (
          '+'
        )}
      </div>
    )
  }

  // Rectangular add tile
  return (
    <div
      onClick={handleTap}
      style={{
        ...baseStyle,
        borderRadius: 8,
        background: photo ? '#000' : '#f4f4f4',
        border: photo ? 'none' : '1.5px dashed #bcbcbc',
        color: '#7d7d7d',
        fontSize: 28,
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt="photo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        '+'
      )}
    </div>
  )
}
