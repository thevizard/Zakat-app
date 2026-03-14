'use client'

import { useState } from 'react'
import { ZakatResult } from '@/types/zakat.types'

interface EmailReportModalProps {
  result: ZakatResult
  onClose: () => void
}

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

const GREEN = '#2d7a4f'
const DARK = '#0f2419'

export function EmailReportModal({ result, onClose }: EmailReportModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const nextDue = new Date()
  nextDue.setFullYear(nextDue.getFullYear() + 1)
  const nextDueStr = nextDue.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  async function handleSend() {
    if (!email || !email.includes('@')) return
    setStatus('sending')
    try {
      const { generateZakatPDF } = await import('@/lib/zakat/generatePDF')
      const pdfBase64 = generateZakatPDF(result)

      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, result, pdfBase64 }),
      })

      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(8, 22, 13, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'white',
        borderRadius: 24,
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        fontFamily: 'Open Sans, sans-serif',
      }}>

        {/* Header */}
        <div style={{ background: DARK, padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#68BA7F', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
                Zakat Report
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                Email Your Report
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
          </div>
        </div>

        {status === 'sent' ? (
          // Success state
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 10 }}>Report Sent!</div>
            <div style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 8 }}>
              Your Zakat report and PDF have been sent to <strong>{email}</strong>.
            </div>
            <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 32 }}>
              The email includes your full breakdown and a reminder for <strong>{nextDueStr}</strong> — your next Zakat due date.
            </div>
            <button
              onClick={onClose}
              style={{ background: GREEN, color: 'white', border: 'none', borderRadius: 50, padding: '14px 36px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        ) : (
          <div style={{ padding: '28px 32px 32px' }}>

            {/* What's included */}
            <div style={{ background: '#f7fdf9', border: '1px solid #e0f0e8', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 10 }}>What you'll receive:</div>
              {[
                `Your Zakat due: ${result.meetsNisab ? fmt(result.zakatDue) : 'No Zakat Due'}`,
                'Full asset breakdown with per-category calculation',
                'PDF attachment for your records',
                `Reminder for next year's due date (${nextDueStr})`,
                'Guidance on giving during Ramadan',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                  <span style={{ color: GREEN, fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Email input */}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 8 }}>
              Your email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: 15,
                border: '1.5px solid #e0e0e0',
                borderRadius: 12,
                outline: 'none',
                fontFamily: 'Open Sans, sans-serif',
                boxSizing: 'border-box',
                marginBottom: 8,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = GREEN)}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
              disabled={status === 'sending'}
            />

            {status === 'error' && (
              <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 8 }}>
                Something went wrong. Please try again.
              </div>
            )}

            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 24, lineHeight: 1.5 }}>
              Your email is used only to send this report. We don't store it or send marketing emails.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, background: 'white', color: '#555', border: '1px solid #e0e0e0', padding: '14px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!email.includes('@') || status === 'sending'}
                style={{
                  flex: 2,
                  background: email.includes('@') && status !== 'sending' ? GREEN : '#ccc',
                  color: 'white', border: 'none',
                  padding: '14px', borderRadius: 50,
                  fontSize: 15, fontWeight: 600,
                  cursor: email.includes('@') && status !== 'sending' ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Report & PDF →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
