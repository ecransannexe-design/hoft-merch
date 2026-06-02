import React from 'react'
import { PhotoCapture } from '../PhotoCapture'
import type { PhotoType } from '../../types'

interface Props {
  photos: Partial<Record<PhotoType, string>>
  onPhoto: (type: PhotoType, url: string) => void
}

export function PicturesFolder({ photos, onPhoto }: Props) {
  const done = (['competitor', 'final'] as PhotoType[]).filter(t => !!photos[t]).length

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#1b1b1b', margin: '0 0 14px' }}>
        After &amp; competitor photos.
      </p>

      <PhotoCapture
        label="Competitor"
        photo={photos.competitor ?? null}
        onSave={url => onPhoto('competitor', url)}
      />
      <PhotoCapture
        label="Final display"
        photo={photos.final ?? null}
        onSave={url => onPhoto('final', url)}
      />

      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#7d7d7d', textAlign: 'center', marginTop: 4 }}>
        {done}/2 photos captured
      </div>
    </div>
  )
}
