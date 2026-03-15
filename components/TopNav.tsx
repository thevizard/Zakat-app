'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GREEN = '#2d7a4f'

export function TopNav() {
  const pathname = usePathname()
  const isCalculator = pathname.startsWith('/calculator')

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>

        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="Zakatly"
            style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Nav links — hidden on mobile via Tailwind */}
          <div className="hidden md:flex items-center" style={{ gap: 28, marginRight: 16 }}>
            {!isCalculator && (
              <>
                <Link href="/#why" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap' }}>
                  Why Zakat
                </Link>
                <Link href="/#how" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap' }}>
                  How It Works
                </Link>
                <Link href="/#impact" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif', whiteSpace: 'nowrap' }}>
                  Impact
                </Link>
              </>
            )}
          </div>

          {/* CTA button — always visible */}
          <Link
            href={isCalculator ? '/' : '/calculator'}
            style={{
              background: GREEN,
              color: 'white',
              padding: '9px 18px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'Open Sans, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {isCalculator ? 'Home' : 'Calculate Zakat'}
          </Link>
        </div>

      </div>
    </nav>
  )
}
