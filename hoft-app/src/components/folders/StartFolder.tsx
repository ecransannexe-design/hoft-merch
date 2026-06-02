import React from 'react'
import { PhotoCapture } from '../PhotoCapture'
import type { PhotoType } from '../../types'

interface Props {
  photos: Partial<Record<PhotoType, string>>
  onPhoto: (type: PhotoType, url: string) => void
}

export function StartFolder({ photos, onPhoto }: Props) {
  const done = (['bay_before', 'display_before'] as PhotoType[])
    .filter(t => !!photos[t]).length

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#1b1b1b', lineHeight: 1.45, margin: '0 0 4px' }}>
        Photos when you arrived: <span style={{ color: '#ED1C24' }}>do not replace any product!</span>
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#7d7d7d', margin: '0 0 16px' }}>
        (we want the real thing)
      </p>

      <PhotoCapture
        label="Bay — before"
        photo={photos.bay_before ?? null}
        onSave={url => onPhoto('bay_before', url)}
      />
      <PhotoCapture
        label="Display — before"
        photo={photos.display_before ?? null}
        onSave={url => onPhoto('display_before', url)}
      />

      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#7d7d7d', textAlign: 'center', marginTop: 4 }}>
        {done}/2 arrival photos captured
      </div>
    </div>
  )
}
