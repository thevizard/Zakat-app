'use client'

import React from 'react'

export type LogoVariant = 'rub-al-ushr' | 'mihrab-monogram' | 'ascending-columns'

interface ZakatlyLogoProps {
  variant?: LogoVariant
  inverted?: boolean
  height?: number
}

export function ZakatlyLogo({
  variant = 'rub-al-ushr',
  inverted = false,
  height = 38,
}: ZakatlyLogoProps) {
  const primaryText = inverted ? '#FFFFFF' : '#121614'
  const forest = inverted ? '#255432' : '#183A21'
  const brass = '#C5A059'
  const muted = inverted ? 'rgba(255,255,255,0.6)' : '#5A625D'

  const scale = height / 38

  // ───────────────────────────────────────────────────────────────────────────
  // CONCEPT 1: THE RUB' AL-'USHR (8-Pointed Octagonal Seal + Illuminated Facet)
  // ───────────────────────────────────────────────────────────────────────────
  if (variant === 'rub-al-ushr') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: Math.round(11 * scale),
          userSelect: 'none',
        }}
      >
        <svg
          width={Math.round(38 * scale)}
          height={Math.round(38 * scale)}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rounded architectural square */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="9"
            fill={inverted ? '#16331F' : '#183A21'}
            stroke={brass}
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />
          {/* Rotated Rub el Hizb inner square 1 */}
          <rect
            x="11"
            y="11"
            width="18"
            height="18"
            rx="2"
            stroke="#F4F3EE"
            strokeWidth="1.6"
            strokeOpacity="0.9"
          />
          {/* Rotated Rub el Hizb inner square 2 (45 deg) */}
          <rect
            x="11"
            y="11"
            width="18"
            height="18"
            rx="2"
            transform="rotate(45 20 20)"
            stroke={brass}
            strokeWidth="1.6"
          />
          {/* Central illuminated 2.5% diamond core */}
          <polygon points="20,15 25,20 20,25 15,20" fill={brass} />
          <circle cx="20" cy="20" r="1.6" fill="#183A21" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontSize: Math.round(22 * scale),
              fontWeight: 800,
              letterSpacing: '-0.8px',
              color: primaryText,
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span>Zakatly</span>
            <span
              style={{
                display: 'inline-block',
                width: Math.round(5 * scale),
                height: Math.round(5 * scale),
                background: brass,
                transform: 'rotate(45deg)',
                marginLeft: 4,
                marginBottom: 2,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CONCEPT 2: THE MIHRAB & MIZAN MONOGRAM (Sacred Arch + Geometric 'Z')
  // ───────────────────────────────────────────────────────────────────────────
  if (variant === 'mihrab-monogram') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: Math.round(11 * scale),
          userSelect: 'none',
        }}
      >
        <svg
          width={Math.round(36 * scale)}
          height={Math.round(38 * scale)}
          viewBox="0 0 38 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mihrab Arch Shield */}
          <path
            d="M3 19C3 9.5 10.5 2 19 2C27.5 2 35 9.5 35 19V34C35 36.2091 33.2091 38 31 38H7C4.79086 38 3 36.2091 3 34V19Z"
            fill={inverted ? '#16331F' : '#183A21'}
            stroke={brass}
            strokeWidth="1.3"
          />
          {/* Inner architectural arch hairline */}
          <path
            d="M7 19.5C7 12.2 12.4 6.5 19 6.5C25.6 6.5 31 12.2 31 19.5V33.5H7V19.5Z"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
          {/* Precision Geometric 'Z' + Balance Beam inside the Arch */}
          <path
            d="M12.5 16H25.5L12.5 29H25.5"
            stroke="#F4F3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Golden keystone at apex of arch */}
          <circle cx="19" cy="10.5" r="2" fill={brass} />
        </svg>

        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span
            style={{
              fontSize: Math.round(23 * scale),
              fontWeight: 900,
              letterSpacing: '-0.9px',
              color: primaryText,
            }}
          >
            Zakat
          </span>
          <span
            style={{
              fontSize: Math.round(23 * scale),
              fontWeight: 400,
              letterSpacing: '-0.6px',
              color: inverted ? brass : forest,
            }}
          >
            ly
          </span>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CONCEPT 3: TAZKIYAH ASCENDING COLUMNS (Swiss Private Wealth / 1-in-40 Bar)
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(12 * scale),
        userSelect: 'none',
      }}
    >
      <svg
        width={Math.round(38 * scale)}
        height={Math.round(38 * scale)}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crisp Swiss frame */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="7"
          fill={inverted ? '#14291A' : '#121614'}
        />
        {/* 3 Ascending Wealth Columns + Golden 2.5% Purification Cornerstone */}
        {/* Column 1 */}
        <rect x="9" y="21" width="5" height="10" rx="1.2" fill="#F4F3EE" fillOpacity="0.65" />
        {/* Column 2 */}
        <rect x="17.5" y="15" width="5" height="16" rx="1.2" fill="#F4F3EE" fillOpacity="0.85" />
        {/* Column 3 */}
        <rect x="26" y="9" width="5" height="22" rx="1.2" fill="#F4F3EE" />
        {/* The Golden 2.5% Tazkiyah Spark above Column 1 */}
        <rect x="9" y="9" width="5" height="5" rx="1.2" fill={brass} />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize: Math.round(20 * scale),
            fontWeight: 800,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            color: primaryText,
            lineHeight: 1,
          }}
        >
          ZAKATLY
        </span>
        <span
          style={{
            fontSize: Math.round(8.5 * scale),
            fontWeight: 700,
            letterSpacing: '2.2px',
            textTransform: 'uppercase',
            color: muted,
            lineHeight: 1,
          }}
        >
          WEALTH &amp; FIQH
        </span>
      </div>
    </div>
  )
}
