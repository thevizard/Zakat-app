'use client'

import { useState } from 'react'
import { ZakatResult } from '@/types/zakat.types'

interface DonateModalProps {
  result: ZakatResult
  onClose: () => void
}

interface CharityOrg {
  name: string
  tagline: string
  url: string
  category: 'Global Relief' | 'Local & Domestic' | 'Crowdfunding' | 'Food & Orphans'
  badges: string[]
}

const VERIFIED_CHARITIES: CharityOrg[] = [
  {
    name: 'LaunchGood Zakat Fund',
    tagline: 'Distributes Zakat across vetted global and local campaigns for refugees, orphans, and families in crisis.',
    url: 'https://www.launchgood.com/zakat',
    category: 'Crowdfunding',
    badges: ['Vetted Campaigns', 'Global & Local'],
  },
  {
    name: 'Islamic Relief USA',
    tagline: '4-star Charity Navigator humanitarian organization delivering emergency relief, clean water, and orphan support.',
    url: 'https://irusa.org/zakat/',
    category: 'Global Relief',
    badges: ['501(c)(3) Tax-Deductible', 'Global Reach'],
  },
  {
    name: 'Zakat Foundation of America',
    tagline: 'Dedicated Zakat distribution serving impoverished families, widows, and disaster survivors in 40+ countries.',
    url: 'https://www.zakat.org/give-zakat',
    category: 'Global Relief',
    badges: ['100% Zakat Policy', '501(c)(3)'],
  },
  {
    name: 'Hidaya Foundation',
    tagline: 'Bay Area-based 501(c)(3) charity with zero administrative deduction from Zakat funds.',
    url: 'https://www.hidaya.org/donate/zakat/',
    category: 'Food & Orphans',
    badges: ['100% Zakat Policy', 'CA Based'],
  },
  {
    name: 'Baitulmaal',
    tagline: 'Provides life-saving food, emergency aid, and poverty relief to Zakat-eligible beneficiaries worldwide.',
    url: 'https://baitulmaal.org/zakat/',
    category: 'Global Relief',
    badges: ['501(c)(3) Tax-Deductible', '4-Star Rated'],
  },
  {
    name: 'National Zakat Foundation (NZF)',
    tagline: 'Collects and distributes Zakat locally to Muslims in need of housing, food, and hardship assistance.',
    url: 'https://nzf.org.uk/',
    category: 'Local & Domestic',
    badges: ['Local Zakat Distribution', 'Direct Aid'],
  },
]

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function DonateModal({ result, onClose }: DonateModalProps) {
  const [copied, setCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Global Relief', 'Local & Domestic', 'Food & Orphans', 'Crowdfunding']

  const filteredCharities =
    selectedCategory === 'All'
      ? VERIFIED_CHARITIES
      : VERIFIED_CHARITIES.filter((c) => c.category === selectedCategory)

  function copyZakatAmount() {
    navigator.clipboard.writeText(result.zakatDue.toFixed(2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(8, 22, 13, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          fontFamily: 'Open Sans, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ background: '#0f2419', padding: '24px 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#68BA7F',
                  letterSpacing: 2.5,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Fulfill Your Obligation
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                Give Your Zakat to Verified Charities
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                borderRadius: 8,
                width: 32,
                height: 32,
                cursor: 'pointer',
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Zakat Due banner */}
          <div
            style={{
              marginTop: 18,
              background: 'rgba(45,122,79,0.28)',
              border: '1px solid rgba(104,186,127,0.35)',
              borderRadius: 14,
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginRight: 8 }}>
                Your Calculated Zakat:
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>
                {result.meetsNisab ? fmt(result.zakatDue) : '$0.00 (Sadaqah Optional)'}
              </span>
            </div>
            {result.meetsNisab && (
              <button
                onClick={copyZakatAmount}
                style={{
                  background: copied ? '#68BA7F' : 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copied ? 'Amount Copied' : 'Copy Exact Amount'}
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div
          style={{
            padding: '14px 28px',
            borderBottom: '1px solid #eef5f0',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            flexShrink: 0,
            background: '#fafdfb',
          }}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 50,
                  border: active ? '1.5px solid #2d7a4f' : '1px solid #e2e8f0',
                  background: active ? '#2d7a4f' : 'white',
                  color: active ? 'white' : '#4b5563',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Charity List */}
        <div
          style={{
            padding: '20px 28px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {filteredCharities.map((org) => (
            <div
              key={org.name}
              style={{
                border: '1px solid #e4f0e8',
                borderRadius: 16,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                background: 'white',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#0f2419' }}>{org.name}</span>
                  {org.badges.map((badge) => (
                    <span
                      key={badge}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        background: '#e8f5ed',
                        color: '#2d7a4f',
                        padding: '2px 8px',
                        borderRadius: 50,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{org.tagline}</p>
              </div>

              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#2d7a4f',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 18px',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Give Zakat ↗
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            padding: '14px 28px',
            background: '#f7fdf9',
            borderTop: '1px solid #e4f0e8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Zakatly does not take any commission. Links open the organization&apos;s official Zakat portal.
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: 50,
              padding: '7px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
