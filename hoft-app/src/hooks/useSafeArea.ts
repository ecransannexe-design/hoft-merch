import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

interface SafeArea {
  top: number
  bottom: number
}

/**
 * Returns the safe-area inset values.
 * On iOS/Android, reads from CSS env() vars after layout.
 * Falls back to sensible defaults for notched phones.
 */
export function useSafeArea(): SafeArea {
  const [area, setArea] = useState<SafeArea>({ top: 0, bottom: 0 })

  useEffect(() => {
    // Configure StatusBar for native platforms
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
      StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {})
    }

    // Read CSS env() values after the browser has resolved them
    const el = document.createElement('div')
    el.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'width:1px', 'height:1px',
      'padding-top:env(safe-area-inset-top,0px)',
      'padding-bottom:env(safe-area-inset-bottom,0px)',
      'visibility:hidden', 'pointer-events:none',
    ].join(';')
    document.body.appendChild(el)

    const cs = getComputedStyle(el)
    const top = parseInt(cs.paddingTop) || 0
    const bottom = parseInt(cs.paddingBottom) || 0
    document.body.removeChild(el)

    setArea({ top, bottom })
  }, [])

  return area
}
