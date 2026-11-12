export interface MosquePartner {
  slug: string
  name: string
  city: string
  state?: string
  portalUrl?: string // e.g. Mohid, Donorbox, LaunchGood, Subsplash
  portalLabel?: string // e.g. "Mohid Portal", "Donorbox", "Official Portal"
  zelleRecipient?: string // e.g. "zakat@epicmasjid.net"
  zelleMemo?: string // e.g. "Zakat al-Mal"
  customMessage?: string
  logoUrl?: string
}
