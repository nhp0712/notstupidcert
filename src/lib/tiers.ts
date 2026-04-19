export type TierId = 'basic' | 'premium' | 'supreme'

export interface Tier {
  id: TierId
  name: string
  tagline: string
  price: string
  priceInCents: number
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
    priceInCents: 299,
    emoji: '📜',
    features: [
      'Official-looking design',
      'AI-generated unique funny text',
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
    priceInCents: 699,
    emoji: '🏆',
    highlight: true,
    features: [
      'Gold border design',
      'Elaborate AI-generated wording',
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
    priceInCents: 1299,
    emoji: '🧠',
    features: [
      'Most elaborate design',
      'AI roasts everyone else as dumber',
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
