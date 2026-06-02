import React, { useEffect, useRef, useState } from 'react'

interface Props {
  onSave: (dataUrl: string) => void
  onClear?: () => void
  saved: string | null
}

export function SignatureCapture({ onSave, onClear, saved }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing   = useRef(false)
  const hasStrokes = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  // Set canvas resolution to match display
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width  = rect.width  * pr
    canvas.height = rect.height * pr
    const ctx = canvas.getContext('2d')!
    ctx.scale(pr, pr)
    ctx.strokeStyle = '#141414'
    ctx.lineWidth   = 2.5
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
  }, [saved]) // re-init if saved changes (e.g., cleared)

  const getPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPoint(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    hasStrokes.current = true
    setIsEmpty(false)
  }

  const endDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    drawing.current = false
  }

  const handleClear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasStrokes.current = false
    setIsEmpty(true)
    onClear?.()
  }

  const handleDone = () => {
    if (isEmpty) return
    const canvas = canvasRef.current!
    onSave(canvas.toDataURL('image/png'))
  }

  if (saved) {
    return (
      <div>
        <div style={{ border: '1px solid #e3e3e3', borderRadius: 12, overflow: 'hidden', background: '#fff', marginBottom: 10 }}>
          <img src={saved} alt="Signature" style={{ width: '100%', display: 'block' }} />
        </div>
        <button onClick={handleClear} style={clearBtnStyle}>
          Clear &amp; redo
        </button>
      </div>
    )
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 120,
          borderRadius: 12,
          border: '1.5px dashed #bcbcbc',
          background: '#fafafa',
          touchAction: 'none',
          display: 'block',
          cursor: 'crosshair',
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      {isEmpty && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#bcbcbc', textAlign: 'center', margin: '6px 0 0' }}>
          Sign above
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={handleClear} style={clearBtnStyle}>Clear</button>
        <button onClick={handleDone} disabled={isEmpty} style={{
          flex: 2, border: 'none', borderRadius: 999, padding: '11px 0',
          background: isEmpty ? '#d2d2d2' : '#141414',
          color: isEmpty ? '#8f8f8f' : '#fff',
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, cursor: isEmpty ? 'default' : 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}>
          Save Signature
        </button>
      </div>
    </div>
  )
}

const clearBtnStyle: React.CSSProperties = {
  flex: 1, border: 'none', borderRadius: 999, padding: '11px 0',
  background: '#f4f4f4', color: '#1b1b1b',
  fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
}
