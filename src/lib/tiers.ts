export type TierId = 'basic' | 'premium' | 'supreme'

export const LEMON_SQUEEZY_URLS: Record<TierId, string> = {
  basic: 'https://notstupidcert.lemonsqueezy.com/checkout/buy/2eae03bd-0d84-4c31-8fce-7637b0674c07?redirect=https://notstupidcert.com/certificate',
  premium: 'https://notstupidcert.lemonsqueezy.com/checkout/buy/4e7bafb5-f61f-4b27-bc73-3ad027f86bf1?redirect=https://notstupidcert.com/certificate',
  supreme: 'https://notstupidcert.lemonsqueezy.com/checkout/buy/4a29e82d-bb6c-4b71-9298-fb4e5fc3acdd?redirect=https://notstupidcert.com/certificate',
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
