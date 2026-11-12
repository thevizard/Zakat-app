import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { ZakatResult } from '@/types/zakat.types'
import { formatNextHawlDate } from '@/lib/zakat/nisab'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function buildEmailHTML(result: ZakatResult): string {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const nextDueStr = formatNextHawlDate()

  const rowsHTML = result.breakdown.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fdfb'}">
      <td style="padding:10px 14px;font-size:14px;color:#333;">${item.label}</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;color:#888;">${fmt(item.entered)}</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;font-weight:600;color:#333;">${fmt(item.zakatable)}</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;font-weight:700;color:#2d7a4f;">${fmt(item.zakatable * 0.025)}</td>
    </tr>
  `).join('')

  const liabilitiesRow = result.totalLiabilities > 0 ? `
    <tr style="background:#fff5f5;">
      <td style="padding:10px 14px;font-size:14px;color:#c0392b;font-weight:600;">Liabilities</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;color:#c0392b;font-weight:600;">−${fmt(result.totalLiabilities)}</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;color:#c0392b;font-weight:600;">−${fmt(result.totalLiabilities)}</td>
      <td style="padding:10px 14px;text-align:right;font-size:14px;color:#c0392b;font-weight:600;">deducted</td>
    </tr>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:'Open Sans',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f2419;padding:28px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:24px;font-weight:700;color:white;letter-spacing:-0.5px;">Zakatly</div>
                  <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Your Annual Zakat Report</div>
                </td>
                <td style="text-align:right;font-size:13px;color:rgba(255,255,255,0.4);">${today}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Zakat Due Hero -->
        <tr>
          <td style="background:#2d7a4f;padding:36px 36px 32px;">
            <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">
              Zakat Due This Year
            </div>
            <div style="font-size:48px;font-weight:700;color:white;line-height:1;">
              ${fmt(result.zakatDue)}
            </div>
            <div style="font-size:15px;color:rgba(255,255,255,0.65);margin-top:10px;">
              ${result.zakatDue > 0 ? '2.5% of your net zakatable wealth' : 'Your liabilities offset your zakatable assets'}
            </div>

            <!-- Stat pills -->
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                ${[
                  { label: 'Total Assets', value: fmt(result.totalAssets) },
                  { label: 'Total Liabilities', value: fmt(result.totalLiabilities) },
                  { label: 'Zakatable Wealth', value: fmt(result.zakatableWealth) },
                ].map(s => `
                  <td style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:50px;padding:8px 18px;margin-right:8px;text-align:center;">
                    <div style="font-size:11px;color:rgba(255,255,255,0.55);">${s.label}</div>
                    <div style="font-size:15px;font-weight:700;color:white;">${s.value}</div>
                  </td>
                  <td width="8"></td>
                `).join('')}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Breakdown Table -->
        <tr>
          <td style="padding:32px 36px 0;">
            <div style="font-size:13px;font-weight:700;color:#2d7a4f;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;">Zakat Calculation Detail</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;border:1px solid #e8f5ed;">
              <thead>
                <tr style="background:#2d7a4f;">
                  <th style="padding:10px 14px;text-align:left;font-size:11px;color:rgba(255,255,255,0.8);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Asset / Liability</th>
                  <th style="padding:10px 14px;text-align:right;font-size:11px;color:rgba(255,255,255,0.8);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Value</th>
                  <th style="padding:10px 14px;text-align:right;font-size:11px;color:rgba(255,255,255,0.8);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Zakatable</th>
                  <th style="padding:10px 14px;text-align:right;font-size:11px;color:#68BA7F;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Zakat @ 2.5%</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML}
                ${liabilitiesRow}
                <tr style="background:#f0faf4;border-top:2px solid #e8f5ed;">
                  <td style="padding:14px 14px;font-size:14px;font-weight:700;color:#0f2419;">Net Zakatable Wealth</td>
                  <td></td>
                  <td style="padding:14px 14px;text-align:right;font-size:14px;font-weight:700;color:#0f2419;">${fmt(result.zakatableWealth)}</td>
                  <td style="padding:14px 14px;text-align:right;font-size:14px;font-weight:700;color:#2d7a4f;">
                    ${fmt(result.zakatDue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Reminder -->
        <tr>
          <td style="padding:28px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f5ed;border-radius:12px;border-left:4px solid #2d7a4f;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:15px;font-weight:700;color:#0f2419;margin-bottom:10px;">Set Your Reminder for Next Lunar Year (Hawl)</div>
                  <div style="font-size:14px;color:#3d6b50;line-height:1.7;margin-bottom:8px;">
                    Zakat is due every lunar (Hijri) year (354 days). Your next assessment is due around <strong>${nextDueStr}</strong>.
                  </div>
                  <div style="font-size:14px;color:#3d6b50;line-height:1.7;margin-bottom:8px;">
                    We recommend calculating during <strong>Ramadan</strong> — the reward of giving is multiplied in the blessed month, and it is the tradition of many scholars and communities.
                  </div>
                  <div style="font-size:14px;color:#3d6b50;line-height:1.7;">
                    Keep this report and its PDF attachment as a record of your obligation fulfilled this year.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Disclaimer -->
        <tr>
          <td style="padding:24px 36px;">
            <div style="font-size:12px;color:#aaa;line-height:1.7;border-top:1px solid #f0f0f0;padding-top:20px;">
              <strong style="color:#888;">Note:</strong> This is an estimate based on contemporary scholarly guidelines. Please consult a qualified Islamic scholar for your specific situation.<br><br>
              Generated by <a href="https://zakatly.app" style="color:#2d7a4f;text-decoration:none;">Zakatly</a> — Built for the global Muslim community.
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { email, result, pdfBase64 } = await req.json() as {
      email: string
      result: ZakatResult
      pdfBase64: string
    }

    if (!email || !result || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    const year = new Date().getFullYear()
    const subject = result.zakatDue > 0
      ? `Your Zakat Report ${year} — ${fmt(result.zakatDue)} Due`
      : `Your Zakat Report ${year} — $0 Due (Liabilities Offset)`

    const configuredFrom = process.env.RESEND_FROM_EMAIL || 'Zakatly <reports@zakatly.app>'

    let sendResult = await resend.emails.send({
      from: configuredFrom,
      to: email,
      subject,
      html: buildEmailHTML(result),
      attachments: pdfBase64
        ? [{
            filename: `Zakatly_Report_${year}.pdf`,
            content: pdfBase64.split(',')[1],
          }]
        : [],
    })

    // If custom domain is not yet verified in Resend, automatically fallback to onboarding@resend.dev
    if (sendResult.error && (sendResult.error.message?.includes('not verified') || configuredFrom.includes('zakatly.app'))) {
      console.warn('Domain not verified on Resend, attempting fallback to onboarding@resend.dev')
      sendResult = await resend.emails.send({
        from: 'Zakatly <onboarding@resend.dev>',
        to: email,
        subject,
        html: buildEmailHTML(result),
        attachments: pdfBase64
          ? [{
              filename: `Zakatly_Report_${year}.pdf`,
              content: pdfBase64.split(',')[1],
            }]
          : [],
      })
    }

    if (sendResult.error) {
      console.error('Resend error:', JSON.stringify(sendResult.error))
      const isDomainUnverified =
        sendResult.error.message?.includes('not verified') ||
        sendResult.error.message?.includes('verify a domain') ||
        sendResult.error.message?.includes('testing emails')

      const message = isDomainUnverified
        ? 'Domain verification pending on resend.com/domains. You can download your PDF report directly below.'
        : sendResult.error.message || 'Failed to send email'

      return NextResponse.json(
        {
          error: message,
          isDomainUnverified,
          detail: sendResult.error,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send report error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
