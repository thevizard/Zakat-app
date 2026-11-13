'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { TopNav } from '@/components/TopNav'

const FOREST = '#16351F'
const DARK_EMERALD = '#102417'
const ALABASTER = '#F7F5EF'
const STONE = '#EAE6DC'
const INK = '#121614'
const MUTED = '#5A625D'
const BRASS = '#C5A059'
const BORDER = '#E2DFD5'

export default function CalculatorMockupsPage() {
  const [concept, setConcept] = useState<1 | 2 | 3>(1)
  const [goldMode, setGoldMode] = useState<'usd' | 'grams'>('usd')
  const [silverMode, setSilverMode] = useState<'usd' | 'grams'>('usd')
  const [goldKarat, setGoldKarat] = useState<number>(24)
  const [goldVal, setGoldVal] = useState<string>('4,850')
  const [silverVal, setSilverVal] = useState<string>('650')
  const [showNote, setShowNote] = useState<boolean>(false)

  const goldSpot = 161.9
  const silverSpot = 2.68

  const parsedGold = parseFloat(goldVal.replace(/,/g, '')) || 0
  const parsedSilver = parseFloat(silverVal.replace(/,/g, '')) || 0
  const goldUsd = goldMode === 'usd' ? parsedGold : parsedGold * goldSpot * (goldKarat / 24)
  const silverUsd = silverMode === 'usd' ? parsedSilver : parsedSilver * silverSpot
  const cashUsd = 18500
  const totalAssets = cashUsd + goldUsd + silverUsd
  const zakatDue = totalAssets * 0.025

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div style={{ minHeight: '100vh', background: ALABASTER, color: INK, fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <TopNav />

      {/* ── FLOATING MOCKUP SWITCHER BAR ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(16, 36, 23, 0.96)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(197, 160, 89, 0.4)',
          borderRadius: 100,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
        }}
      >
        {[
          { id: 1, label: '#1 · Editorial Split Studio (Live Ledger)' },
          { id: 2, label: '#2 · Sanctuary Focus Card (Rich Metal Cards)' },
          { id: 3, label: '#3 · Private-Wealth Rail (Left Sidebar)' },
        ].map((tab) => {
          const active = concept === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setConcept(tab.id as 1 | 2 | 3)}
              style={{
                background: active ? BRASS : 'transparent',
                color: active ? '#102417' : 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: 100,
                padding: '9px 18px',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONCEPT 1: EDITORIAL SPLIT STUDIO (2-COLUMN WORKSPACE + LIVE LEDGER)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {concept === 1 && (
        <div style={{ paddingTop: 96, paddingBottom: 100, maxWidth: 1180, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
          {/* Clean Unified Step Pill Bar (No ugly full-width stacked ribbons) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: '12px 20px',
              marginBottom: 28,
              boxShadow: '0 4px 16px rgba(18, 22, 20, 0.03)',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[
                { num: 1, label: 'Cash & Bank', done: true, active: false },
                { num: 2, label: 'Gold & Silver', done: false, active: true },
                { num: 3, label: 'Investments', done: false, active: false },
                { num: 4, label: 'Money Owed', done: false, active: false },
                { num: 5, label: 'Liabilities', done: false, active: false },
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 14px',
                      borderRadius: 100,
                      background: s.active ? FOREST : s.done ? '#EDF3EE' : 'transparent',
                      color: s.active ? '#FFFFFF' : s.done ? FOREST : MUTED,
                      fontWeight: s.active || s.done ? 700 : 600,
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: s.active ? BRASS : s.done ? FOREST : STONE,
                        color: s.active ? '#102417' : s.done ? '#FFFFFF' : MUTED,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {s.done ? '✓' : s.num}
                    </span>
                    <span>{s.label}</span>
                  </div>
                  {idx < 4 && <span style={{ color: '#CFCBC0', fontSize: 12 }}>›</span>}
                </React.Fragment>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              Live Spot Rates Active
            </div>
          </div>

          {/* 2-Column Split Grid: Left Form + Right Live Zakat Ledger */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
            {/* Left Main Card */}
            <div
              style={{
                background: '#FFFFFF',
                border: `1px solid ${BORDER}`,
                borderRadius: 20,
                padding: '36px 36px 32px',
                boxShadow: '0 16px 40px rgba(18, 22, 20, 0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.4, color: BRASS, marginBottom: 6 }}>
                    Step 02 of 05 · Precious Metals
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', margin: '0 0 6px', color: INK }}>
                    Gold &amp; Silver Holdings
                  </h1>
                  <p style={{ fontSize: 15, color: MUTED, margin: 0 }}>
                    Enter either the current dollar value or weight in grams. We convert purity and live spot rates automatically.
                  </p>
                </div>
              </div>

              {/* Side-by-Side Precious Metal Modules */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* 24K GOLD MODULE */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, #FDFBF6 0%, #FAF6EC 100%)',
                    border: '1px solid #E6D5B0',
                    borderRadius: 16,
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #D4AF37 0%, #AA8020 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: 13,
                            boxShadow: '0 4px 12px rgba(197, 160, 89, 0.35)',
                          }}
                        >
                          Au
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Gold</div>
                          <div style={{ fontSize: 11.5, color: '#8C6D2F', fontWeight: 700 }}>
                            Spot: ${goldSpot.toFixed(2)} / g
                          </div>
                        </div>
                      </div>

                      {/* Segmented Toggle */}
                      <div style={{ display: 'inline-flex', background: '#EFE8D5', padding: 3, borderRadius: 8 }}>
                        {(['usd', 'grams'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setGoldMode(m)}
                            style={{
                              background: goldMode === m ? '#FFFFFF' : 'transparent',
                              color: goldMode === m ? INK : MUTED,
                              border: 'none',
                              borderRadius: 6,
                              padding: '5px 10px',
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: goldMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                            }}
                          >
                            {m === 'usd' ? 'USD ($)' : 'Grams (g)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input Box */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#FFFFFF',
                        border: '1.5px solid #DEC896',
                        borderRadius: 12,
                        padding: '12px 16px',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#9C7B38', marginRight: 8 }}>
                        {goldMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={goldVal}
                        onChange={(e) => setGoldVal(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: 22,
                          fontWeight: 800,
                          color: INK,
                          background: 'transparent',
                        }}
                      />
                    </div>

                    {/* Karat Purity Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>PURITY:</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[24, 22, 21, 18, 14].map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setGoldKarat(k)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 800,
                              border: goldKarat === k ? '1px solid #B68D3B' : '1px solid #E5DEC9',
                              background: goldKarat === k ? '#B68D3B' : '#FFFFFF',
                              color: goldKarat === k ? '#FFFFFF' : MUTED,
                              cursor: 'pointer',
                            }}
                          >
                            {k}K
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: '1px solid rgba(197, 160, 89, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#7A5E24',
                    }}
                  >
                    <span>Zakatable Value:</span>
                    <span>{fmt(goldUsd)}</span>
                  </div>
                </div>

                {/* FINE SILVER MODULE */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, #F9FAFB 0%, #F2F4F7 100%)',
                    border: '1px solid #D5DCE2',
                    borderRadius: 16,
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #8E9AAF 0%, #5C677D 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: 13,
                            boxShadow: '0 4px 12px rgba(100, 116, 139, 0.25)',
                          }}
                        >
                          Ag
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Silver</div>
                          <div style={{ fontSize: 11.5, color: '#526071', fontWeight: 700 }}>
                            Spot: ${silverSpot.toFixed(2)} / g
                          </div>
                        </div>
                      </div>

                      {/* Segmented Toggle */}
                      <div style={{ display: 'inline-flex', background: '#E3E8EE', padding: 3, borderRadius: 8 }}>
                        {(['usd', 'grams'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSilverMode(m)}
                            style={{
                              background: silverMode === m ? '#FFFFFF' : 'transparent',
                              color: silverMode === m ? INK : MUTED,
                              border: 'none',
                              borderRadius: 6,
                              padding: '5px 10px',
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: silverMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                            }}
                          >
                            {m === 'usd' ? 'USD ($)' : 'Grams (g)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input Box */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#FFFFFF',
                        border: '1.5px solid #C6D0DA',
                        borderRadius: 12,
                        padding: '12px 16px',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#64748B', marginRight: 8 }}>
                        {silverMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={silverVal}
                        onChange={(e) => setSilverVal(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: 22,
                          fontWeight: 800,
                          color: INK,
                          background: 'transparent',
                        }}
                      />
                    </div>

                    <div style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>
                      Includes bullion coins, bars, and silver investment holdings.
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: '1px solid #DCE2E8',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#475569',
                    }}
                  >
                    <span>Zakatable Value:</span>
                    <span>{fmt(silverUsd)}</span>
                  </div>
                </div>
              </div>

              {/* Scholarly Ruling Banner */}
              <div
                onClick={() => setShowNote(!showNote)}
                style={{
                  background: '#F7F6F1',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  marginBottom: 28,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14 }}>⚖️</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>
                      Is personal gold or silver jewelry zakatable?
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: FOREST }}>
                    {showNote ? 'Hide Ruling ▲' : 'Read Scholarly Note ▼'}
                  </span>
                </div>
                {showNote && (
                  <p style={{ fontSize: 13, color: MUTED, margin: '10px 0 0', lineHeight: 1.6 }}>
                    In the Hanafi school, all gold and silver jewelry is zakatable regardless of use. In the Shafi&apos;i, Maliki, and Hanbali schools, jewelry worn regularly for personal use is exempt, while bullion, coins, or hoarded jewelry are zakatable.
                  </p>
                )}
              </div>

              {/* Bottom Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
                <button
                  type="button"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: INK,
                    cursor: 'pointer',
                  }}
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  style={{
                    background: FOREST,
                    border: 'none',
                    borderRadius: 10,
                    padding: '13px 32px',
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 53, 31, 0.25)',
                  }}
                >
                  Continue to Investments →
                </button>
              </div>
            </div>

            {/* Right Sticky Live Zakat Ledger */}
            <div
              style={{
                background: DARK_EMERALD,
                color: '#FFFFFF',
                borderRadius: 20,
                padding: '28px 26px',
                boxShadow: '0 20px 50px rgba(16, 36, 23, 0.18)',
                border: '1px solid rgba(197, 160, 89, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: BRASS }}>
                  Live Zakat Ledger
                </span>
                <span
                  style={{
                    background: 'rgba(134, 239, 172, 0.14)',
                    color: '#86EFAC',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 100,
                  }}
                >
                  Above Nisab ✓
                </span>
              </div>

              <div style={{ marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                  Estimated Zakat Due (2.5%)
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1.05 }}>
                  {fmt(zakatDue)}
                </div>
              </div>

              {/* Itemized Live Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>01 · Cash &amp; Checking</span>
                  <span style={{ fontWeight: 700 }}>{fmt(cashUsd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: BRASS, fontWeight: 700 }}>02 · Gold &amp; Silver</span>
                  <span style={{ fontWeight: 800, color: BRASS }}>{fmt(goldUsd + silverUsd)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>03 · Investments</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>$0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>04 · Liabilities</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>-$0</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Net Zakatable Base</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{fmt(totalAssets)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONCEPT 2: SANCTUARY FOCUS CARD (UNIFIED COMMAND PILL + RICH METAL CARDS)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {concept === 2 && (
        <div style={{ paddingTop: 96, paddingBottom: 100, maxWidth: 840, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
          {/* Unified Floating Command Bar (Replaces the 2 clunky full-width bars) */}
          <div
            style={{
              background: DARK_EMERALD,
              color: '#FFFFFF',
              borderRadius: 16,
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
              boxShadow: '0 12px 32px rgba(16, 36, 23, 0.14)',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            {/* Left: Step Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {[
                { n: 1, name: 'Cash', done: true, active: false },
                { n: 2, name: 'Gold & Silver', done: false, active: true },
                { n: 3, name: 'Investments', done: false, active: false },
                { n: 4, name: 'Owed', done: false, active: false },
                { n: 5, name: 'Debts', done: false, active: false },
              ].map((s) => (
                <div
                  key={s.n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: s.active ? '6px 12px' : '6px 8px',
                    borderRadius: 100,
                    background: s.active ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
                    border: s.active ? `1px solid ${BRASS}` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: s.done ? '#22C55E' : s.active ? BRASS : 'rgba(255,255,255,0.12)',
                      color: s.done || s.active ? '#102417' : 'rgba(255,255,255,0.6)',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.done ? '✓' : s.n}
                  </div>
                  {s.active && (
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF' }}>{s.name}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Integrated Live Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                  Zakatable Wealth
                </div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(totalAssets)}</div>
              </div>
              <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: BRASS, fontWeight: 800 }}>
                  Zakat Due (2.5%)
                </div>
                <div style={{ fontSize: 19, fontWeight: 900, color: '#86EFAC' }}>{fmt(zakatDue)}</div>
              </div>
            </div>
          </div>

          {/* Sanctuary Centerpiece Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 22,
              border: `1px solid ${BORDER}`,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(18, 22, 20, 0.06)',
            }}
          >
            {/* Architectural Header Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FAF7F0 0%, #F2EDE0 100%)',
                borderBottom: `1px solid ${BORDER}`,
                padding: '28px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: FOREST, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 }}>
                  Precious Metals Assessment
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: 0, letterSpacing: '-0.6px' }}>
                  Gold &amp; Silver Holdings
                </h1>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2D9C5', borderRadius: 10, padding: '8px 14px', fontSize: 12 }}>
                  <span style={{ color: MUTED, fontWeight: 600 }}>24K Gold: </span>
                  <strong style={{ color: '#9C7B38' }}>${goldSpot.toFixed(2)}/g</strong>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #DCE2E8', borderRadius: 10, padding: '8px 14px', fontSize: 12 }}>
                  <span style={{ color: MUTED, fontWeight: 600 }}>Silver: </span>
                  <strong style={{ color: '#475569' }}>${silverSpot.toFixed(2)}/g</strong>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px 36px' }}>
              {/* Stacked Horizontal Luxury Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                {/* Gold Row */}
                <div
                  style={{
                    background: '#FDFBF6',
                    border: '1.5px solid #E6D5B0',
                    borderRadius: 16,
                    padding: '22px 24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>How much gold do you own?</div>
                      <div style={{ fontSize: 12.5, color: MUTED }}>Coins, bars, bullion, or investment jewelry</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['usd', 'grams'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setGoldMode(m)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            border: goldMode === m ? `1.5px solid ${FOREST}` : `1px solid ${BORDER}`,
                            background: goldMode === m ? FOREST : '#FFFFFF',
                            color: goldMode === m ? '#FFFFFF' : MUTED,
                            cursor: 'pointer',
                          }}
                        >
                          {m === 'usd' ? 'USD Value ($)' : 'Weight (grams)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      border: '1.5px solid #DEC896',
                      borderRadius: 12,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#9C7B38', marginRight: 10 }}>
                        {goldMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={goldVal}
                        onChange={(e) => setGoldVal(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: 24,
                          fontWeight: 800,
                          color: INK,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        background: '#FAF3E3',
                        color: '#8C6D2F',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '6px 12px',
                        borderRadius: 8,
                      }}
                    >
                      + {fmt(goldUsd * 0.025)} Zakat
                    </span>
                  </div>
                </div>

                {/* Silver Row */}
                <div
                  style={{
                    background: '#F9FAFB',
                    border: '1.5px solid #D5DCE2',
                    borderRadius: 16,
                    padding: '22px 24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>How much silver do you own?</div>
                      <div style={{ fontSize: 12.5, color: MUTED }}>Silver bars, rounds, or investment holdings</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['usd', 'grams'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSilverMode(m)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            border: silverMode === m ? `1.5px solid ${FOREST}` : `1px solid ${BORDER}`,
                            background: silverMode === m ? FOREST : '#FFFFFF',
                            color: silverMode === m ? '#FFFFFF' : MUTED,
                            cursor: 'pointer',
                          }}
                        >
                          {m === 'usd' ? 'USD Value ($)' : 'Weight (grams)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      border: '1.5px solid #C6D0DA',
                      borderRadius: 12,
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#64748B', marginRight: 10 }}>
                        {silverMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={silverVal}
                        onChange={(e) => setSilverVal(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: 24,
                          fontWeight: 800,
                          color: INK,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        background: '#EEF2F6',
                        color: '#475569',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '6px 12px',
                        borderRadius: 8,
                      }}
                    >
                      + {fmt(silverUsd * 0.025)} Zakat
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <button
                  type="button"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: INK,
                    cursor: 'pointer',
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  style={{
                    background: FOREST,
                    border: 'none',
                    borderRadius: 10,
                    padding: '13px 32px',
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONCEPT 3: PRIVATE-WEALTH RAIL (LEFT VERTICAL SIDEBAR + CLEAN CANVAS)
         ═══════════════════════════════════════════════════════════════════════════ */}
      {concept === 3 && (
        <div style={{ paddingTop: 96, paddingBottom: 100, maxWidth: 1140, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '290px 1fr',
              background: '#FFFFFF',
              borderRadius: 22,
              border: `1px solid ${BORDER}`,
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(18, 22, 20, 0.07)',
              minHeight: 560,
            }}
          >
            {/* Left Vertical Step & Wealth Rail */}
            <div
              style={{
                background: DARK_EMERALD,
                color: '#FFFFFF',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: BRASS, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
                  Assessment Progress
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { num: '01', label: 'Cash & Bank', amount: fmt(cashUsd), done: true, active: false },
                    { num: '02', label: 'Gold & Silver', amount: fmt(goldUsd + silverUsd), done: false, active: true },
                    { num: '03', label: 'Investments', amount: '—', done: false, active: false },
                    { num: '04', label: 'Money Owed', amount: '—', done: false, active: false },
                    { num: '05', label: 'Liabilities', amount: '—', done: false, active: false },
                  ].map((item) => (
                    <div
                      key={item.num}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: item.active ? 'rgba(197, 160, 89, 0.16)' : 'transparent',
                        border: item.active ? '1px solid rgba(197, 160, 89, 0.45)' : '1px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: item.done ? '#22C55E' : item.active ? BRASS : 'rgba(255,255,255,0.1)',
                            color: item.done || item.active ? '#102417' : 'rgba(255,255,255,0.5)',
                            fontSize: 11,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.done ? '✓' : item.num}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: item.active ? 800 : 600, color: item.active ? '#FFFFFF' : 'rgba(255,255,255,0.75)' }}>
                          {item.label}
                        </span>
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: item.active ? BRASS : 'rgba(255,255,255,0.5)' }}>
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Anchored Live Summary */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
                  Zakat Due (2.5%)
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#86EFAC', lineHeight: 1.1, marginBottom: 8 }}>
                  {fmt(zakatDue)}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  Total Zakatable: <strong>{fmt(totalAssets)}</strong>
                </div>
              </div>
            </div>

            {/* Right Main Form Canvas */}
            <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.6px' }}>
                      Gold &amp; Silver
                    </h1>
                    <p style={{ fontSize: 14.5, color: MUTED, margin: 0 }}>
                      Enter current value or weight in grams. Spot prices update automatically.
                    </p>
                  </div>
                  <span style={{ background: '#F4EFE4', color: '#8C6D2F', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    24K Spot: ${goldSpot.toFixed(2)}/g
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  {/* Gold Card */}
                  <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>Gold Holdings</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {(['usd', 'grams'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setGoldMode(m)}
                            style={{
                              padding: '4px 10px',
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 6,
                              border: 'none',
                              background: goldMode === m ? FOREST : STONE,
                              color: goldMode === m ? '#FFFFFF' : INK,
                              cursor: 'pointer',
                            }}
                          >
                            {m.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: ALABASTER, borderRadius: 10, padding: '12px 14px' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: MUTED, marginRight: 8 }}>
                        {goldMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={goldVal}
                        onChange={(e) => setGoldVal(e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 22, fontWeight: 800 }}
                      />
                    </div>
                  </div>

                  {/* Silver Card */}
                  <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>Silver Holdings</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {(['usd', 'grams'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setSilverMode(m)}
                            style={{
                              padding: '4px 10px',
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 6,
                              border: 'none',
                              background: silverMode === m ? FOREST : STONE,
                              color: silverMode === m ? '#FFFFFF' : INK,
                              cursor: 'pointer',
                            }}
                          >
                            {m.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: ALABASTER, borderRadius: 10, padding: '12px 14px' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: MUTED, marginRight: 8 }}>
                        {silverMode === 'usd' ? '$' : 'g'}
                      </span>
                      <input
                        type="text"
                        value={silverVal}
                        onChange={(e) => setSilverVal(e.target.value)}
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 22, fontWeight: 800 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
                <button
                  type="button"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  style={{
                    background: FOREST,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 30px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
