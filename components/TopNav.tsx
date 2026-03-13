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
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ padding: '0 32px 0 16px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <img src="/logo.png" alt="Zakatly" style={{ height: 56, width: 'auto', objectFit: 'contain', marginTop: 8, marginLeft: 8 }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/#why" style={{ fontSize: 15, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif' }}>
            Why Zakat
          </Link>
          <Link href="/#how" style={{ fontSize: 15, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif' }}>
            How It Works
          </Link>
          <Link href="/#impact" style={{ fontSize: 15, color: '#555', textDecoration: 'none', fontFamily: 'Open Sans, sans-serif' }}>
            Impact
          </Link>
          <Link
            href={isCalculator ? '/' : '/calculator'}
            style={{
              background: GREEN,
              color: 'white',
              padding: '10px 22px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            {isCalculator ? 'Home' : 'Calculate Zakat'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
