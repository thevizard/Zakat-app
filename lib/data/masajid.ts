import { MosquePartner } from '@/types/masjid.types'

export const SEED_MASAJID: MosquePartner[] = [
  {
    slug: 'srvic',
    name: 'SRVIC',
    city: 'San Ramon, CA',
    portalUrl: 'https://givebutter.com/SRVIC',
    portalLabel: 'SRVIC Givebutter Portal',
    customMessage: 'Your Zakat directly supports local families and community hardship relief across the San Ramon Valley.',
  },
  {
    slug: 'epic',
    name: 'East Plano Islamic Center (EPIC)',
    city: 'Plano, TX',
    portalUrl: 'https://us.mohid.co/tx/dallas/epic/masjid/online/donation',
    portalLabel: 'EPIC Mohid Portal',
    zelleRecipient: 'zakat@epicmasjid.net',
    zelleMemo: 'Zakat al-Mal 1446',
    customMessage: 'Your Zakat directly supports vulnerable local families in Collin County and North Texas.',
  },
  {
    slug: 'mca',
    name: 'Muslim Community Association (MCA)',
    city: 'Santa Clara, CA',
    portalUrl: 'https://www.mcabayarea.org/donate',
    portalLabel: 'MCA Donation Portal',
    zelleRecipient: 'zakat@mcabayarea.org',
    zelleMemo: 'Zakat al-Mal',
    customMessage: 'Distributed 100% to verified zakat-eligible families in the San Francisco Bay Area.',
  },
  {
    slug: 'dar-al-hijrah',
    name: 'Dar Al-Hijrah Islamic Center',
    city: 'Falls Church, VA',
    portalUrl: 'https://hijrah.org/donate/',
    portalLabel: 'Dar Al-Hijrah Giving Portal',
    zelleRecipient: 'zakat@hijrah.org',
    zelleMemo: 'Zakat al-Mal',
    customMessage: 'Supporting our local social services and emergency family assistance fund.',
  },
  {
    slug: 'valley-ranch',
    name: 'Valley Ranch Islamic Center (VRIC)',
    city: 'Irving, TX',
    portalUrl: 'https://valleyranch.org/donate',
    portalLabel: 'VRIC Online Giving',
    zelleRecipient: 'zakat@valleyranch.org',
    zelleMemo: 'Zakat al-Mal',
    customMessage: 'Allocated to local community welfare and hardship relief across the DFW metroplex.',
  },
]

export function getMasjidBySlug(slug: string): MosquePartner | null {
  const normalized = slug.toLowerCase().trim()
  return SEED_MASAJID.find((m) => m.slug.toLowerCase() === normalized) || null
}

export function parseCustomMasjid(params: {
  name?: string | null
  city?: string | null
  portal?: string | null
  zelle?: string | null
}): MosquePartner | null {
  if (!params.name) return null
  return {
    slug: 'custom',
    name: params.name,
    city: params.city || '',
    portalUrl: params.portal || undefined,
    zelleRecipient: params.zelle || undefined,
    zelleMemo: 'Zakat al-Mal',
    customMessage: `Fulfill your Zakat directly to ${params.name} to support our local community.`,
  }
}
