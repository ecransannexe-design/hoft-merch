import React from 'react'
import type { Store } from '../types'
import { BANNER_LABEL } from '../data/stores'
import { SyncStatus } from './SyncStatus'

interface Props {
  rep: string
  store: Store
  onChangeVisit: () => void
  onDashboard: () => void
  safeTop?: number
  online: boolean
  syncing: boolean
  pendingCount: number
  syncError: string | null
}

export function AppHeader({
  rep, store, onChangeVisit, onDashboard,
  safeTop = 0, online, syncing, pendingCount, syncError,
}: Props) {
  return (
    <>
      <div style={{ height: safeTop, background: '#fff', flexShrink: 0 }} />

      {/* Wordmark bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: '1px solid #ededed', background: '#fff', flexShrink: 0,
      }}>
        <img src="/assets/hoft-wordmark.png" alt="HOFT" style={{ height: 24 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SyncStatus online={online} syncing={syncing} pendingCount={pendingCount} error={syncError} />
          <button onClick={onDashboard} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, padding: 0,
            WebkitTapHighlightColor: 'transparent',
          }} title="Dashboard">
            📊
          </button>
        </div>
      </div>

      {/* Rep + store strip */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 16px', background: '#fafafa', borderBottom: '1px solid #ededed', flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, color: '#7d7d7d',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8,
        }}>
          {rep} · {BANNER_LABEL[store.banner]} {store.name}
        </span>
        <button onClick={onChangeVisit} style={{
          border: 'none', background: 'transparent', color: '#141414',
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}>
          change
        </button>
      </div>
    </>
  )
}
