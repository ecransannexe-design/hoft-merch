import React, { useState } from 'react'
import type { Store, Folder, PhotoType } from './types'
import { STORES, BANNER_LABEL } from './data/stores'
import { useSafeArea } from './hooks/useSafeArea'
import { useVisit } from './hooks/useVisit'
import { useSync } from './hooks/useSync'
import { SplashScreen } from './components/SplashScreen'
import { AppHeader } from './components/AppHeader'
import { FolderAccordion } from './components/FolderAccordion'
import { InfoFolder } from './components/folders/InfoFolder'
import { StartFolder } from './components/folders/StartFolder'
import { ChecklistFolder } from './components/folders/ChecklistFolder'
import { PicturesFolder } from './components/folders/PicturesFolder'
import { CompleteFolder } from './components/folders/CompleteFolder'
import { Dashboard } from './pages/Dashboard'

type Screen = 'splash' | 'audit' | 'dashboard'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [rep, setRep]       = useState<string | null>(null)
  const [store, setStore]   = useState<Store | null>(null)
  const [active, setActive] = useState(0)

  const safeArea = useSafeArea()
  const { visit, startVisit, setPhoto, setAnswer, setMissingProducts, setComments, setSignature, markStatus, resetVisit } = useVisit()
  const { online, syncing, pendingCount, lastError, enqueue, flush } = useSync()

  // ── Counts for folder badges ─────────────────────────────
  const photoCount    = visit ? Object.values(visit.photos).filter(Boolean).length : 0
  const answeredCount = visit ? Object.values(visit.answers).filter(v => v !== null).length : 0

  // ── Splash → Audit ───────────────────────────────────────
  const handleEnter = () => {
    if (!rep || !store) return
    startVisit(rep, store.id, `${BANNER_LABEL[store.banner]} ${store.name}`)
    setActive(0)
    setScreen('audit')
  }

  // ── Complete visit ───────────────────────────────────────
  const handleComplete = async () => {
    if (!visit || !visit.signature) return
    markStatus('pending_sync')
    await enqueue({ ...visit, status: 'pending_sync' })

    if (online) {
      markStatus('syncing')
      const results = await flush()
      const r = results[0]
      if (r?.success) {
        markStatus('synced', { supabaseId: r.visitId })
      } else {
        markStatus('error', { errorMessage: r?.error })
      }
    }
  }

  // ── New visit (after complete) ───────────────────────────
  const handleNewVisit = async () => {
    await resetVisit()
    setRep(null)
    setStore(null)
    setScreen('splash')
  }

  // ── Dashboard ────────────────────────────────────────────
  if (screen === 'dashboard') {
    return (
      <Dashboard
        onBack={() => setScreen(visit ? 'audit' : 'splash')}
        safeTop={safeArea.top}
        safeBottom={safeArea.bottom}
      />
    )
  }

  // ── Splash ───────────────────────────────────────────────
  if (screen === 'splash') {
    return (
      <div className="screen">
        <SplashScreen
          rep={rep} store={store}
          onPickRep={setRep} onPickStore={setStore}
          onEnter={handleEnter}
          safeTop={safeArea.top}
        />
        {/* Dashboard shortcut on splash */}
        <button onClick={() => setScreen('dashboard')} style={{
          position: 'absolute', bottom: `max(24px, calc(var(--safe-bottom) + 12px))`, right: 20,
          border: 'none', background: 'rgba(255,255,255,0.12)', borderRadius: 999,
          padding: '8px 14px', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>
          📊 Dashboard
        </button>
      </div>
    )
  }

  // ── Audit ─────────────────────────────────────────────────
  if (!store || !rep || !visit) return null

  const folders: Folder[] = [
    {
      key: 'info',
      label: 'info',
      content: <InfoFolder store={store} />,
    },
    {
      key: 'start',
      label: 'start',
      badge: photoCount > 0 ? Object.keys(visit.photos).filter(k => ['bay_before','display_before'].includes(k) && visit.photos[k as PhotoType]).length || null : null,
      content: (
        <StartFolder
          photos={visit.photos}
          onPhoto={(type, url) => setPhoto(type, url)}
        />
      ),
    },
    {
      key: 'check',
      label: 'check list',
      badge: answeredCount || null,
      content: (
        <ChecklistFolder
          answers={visit.answers}
          missingProducts={visit.missingProducts}
          onAnswer={setAnswer}
          onMissingProducts={setMissingProducts}
        />
      ),
    },
    {
      key: 'pics',
      label: 'pictures',
      badge: (['competitor','final'] as PhotoType[]).filter(t => !!visit.photos[t]).length || null,
      content: (
        <PicturesFolder
          photos={visit.photos}
          onPhoto={(type, url) => setPhoto(type, url)}
        />
      ),
    },
    {
      key: 'done',
      label: 'complete',
      content: (
        <CompleteFolder
          rep={rep}
          store={store}
          visit={visit}
          onSetComments={setComments}
          onSetSignature={setSignature}
          onComplete={handleComplete}
        />
      ),
    },
  ]

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppHeader
        rep={rep}
        store={store}
        onChangeVisit={handleNewVisit}
        onDashboard={() => setScreen('dashboard')}
        safeTop={safeArea.top}
        online={online}
        syncing={syncing}
        pendingCount={pendingCount}
        syncError={lastError}
      />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
        <FolderAccordion active={active} setActive={setActive} folders={folders} />
      </div>

      <div style={{ height: safeArea.bottom, background: '#fff', flexShrink: 0 }} />
    </div>
  )
}
