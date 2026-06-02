import React, { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { exportToExcel } from '../lib/excel'
import type { SupabaseVisit, SupabaseAnswer, SupabasePhoto } from '../types'

interface Props {
  onBack: () => void
  safeTop?: number
  safeBottom?: number
}

interface Stats {
  total: number
  missingStockPct: number
  competitorPct: number
  byRep: { name: string; count: number }[]
  byStore: { name: string; count: number }[]
}

export function Dashboard({ onBack, safeTop = 0, safeBottom = 0 }: Props) {
  const [visits, setVisits]   = useState<SupabaseVisit[]>([])
  const [answers, setAnswers] = useState<SupabaseAnswer[]>([])
  const [photos, setPhotos]   = useState<SupabasePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabaseConfigured) { setLoading(false); return }
    setLoading(true); setError(null)
    try {
      const [vRes, aRes, pRes] = await Promise.all([
        supabase.from('visits').select('*').order('visit_date', { ascending: false }).limit(200),
        supabase.from('visit_answers').select('*'),
        supabase.from('visit_photos').select('*'),
      ])
      if (vRes.error) throw vRes.error
      setVisits(vRes.data ?? [])
      setAnswers(aRes.data ?? [])
      setPhotos(pRes.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const stats: Stats = {
    total: visits.length,
    missingStockPct: visits.length
      ? Math.round(answers.filter(a => a.question === 'missing_stock' && a.answer === 'yes').length / visits.length * 100)
      : 0,
    competitorPct: visits.length
      ? Math.round(answers.filter(a => a.question === 'competitor_present' && a.answer === 'yes').length / visits.length * 100)
      : 0,
    byRep: Object.entries(
      visits.reduce<Record<string, number>>((acc, v) => {
        acc[v.representative_name] = (acc[v.representative_name] ?? 0) + 1; return acc
      }, {})
    ).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    byStore: Object.entries(
      visits.reduce<Record<string, number>>((acc, v) => {
        acc[v.store_name] = (acc[v.store_name] ?? 0) + 1; return acc
      }, {})
    ).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  }

  const handleExport = () => exportToExcel(visits, answers, photos)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#fff', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      {/* Header */}
      <div style={{ height: safeTop, background: '#141414', flexShrink: 0 }} />
      <div style={{
        background: '#141414', color: '#fff', padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ border: 'none', background: 'transparent', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0 }}>‹</button>
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 800, fontStyle: 'italic', fontSize: 22 }}>Dashboard</span>
        <button onClick={handleExport} disabled={!visits.length} style={{
          border: 'none', borderRadius: 999, padding: '7px 14px', cursor: visits.length ? 'pointer' : 'default',
          background: visits.length ? '#2FA84F' : '#4a4a4a', color: '#fff',
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12,
        }}>
          Export .xlsx
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], padding: '16px 16px', paddingBottom: safeBottom + 16 }}>

        {!supabaseConfigured && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40 }}>🔌</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, color: '#141414', marginTop: 12 }}>Supabase not configured</div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#7d7d7d', marginTop: 6 }}>
              Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file.
            </p>
          </div>
        )}

        {supabaseConfigured && loading && (
          <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-ui)', color: '#7d7d7d' }}>Loading…</div>
        )}

        {supabaseConfigured && error && (
          <div style={{ background: '#fff5f5', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, color: '#ED1C24' }}>Error: </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#ED1C24' }}>{error}</span>
          </div>
        )}

        {supabaseConfigured && !loading && (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Total Visits', value: stats.total, color: '#141414' },
                { label: 'Photos', value: photos.length, color: '#141414' },
                { label: 'Missing Stock', value: `${stats.missingStockPct}%`, color: stats.missingStockPct > 30 ? '#ED1C24' : '#2FA84F' },
                { label: 'Competitor', value: `${stats.competitorPct}%`, color: stats.competitorPct > 30 ? '#F5A623' : '#141414' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f4f4f4', borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-num)', fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Visits by rep */}
            {stats.byRep.length > 0 && (
              <Section title="Visits by Rep">
                {stats.byRep.map(r => <BarRow key={r.name} label={r.name} value={r.count} max={stats.byRep[0].count} />)}
              </Section>
            )}

            {/* Visits by store */}
            {stats.byStore.length > 0 && (
              <Section title="Visits by Store">
                {stats.byStore.slice(0, 8).map(r => <BarRow key={r.name} label={r.name} value={r.count} max={stats.byStore[0].count} />)}
              </Section>
            )}

            {/* Recent visits table */}
            {visits.length > 0 && (
              <Section title="Recent Visits">
                {visits.slice(0, 20).map(v => {
                  const ms = answers.find(a => a.visit_id === v.id && a.question === 'missing_stock')?.answer
                  const cp = answers.find(a => a.visit_id === v.id && a.question === 'competitor_present')?.answer
                  return (
                    <div key={v.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: '#141414' }}>{v.store_name}</div>
                        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#7d7d7d' }}>{v.representative_name} · {v.visit_date}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {ms === 'yes' && <Badge label="OOS" color="#ED1C24" />}
                        {cp === 'yes' && <Badge label="COMP" color="#F5A623" />}
                      </div>
                    </div>
                  )
                })}
              </Section>
            )}

            {visits.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 40 }}>📋</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: '#7d7d7d', marginTop: 12 }}>No visits yet</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7d7d7d', marginBottom: 10 }}>{title}</div>
      <div style={{ background: '#f4f4f4', borderRadius: 14, padding: '4px 14px' }}>{children}</div>
    </div>
  )
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid #eaeaea' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#1b1b1b' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-num)', fontSize: 13, fontWeight: 700, color: '#141414' }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: '#d2d2d2', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 2, background: '#141414', width: `${(value / max) * 100}%`, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 999, padding: '2px 7px', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 800 }}>{label}</span>
  )
}
