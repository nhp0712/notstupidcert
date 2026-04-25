export type TierId = 'basic' | 'premium' | 'supreme'

export const LEMON_SQUEEZY_STORE_ID = '355396'

export const LEMON_SQUEEZY_VARIANT_IDS: Record<TierId, string> = {
  basic: '1571024',
  premium: '1571054',
  supreme: '1571059',
}

export interface Tier {
  id: TierId
  name: string
  tagline: string
  price: string
  emoji: string
  features: string[]
  highlight?: boolean
}

export const TIERS: Tier[] = [
  {
    id: 'basic',
    name: 'Not Stupid Certificate',
    tagline: 'Prove the baseline',
    price: '$2.99',
    emoji: '📜',
    features: [
      'Official-looking design',
      'Uniquely generated funny text',
      'Your name in big fancy letters',
      'Downloadable as image',
      'Shareable to socials',
    ],
  },
  {
    id: 'premium',
    name: 'Certified Genius',
    tagline: 'Above average, allegedly',
    price: '$6.99',
    emoji: '🏆',
    highlight: true,
    features: [
      'Gold border design',
      'Elaborate custom-generated wording',
      'Fake impressive credentials',
      'Fake achievements & honors',
      'Your job title (elevated)',
      'Downloadable as image',
      'Shareable to socials',
    ],
  },
  {
    id: 'supreme',
    name: 'Galaxy Brain Supreme',
    tagline: 'A mind beyond comprehension',
    price: '$12.99',
    emoji: '🧠',
    features: [
      'Most elaborate design',
      'Roasts everyone else as dumber',
      'Fake PhD title',
      'Honorary memberships to made-up institutions',
      'Multiple prestigious fake awards',
      'Downloadable as image',
      'Shareable to socials',
    ],
  },
]

export function getTier(id: string): Tier | null {
  return TIERS.find((t) => t.id === id) ?? null
}
