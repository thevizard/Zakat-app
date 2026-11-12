'use client'

import { useState } from 'react'
import { ZakatResult } from '@/types/zakat.types'
import { formatNextHawlDate } from '@/lib/zakat/nisab'

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

const FOREST = '#1E3F20'
const TEXT_DARK = '#141414'
const SUBTLE = '#6E6E6E'
const BORDER = '#E2E2D8'

export function EmailReportModal({ result, onClose }: EmailReportModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorDetail, setErrorDetail] = useState('')

  const nextDueStr = formatNextHawlDate()

  async function handleDownloadPDFDirectly() {
    const { downloadZakatPDF } = await import('@/lib/zakat/generatePDF')
    downloadZakatPDF(result)
  }

  async function handleSend() {
    if (!email || !email.includes('@')) return
    setStatus('sending')
    setErrorDetail('')
    try {
      let pdfBase64 = ''
      try {
        const { generateZakatPDF } = await import('@/lib/zakat/generatePDF')
        pdfBase64 = generateZakatPDF(result)
      } catch (pdfErr) {
        console.warn('PDF generation failed, sending without attachment:', pdfErr)
      }

      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, result, pdfBase64 }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorDetail(body?.error || body?.detail?.message || 'Delivery error')
        throw new Error('Failed')
      }
      setStatus('sent')
    } catch (err) {
      console.error('Send report error:', err)
      setStatus('error')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: `1px solid ${BORDER}`,
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif',
          color: TEXT_DARK,
        }}
      >
        {/* Header */}
        <div style={{ background: TEXT_DARK, padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#A8D5B5',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Annual Report
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Email Your Zakat Assessment
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)',
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
        </div>

        {status === 'sent' ? (
          <div style={{ padding: '44px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#F2F5F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: FOREST,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 8 }}>
              Report Sent Successfully!
            </div>
            <div style={{ fontSize: 14, color: SUBTLE, lineHeight: 1.6, marginBottom: 8 }}>
              Your Zakat breakdown and verified PDF have been emailed to <strong>{email}</strong>.
            </div>
            <div style={{ fontSize: 13, color: SUBTLE, lineHeight: 1.6, marginBottom: 28 }}>
              Includes your next 354-day lunar Hawl reminder for <strong>{nextDueStr}</strong>.
            </div>
            <button
              onClick={onClose}
              style={{
                background: FOREST,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div style={{ padding: '24px 28px 28px' }}>
            {/* What's included */}
            <div
              style={{
                background: '#F9F9F6',
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: FOREST, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Included in your email:
              </div>
              {[
                `Total Zakat due: ${fmt(result.zakatDue)}`,
                'Itemized calculation breakdown table',
                'Official PDF certificate attachment',
                `354-day lunar Hawl reminder (${nextDueStr})`,
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: FOREST, fontWeight: 800, fontSize: 13 }}>•</span>
                  <span style={{ fontSize: 13, color: TEXT_DARK }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Email input */}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6 }}>
              Where should we send your report?
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: 14,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                outline: 'none',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                marginBottom: 10,
              }}
              disabled={status === 'sending'}
            />

            {status === 'error' && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 14,
                }}
              >
                <div style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, marginBottom: 6 }}>
                  {errorDetail || 'Email delivery could not be completed.'}
                </div>
                <div style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.5, marginBottom: 10 }}>
                  You can download your PDF calculation report directly right now:
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPDFDirectly}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #DC2626',
                    color: '#DC2626',
                    borderRadius: 6,
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⬇ Download PDF Report Directly
                </button>
              </div>
            )}

            <div style={{ fontSize: 12, color: SUBTLE, marginBottom: 20, lineHeight: 1.5 }}>
              Your email is used only to deliver this report. No spam or marketing.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  color: TEXT_DARK,
                  border: `1px solid ${BORDER}`,
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!email.includes('@') || status === 'sending'}
                style={{
                  flex: 2,
                  background: email.includes('@') && status !== 'sending' ? FOREST : '#D1D5DB',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: email.includes('@') && status !== 'sending' ? 'pointer' : 'default',
                  boxShadow: email.includes('@') && status !== 'sending' ? '0 2px 10px rgba(30,63,32,0.2)' : 'none',
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
