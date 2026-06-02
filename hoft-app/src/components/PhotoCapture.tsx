import React, { useState } from 'react'
import { promptCapture } from '../lib/camera'
import { compressImage } from '../lib/imageCompression'

interface Props {
  label: string
  photo: string | null
  onSave: (dataUrl: string) => void
}

type State = 'idle' | 'preview'

export function PhotoCapture({ label, photo, onSave }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [state, setState] = useState<State>('idle')

  const handleCapture = async () => {
    const result = await promptCapture()
    if (!result) return
    const compressed = await compressImage(result)
    setPreview(compressed)
    setState('preview')
  }

  const handleRetake = () => {
    setPreview(null)
    setState('idle')
    handleCapture()
  }

  const handleUse = () => {
    if (!preview) return
    onSave(preview)
    setPreview(null)
    setState('idle')
  }

  const saved = photo

  // ── Preview mode ──────────────────────────────────────────
  if (state === 'preview' && preview) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
          <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button onClick={handleRetake} style={btnStyle('#f4f4f4', '#1b1b1b')}>
            Retake
          </button>
          <button onClick={handleUse} style={{ ...btnStyle('#141414', '#fff'), flex: 2 }}>
            Use Photo ✓
          </button>
        </div>
      </div>
    )
  }

  // ── Saved mode ────────────────────────────────────────────
  if (saved) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }} onClick={handleCapture}>
          <img src={saved} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '24px 12px 10px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '4px 10px' }}>
              Retake
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ── Idle mode ─────────────────────────────────────────────
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', marginBottom: 8 }}>
        {label}
      </div>
      <button
        onClick={handleCapture}
        style={{
          width: '100%',
          aspectRatio: '4/3',
          borderRadius: 12,
          border: '1.5px dashed #bcbcbc',
          background: '#f9f9f9',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ fontSize: 32 }}>📷</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: '#7d7d7d' }}>
          Tap to capture
        </span>
      </button>
    </div>
  )
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    flex: 1,
    border: 'none',
    borderRadius: 999,
    padding: '11px 0',
    background: bg,
    color,
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  }
}
