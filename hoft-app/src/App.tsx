import React, { useState } from 'react'
import type { Store, Folder } from './types'
import { STORES, CONFIG } from './data/stores'
import { useSafeArea } from './hooks/useSafeArea'
import { useVisit } from './hooks/useVisit'
import { useSync } from './hooks/useSync'
import { SplashScreen } from './components/SplashScreen'
import { AppHeader } from './components/AppHeader'
import { FolderAccordion } from './components/FolderAccordion'
import { InfoFolder } from './components/folders/InfoFolder'
import { AssessmentFolder } from './components/folders/AssessmentFolder'
import { ChecklistFolder } from './components/folders/ChecklistFolder'
import { StaffFolder } from './components/folders/StaffFolder'
import { Dashboard } from './pages/Dashboard'
import { PickerSheet } from './components/PickerSheet'
import { SignatureCapture } from './components/SignatureCapture'

type Screen = 'splash' | 'audit' | 'dashboard'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [rep, setRep] = useState<string | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [active, setActive] = useState(0)
  const [showSignSheet, setShowSignSheet] = useState(false)

  const safeArea = useSafeArea()
  const {
    visit,
    startVisit,
    setSignature,
    setAssessmentValue,
    markStatus,
    resetVisit,
  } = useVisit()
  const { online, syncing, enqueue, flush } = useSync()

  // ── Splash → Audit ───────────────────────────────────────
  const handleEnter = () => {
    if (!rep || !store) return
    startVisit(rep, store.id, store.name)
    setActive(0)
    setScreen('audit')
  }

  // ── Complete visit ───────────────────────────────────────
  const handleComplete = async () => {
    if (!visit || !visit.signature) return
    setShowSignSheet(false)
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

  // ── New visit (after complete or back) ───────────────────
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
          rep={rep}
          store={store}
          onPickRep={setRep}
          onPickStore={setStore}
          onEnter={handleEnter}
          safeTop={safeArea.top}
        />
      </div>
    )
  }

  // ── Audit ─────────────────────────────────────────────────
  if (!store || !rep || !visit) return null

  const assessmentState = visit.assessmentState || {}

  const folders: Folder[] = [
    {
      key: 'info',
      label: 'info',
      tint: '#CCCDCE',
      content: <InfoFolder store={store} allStores={STORES} />,
    },
    {
      key: 'assessment',
      label: 'assessment',
      tint: '#B4B6B7',
      content: (
        <AssessmentFolder
          state={assessmentState}
          onStateChange={setAssessmentValue}
        />
      ),
    },
    {
      key: 'check-list',
      label: 'check-list',
      tint: '#9EA0A1',
      content: (
        <ChecklistFolder
          state={assessmentState}
          onStateChange={setAssessmentValue}
        />
      ),
    },
    {
      key: 'staff',
      label: 'staff interaction',
      tint: '#8A8C8D',
      content: <StaffFolder topics={CONFIG.staffTopics} />,
    },
  ]

  return (
    <div
      className="screen"
      style={{ display: 'flex', flexDirection: 'column', background: '#C7C8C9', overflow: 'hidden' }}
    >
      <AppHeader
        onBack={handleNewVisit}
        onDashboard={() => setScreen('dashboard')}
        safeTop={safeArea.top}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        }}
      >
        <FolderAccordion active={active} setActive={setActive} folders={folders} />

        {/* COMPLETE VISIT button */}
        <div
          style={{
            padding: '4px 22px',
            paddingBottom: Math.max(safeArea.bottom + 16, 46),
            background: '#8A8C8D',
          }}
        >
          <button
            onClick={() => setShowSignSheet(true)}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 999,
              padding: '16px',
              cursor: 'pointer',
              background: '#1c1c1c',
              color: '#fff',
              fontFamily: 'var(--font-label)',
              fontWeight: 800,
              fontSize: 14.5,
              letterSpacing: '0.06em',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            COMPLETE VISIT
          </button>
        </div>
      </div>

      {/* Signature sheet */}
      <PickerSheet
        open={showSignSheet}
        title="sign to complete"
        onClose={() => setShowSignSheet(false)}
      >
        <div style={{ padding: '8px 6px 16px' }}>
          <SignatureCapture
            saved={visit.signature}
            onSave={sig => {
              setSignature(sig)
            }}
            onClear={() => setSignature(null)}
          />
          {visit.signature && (
            <button
              onClick={handleComplete}
              style={{
                marginTop: 12,
                width: '100%',
                border: 'none',
                borderRadius: 999,
                padding: '15px',
                cursor: 'pointer',
                background: '#1c1c1c',
                color: '#fff',
                fontFamily: 'var(--font-label)',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '0.06em',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              SUBMIT VISIT
            </button>
          )}
          {visit.status === 'synced' && (
            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
                color: '#2f7d52',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Visit saved ✓
            </div>
          )}
          {visit.status === 'error' && (
            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
                color: '#CF4631',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Error: {visit.errorMessage || 'Sync failed'}
            </div>
          )}
        </div>
      </PickerSheet>
    </div>
  )
}
