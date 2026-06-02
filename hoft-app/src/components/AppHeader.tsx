import React from 'react'
import type { Store } from '../types'
import { BANNER_LABEL } from '../data/stores'

interface Props {
  rep: string
  store: Store
  onChangeVisit: () => void
  safeTop?: number
}

export function AppHeader({ rep, store, onChangeVisit, safeTop = 0 }: Props) {
  return (
    <>
      {/* Status-bar spacer — pushes content below the notch/island */}
      <div style={{ height: safeTop, background: '#fff', flexShrink: 0 }} />

      {/* Wordmark bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 0',
          borderBottom: '1px solid #ededed',
          background: '#fff',
          flexShrink: 0,
        }}
      >
        <img src="/assets/hoft-wordmark.png" alt="HOFT" style={{ height: 26 }} />
      </div>

      {/* Rep + store strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px',
          background: '#fafafa',
          borderBottom: '1px solid #ededed',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: '#7d7d7d',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginRight: 8,
          }}
        >
          {rep} · {BANNER_LABEL[store.banner]} {store.name}
        </span>
        <button
          onClick={onChangeVisit}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#141414',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            padding: '2px 0',
          }}
        >
          change
        </button>
      </div>
    </>
  )
}
