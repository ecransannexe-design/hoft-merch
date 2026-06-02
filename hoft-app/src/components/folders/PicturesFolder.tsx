import React from 'react'
import { promptCapture } from '../../lib/camera'

interface Props {
  pics: string[]
  setPics: React.Dispatch<React.SetStateAction<string[]>>
}

export function PicturesFolder({ pics, setPics }: Props) {
  const addPhoto = async () => {
    const result = await promptCapture()
    if (result) setPics(prev => [...prev, result])
  }

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          color: '#1b1b1b',
          margin: '0 0 14px',
        }}
      >
        After photos — show the finished display.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {pics.map((url, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <img
              src={url}
              alt={`after ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}

        {/* add tile */}
        <div
          onClick={addPhoto}
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: 8,
            cursor: 'pointer',
            background: '#f4f4f4',
            border: '1.5px dashed #bcbcbc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7d7d7d',
            fontSize: 28,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          +
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: '#7d7d7d',
          textAlign: 'center',
        }}
      >
        {pics.length} photo{pics.length === 1 ? '' : 's'} added
      </div>
    </div>
  )
}
