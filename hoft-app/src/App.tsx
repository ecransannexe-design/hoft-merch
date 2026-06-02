import React, { useState } from 'react'
import type { Store, Folder } from './types'
import { useSafeArea } from './hooks/useSafeArea'
import { usePhotoQueue } from './hooks/usePhotoQueue'
import { SplashScreen } from './components/SplashScreen'
import { AppHeader } from './components/AppHeader'
import { FolderAccordion } from './components/FolderAccordion'
import { InfoFolder } from './components/folders/InfoFolder'
import { StartFolder } from './components/folders/StartFolder'
import { ChecklistFolder } from './components/folders/ChecklistFolder'
import { PicturesFolder } from './components/folders/PicturesFolder'
import { CompleteFolder } from './components/folders/CompleteFolder'

type Screen = 'splash' | 'app'

export default function App() {
  // ── Navigation ──────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('splash')

  // ── User / store selection ───────────────────────────────────
  const [rep, setRep]     = useState<string | null>(null)
  const [store, setStore] = useState<Store | null>(null)

  // ── Visit state ──────────────────────────────────────────────
  const [active, setActive]       = useState(0)
  const [captures, setCaptures]   = useState<Record<number, string>>({})
  const [answers, setAnswers]     = useState<Record<string, boolean>>({})
  const [missing, setMissing]     = useState<string[]>([])
  const [pics, setPics]           = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  // ── Platform helpers ─────────────────────────────────────────
  const safeArea = useSafeArea()
  const { enqueue } = usePhotoQueue()

  // ── Derived counts for folder badges ─────────────────────────
  const capturesDone = Object.values(captures).filter(Boolean).length
  const answered     = Object.values(answers).filter(Boolean).length

  // ── Enqueue photos as they are captured ──────────────────────
  const handleCapture = (i: number, dataUrl: string) => {
    setCaptures(prev => ({ ...prev, [i]: dataUrl }))
    if (rep && store) {
      enqueue({
        visitId: `${store.id}-${Date.now()}`,
        storeId: store.id,
        rep,
        type: 'arrival',
        dataUrl,
      })
    }
  }

  const handleAfterPhoto = (dataUrl: string) => {
    setPics(prev => [...prev, dataUrl])
    if (rep && store) {
      enqueue({
        visitId: `${store.id}-${Date.now()}`,
        storeId: store.id,
        rep,
        type: 'after',
        dataUrl,
      })
    }
  }

  // ── Folder definitions ───────────────────────────────────────
  const folders: Folder[] = store
    ? [
        {
          key: 'info',
          label: 'info',
          content: <InfoFolder store={store} />,
        },
        {
          key: 'start',
          label: 'start',
          badge: capturesDone || null,
          content: (
            <StartFolder
              captures={captures}
              setCaptures={(updater) => {
                setCaptures(prev => {
                  const next = typeof updater === 'function' ? updater(prev) : updater
                  // Enqueue any new photos
                  Object.entries(next).forEach(([i, url]) => {
                    if (url && !prev[Number(i)] && rep) {
                      enqueue({
                        visitId: `${store.id}-${Date.now()}`,
                        storeId: store.id,
                        rep,
                        type: 'arrival',
                        dataUrl: url,
                      })
                    }
                  })
                  return next
                })
              }}
            />
          ),
        },
        {
          key: 'check',
          label: 'check list',
          badge: answered + (missing.length ? 1 : 0) || null,
          content: (
            <ChecklistFolder
              answers={answers}
              setAnswers={setAnswers}
              missing={missing}
              setMissing={setMissing}
            />
          ),
        },
        {
          key: 'pics',
          label: 'pictures',
          badge: pics.length || null,
          content: (
            <PicturesFolder
              pics={pics}
              setPics={(updater) => {
                setPics(prev => {
                  const next = typeof updater === 'function' ? updater(prev) : updater
                  // Enqueue any new after-photos
                  if (next.length > prev.length && rep) {
                    next.slice(prev.length).forEach(url => {
                      enqueue({
                        visitId: `${store.id}-${Date.now()}`,
                        storeId: store.id,
                        rep,
                        type: 'after',
                        dataUrl: url,
                      })
                    })
                  }
                  return next
                })
              }}
            />
          ),
        },
        {
          key: 'done',
          label: 'complete',
          content: (
            <CompleteFolder
              rep={rep!}
              store={store}
              completed={completed}
              summary={{
                captures: capturesDone,
                answered,
                missing: missing.length,
                pics: pics.length,
              }}
              onComplete={() => setCompleted(true)}
            />
          ),
        },
      ]
    : []

  // ── Render ───────────────────────────────────────────────────
  if (screen === 'splash') {
    return (
      <div className="screen">
        <SplashScreen
          rep={rep}
          store={store}
          onPickRep={setRep}
          onPickStore={setStore}
          onEnter={() => setScreen('app')}
          safeTop={safeArea.top}
        />
      </div>
    )
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppHeader
        rep={rep!}
        store={store!}
        onChangeVisit={() => setScreen('splash')}
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
      </div>

      {/* home indicator safe area */}
      <div style={{ height: safeArea.bottom, background: '#fff', flexShrink: 0 }} />
    </div>
  )
}
