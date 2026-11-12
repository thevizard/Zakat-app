'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCalculatorStore } from '@/store/calculatorStore'
import { ZakatlyLogo } from '@/components/ZakatlyLogo'

const FOREST = '#16351F'
const INK = '#121614'
const MUTED = '#5A625D'
const HAIRLINE = '#E2DFD5'

export function TopNav() {
  const pathname = usePathname()
  const isCalculator = pathname.startsWith('/calculator')
  const isMosquePortal = pathname.startsWith('/m/')
  const partnerMasjid = useCalculatorStore((s) => s.partnerMasjid)
  const setPartnerMasjid = useCalculatorStore((s) => s.setPartnerMasjid)

  // Only show marketing anchor links on the main landing page or /partner
  const showMarketingLinks = !isCalculator && !isMosquePortal

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(247, 245, 239, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        style={{
          padding: '0 clamp(14px, 4vw, 28px)',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          gap: 12,
        }}
      >
        {/* Left side: Architectural Co-Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2vw, 16px)', minWidth: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <ZakatlyLogo variant="rub-al-ushr" height={34} />
          </Link>

          {partnerMasjid && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderLeft: '1px solid #CFCBC0',
                paddingLeft: 'clamp(10px, 2vw, 16px)',
                minWidth: 0,
              }}
            >
              <span
                className="hidden md:inline"
                style={{
                  fontSize: 13,
                  color: MUTED,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                in partnership with
              </span>
              <span
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: 800,
                  color: FOREST,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'clamp(95px, 26vw, 280px)',
                }}
              >
                {partnerMasjid.name}
              </span>
              {!isMosquePortal && (
                <button
                  type="button"
                  onClick={() => setPartnerMasjid(null)}
                  title="Remove mosque affiliation"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: MUTED,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    fontSize: 14,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.65,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right side: Concise Navigation + Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
          {showMarketingLinks && !partnerMasjid && (
            <div className="hidden md:flex items-center">
              <Link
                href="/partner"
                style={{
                  fontSize: 14,
                  color: pathname.startsWith('/partner') ? FOREST : MUTED,
                  fontWeight: pathname.startsWith('/partner') ? 700 : 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                For Mosques
              </Link>
            </div>
          )}

          <Link
            href={isCalculator ? '/' : '/calculator'}
            style={{
              background: isCalculator ? '#FFFFFF' : FOREST,
              color: isCalculator ? INK : '#FFFFFF',
              border: isCalculator ? `1px solid ${HAIRLINE}` : 'none',
              padding: '9px clamp(12px, 3vw, 20px)',
              borderRadius: 8,
              fontSize: 'clamp(12.5px, 2.5vw, 14px)',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              letterSpacing: -0.2,
              transition: 'opacity 0.2s',
            }}
          >
            {isCalculator ? 'Home' : 'Calculate Zakat →'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
