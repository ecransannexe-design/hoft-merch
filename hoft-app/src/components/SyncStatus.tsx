import React from 'react'

interface Props {
  online: boolean
  syncing: boolean
  pendingCount: number
  error: string | null
}

export function SyncStatus({ online, syncing, pendingCount, error }: Props) {
  let color = '#2FA84F'
  let label = 'Synced'
  let dot: React.CSSProperties = { background: '#2FA84F' }

  if (!online) {
    color = '#7d7d7d'; label = 'Offline'; dot = { background: '#7d7d7d' }
  } else if (syncing) {
    color = '#F5A623'; label = 'Syncing…'; dot = { background: '#F5A623', animation: 'pulse 1s infinite' }
  } else if (error) {
    color = '#ED1C24'; label = 'Sync error'; dot = { background: '#ED1C24' }
  } else if (pendingCount > 0) {
    color = '#F5A623'
    label = `${pendingCount} pending`
    dot = { background: '#F5A623' }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ width: 8, height: 8, borderRadius: '50%', ...dot }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color }}>
        {label}
      </span>
    </div>
  )
}
