import jsPDF from 'jspdf'
import { ZakatResult } from '@/types/zakat.types'

function fmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateZakatPDF(result: ZakatResult): string {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const G: [number, number, number] = [45, 122, 79]
  const DARK: [number, number, number] = [15, 36, 25]
  const LIGHT_G: [number, number, number] = [240, 250, 244]

  // ── Header bar
  doc.setFillColor(...G)
  doc.rect(0, 0, 210, 36, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Zakatly', 16, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Your Annual Zakat Report', 16, 27)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(today, 194, 27, { align: 'right' })

  // ── Zakat Due hero
  let y = 52
  doc.setTextColor(...DARK)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(120, 120, 120)
  doc.text('ZAKAT DUE THIS YEAR', 16, y)
  y += 8
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...G)
  doc.text(result.meetsNisab ? fmt(result.zakatDue) : 'No Zakat Due', 16, y)
  y += 6

  if (!result.meetsNisab) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(
      result.zakatableWealth === 0
        ? 'Your liabilities offset your assets — no zakatable wealth.'
        : `Your zakatable wealth (${fmt(result.zakatableWealth)}) is below the nisab threshold (${fmt(result.nisabThreshold)}).`,
      16, y + 4
    )
    y += 8
  }

  // ── Key stats row
  y += 8
  doc.setFillColor(...LIGHT_G)
  doc.roundedRect(16, y, 178, 18, 3, 3, 'F')
  const stats = [
    { label: 'Total Assets', value: fmt(result.totalAssets) },
    { label: 'Zakatable Wealth', value: fmt(result.zakatableWealth) },
    { label: 'Nisab Threshold', value: fmt(result.nisabThreshold) },
  ]
  stats.forEach((s, i) => {
    const x = 16 + i * 60
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(s.label.toUpperCase(), x + 5, y + 6)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(s.value, x + 5, y + 13)
  })

  // ── Breakdown table
  y += 28
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text('Zakat Calculation Detail', 16, y)
  y += 6

  // Table header
  doc.setFillColor(...G)
  doc.rect(16, y, 178, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Asset / Liability', 19, y + 5.5)
  doc.text('Value', 108, y + 5.5, { align: 'right' })
  doc.text('Zakatable', 140, y + 5.5, { align: 'right' })
  doc.text('Zakat @ 2.5%', 192, y + 5.5, { align: 'right' })
  y += 8

  // Asset rows
  result.breakdown.forEach((item, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 253, i % 2 === 0 ? 255 : 251)
    doc.rect(16, y, 178, 8, 'F')
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(item.label, 19, y + 5.5)
    doc.text(fmt(item.entered), 108, y + 5.5, { align: 'right' })
    doc.text(fmt(item.zakatable), 140, y + 5.5, { align: 'right' })
    doc.setTextColor(...G)
    doc.text(fmt(item.zakatable * 0.025), 192, y + 5.5, { align: 'right' })
    y += 8
  })

  // Liabilities row
  if (result.totalLiabilities > 0) {
    doc.setFillColor(255, 245, 245)
    doc.rect(16, y, 178, 8, 'F')
    doc.setTextColor(192, 57, 43)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.text('Liabilities', 19, y + 5.5)
    doc.text(`−${fmt(result.totalLiabilities)}`, 108, y + 5.5, { align: 'right' })
    doc.text(`−${fmt(result.totalLiabilities)}`, 140, y + 5.5, { align: 'right' })
    doc.text('deducted', 192, y + 5.5, { align: 'right' })
    y += 8
  }

  // Net total row
  doc.setFillColor(...LIGHT_G)
  doc.rect(16, y, 178, 10, 'F')
  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Net Zakatable Wealth', 19, y + 7)
  doc.text(fmt(result.zakatableWealth), 140, y + 7, { align: 'right' })
  doc.setTextColor(...G)
  doc.text(result.meetsNisab ? fmt(result.zakatDue) : '—', 192, y + 7, { align: 'right' })
  y += 18

  // ── Reminder box
  doc.setFillColor(232, 245, 237)
  doc.roundedRect(16, y, 178, 38, 4, 4, 'F')
  doc.setFillColor(...G)
  doc.roundedRect(16, y, 4, 38, 2, 2, 'F')

  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Set Your Reminder for Next Year', 24, y + 10)

  const nextDue = new Date()
  nextDue.setFullYear(nextDue.getFullYear() + 1)
  const nextDueStr = nextDue.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 80, 60)
  doc.text(`Zakat is due every lunar year. Your next assessment is due around ${nextDueStr}.`, 24, y + 19)
  doc.text('We recommend calculating during Ramadan — the reward of giving is multiplied in the blessed month.', 24, y + 27)
  doc.text('Keep this report as a record of your obligation fulfilled.', 24, y + 34)
  y += 46

  // ── Disclaimer
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(160, 160, 160)
  doc.text(
    'This report is an estimate based on contemporary scholarly guidelines. Please consult a qualified Islamic scholar for your specific situation.',
    16, y, { maxWidth: 178 }
  )

  // ── Footer
  doc.setFillColor(...G)
  doc.rect(0, 285, 210, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('Generated by Zakatly — zakatly.app', 16, 292)
  doc.text('Made with ❤️ for the Ummah', 194, 292, { align: 'right' })

  return doc.output('datauristring')
}
