export type CertTypeId = 'not-stupid' | 'rizz-master' | 'red-flag-free' | 'delulu' | 'not-your-ex'
export type TierId = 'basic' | 'premium' | 'supreme'

export interface CertColors {
  bg: string
  bgInner: string
  outerBorder: string
  innerBorder: string
  orgColor: string
  subtitleColor: string
  nameColor: string
  textColor: string
  accentColor: string
  dividerColor: string
  sealBorder: string
  sealColor: string
  cornerColor: string
}

export interface CertTierConfig {
  id: TierId
  name: string
  tagline: string
  price: string
  highlight?: boolean
  checkoutUrl: string
  features: string[]
}

export interface CertCustomField {
  label: string
  placeholder: string
}

export interface CertTypeConfig {
  id: CertTypeId
  name: string
  emoji: string
  tagline: string
  description: string
  sampleName: string
  sampleTitle: string
  cardAccent: string
  cardBg: string
  customField: CertCustomField
  tiers: CertTierConfig[]
  certColors: CertColors
}

const LS_BASE = 'https://notstupidcert.lemonsqueezy.com/checkout/buy'

export const CERT_TYPES: CertTypeConfig[] = [
  {
    id: 'not-stupid',
    name: 'Certified Not Stupid',
    emoji: '🧠',
    tagline: 'Prove the baseline',
    description: 'Official proof that you are, in fact, not stupid. Backed by zero scientific evidence and maximum confidence.',
    sampleName: 'Kevin L.',
    sampleTitle: 'Senior Decision Maker',
    cardAccent: '#facc15',
    cardBg: '#1e1b4b',
    customField: {
      label: 'Your Greatest Achievement',
      placeholder: 'Proof you\'re not stupid',
    },
    tiers: [
      {
        id: 'basic', name: 'Not Stupid Certificate', tagline: 'Prove the baseline', price: '$2.99', highlight: false,
        checkoutUrl: `${LS_BASE}/2eae03bd-0d84-4c31-8fce-7637b0674c07`,
        features: ['Official-looking design', 'Uniquely generated funny text', 'Your name in big fancy letters', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'premium', name: 'Certified Genius', tagline: 'Above average, allegedly', price: '$6.99', highlight: true,
        checkoutUrl: `${LS_BASE}/4e7bafb5-f61f-4b27-bc73-3ad027f86bf1`,
        features: ['Gold border design', 'Elaborate custom-generated wording', 'Fake impressive credentials', 'Fake achievements & honors', 'Your job title (elevated)', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'supreme', name: 'Galaxy Brain Supreme', tagline: 'A mind beyond comprehension', price: '$12.99', highlight: false,
        checkoutUrl: `${LS_BASE}/4a29e82d-bb6c-4b71-9298-fb4e5fc3acdd`,
        features: ['Most elaborate design', 'Roasts everyone else as dumber', 'Fake PhD title', 'Honorary memberships to made-up institutions', 'Multiple prestigious fake awards', 'Downloadable as image', 'Shareable to socials'],
      },
    ],
    certColors: {
      bg: '#ffffff', bgInner: '#f8f9fc', outerBorder: '6px double #1e3a5f', innerBorder: '2px solid #2d5a8a',
      orgColor: '#4a6fa5', subtitleColor: '#1e3a5f', nameColor: '#0f1e2e', textColor: '#2c3e50',
      accentColor: '#4a6fa5', dividerColor: '#b8cce4', sealBorder: '#1e3a5f', sealColor: '#1e3a5f', cornerColor: '#1e3a5f',
    },
  },
  {
    id: 'rizz-master',
    name: 'Rizz Master',
    emoji: '💘',
    tagline: 'Unmatched charisma, certified',
    description: 'Official proof that your magnetism, charm, and effortless attractiveness operate at scientifically unmeasurable levels.',
    sampleName: 'Alex K.',
    sampleTitle: 'Professional Heartbreaker',
    cardAccent: '#ff2d78',
    cardBg: '#0a0a0a',
    customField: {
      label: 'Your Biggest Flex',
      placeholder: 'What makes you irresistible?',
    },
    tiers: [
      {
        id: 'basic', name: 'Basic Rizz Certificate', tagline: 'You have it', price: '$2.99', highlight: false,
        checkoutUrl: `${LS_BASE}/d1d7227c-7a4b-4a78-9667-1927dbe86363`,
        features: ['Official rizz certification', 'Custom charisma assessment', 'Your name in electric pink', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'premium', name: 'Certified Rizz Master', tagline: 'You have it bad', price: '$6.99', highlight: true,
        checkoutUrl: `${LS_BASE}/8e122772-202c-4c62-929f-2e491a22e743`,
        features: ['Full rizz credentials', 'Elaborate magnetism documentation', 'Fake charisma credentials', 'Certified heartbreaker honors', 'Your title (upgraded)', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'supreme', name: 'Supreme Rizz Grandmaster', tagline: 'Unstoppable', price: '$12.99', highlight: false,
        checkoutUrl: `${LS_BASE}/23526576-eebe-481b-9fb0-7fd39800cbb1`,
        features: ['Most elaborate rizz certificate', 'Everyone else rated awkward by comparison', 'Fake PhD in Human Magnetism', 'Honorary titles from made-up rizz academies', 'Multiple attraction achievement awards', 'Downloadable as image', 'Shareable to socials'],
      },
    ],
    certColors: {
      bg: '#0a0a0a', bgInner: '#111111', outerBorder: '6px double #ff2d78', innerBorder: '2px solid #cc2462',
      orgColor: '#ff2d78', subtitleColor: '#ff9eb5', nameColor: '#ffffff', textColor: '#f0d0d8',
      accentColor: '#ff2d78', dividerColor: '#4d0f25', sealBorder: '#ff2d78', sealColor: '#ff2d78', cornerColor: '#ff2d78',
    },
  },
  {
    id: 'red-flag-free',
    name: 'Red Flag Free',
    emoji: '🚩',
    tagline: 'Zero flags. All green.',
    description: 'Clinically assessed and officially declared free of red flags, toxic patterns, and situationship relapses. You are, in fact, a normal person.',
    sampleName: 'Jamie L.',
    sampleTitle: 'Emotionally Available Person',
    cardAccent: '#00c853',
    cardBg: '#0a1f0a',
    customField: {
      label: 'Your Last Relationship Status',
      placeholder: 'How long have you been sane?',
    },
    tiers: [
      {
        id: 'basic', name: 'Red Flag Free Certificate', tagline: 'Assessed and cleared', price: '$2.99', highlight: false,
        checkoutUrl: `${LS_BASE}/7535a11b-3c7c-40de-920b-5c88a16a677b`,
        features: ['Official flag-free certification', 'Custom psychological clearance', 'Your name in emerald green', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'premium', name: 'Certified Red Flag Free', tagline: 'Fully screened', price: '$6.99', highlight: true,
        checkoutUrl: `${LS_BASE}/eb67c520-5ce2-4aee-8308-fbb87d7daa9a`,
        features: ['Full attachment style clearance', 'Elaborate normalcy documentation', 'Fake therapy credentials', 'Zero situationship honors', 'Your wellness title (elevated)', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'supreme', name: 'Totally Normal Person', tagline: 'Peak psychological health', price: '$12.99', highlight: false,
        checkoutUrl: `${LS_BASE}/1167755e-54e1-426b-a584-cdb9cf77e5a2`,
        features: ['Maximum normalcy certificate', 'Everyone else declared the problem', 'Fake PhD in Romantic Soundness', 'Honorary memberships to wellness councils', 'Multiple green flag achievement awards', 'Downloadable as image', 'Shareable to socials'],
      },
    ],
    certColors: {
      bg: '#0a1f0a', bgInner: '#0d280d', outerBorder: '6px double #00c853', innerBorder: '2px solid #00a844',
      orgColor: '#00c853', subtitleColor: '#69f0ae', nameColor: '#ffffff', textColor: '#e0f2e0',
      accentColor: '#00c853', dividerColor: '#1b5e20', sealBorder: '#00c853', sealColor: '#00c853', cornerColor: '#00c853',
    },
  },
  {
    id: 'delulu',
    name: 'Delulu',
    emoji: '✨',
    tagline: 'Manifesting beyond logic',
    description: 'Your capacity for delusional optimism has been scientifically measured and found to be operating at levels that defy conventional reality.',
    sampleName: 'Sam T.',
    sampleTitle: 'Certified Manifestor',
    cardAccent: '#b388ff',
    cardBg: '#070718',
    customField: {
      label: 'Your Current Manifestation',
      placeholder: 'What are you manifesting right now?',
    },
    tiers: [
      {
        id: 'basic', name: 'Delulu Certificate', tagline: 'Reality-optional', price: '$2.99', highlight: false,
        checkoutUrl: `${LS_BASE}/ca010ce9-2560-46ec-9a9d-1f15a22c71f5`,
        features: ['Official delulu certification', 'Custom manifestation record', 'Your name in holographic purple', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'premium', name: 'Certified Delulu', tagline: 'Chronically hopeful', price: '$6.99', highlight: true,
        checkoutUrl: `${LS_BASE}/ed2c560e-b7ae-4004-97b4-ab23c60a3dfa`,
        features: ['Full manifestation credentials', 'Elaborate delusion documentation', 'Fake PhD in Manifestation Science', 'Impossible outcome achievements', 'Your title (cosmically elevated)', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'supreme', name: 'Galaxy Delulu', tagline: 'Beyond logic, beyond limits', price: '$12.99', highlight: false,
        checkoutUrl: `${LS_BASE}/e33b0970-5aee-40d7-9540-aba4c01904d7`,
        features: ['Maximum delulu certification', 'Non-believers officially declared scared', 'Fake PhD in Advanced Reality Distortion', 'Honorary memberships to mystic councils', 'Multiple manifestation achievement stars', 'Downloadable as image', 'Shareable to socials'],
      },
    ],
    certColors: {
      bg: '#070718', bgInner: '#0e0e2a', outerBorder: '6px double #b388ff', innerBorder: '2px solid #9c6dff',
      orgColor: '#b388ff', subtitleColor: '#ffd700', nameColor: '#ffd700', textColor: '#e8e0ff',
      accentColor: '#b388ff', dividerColor: '#2d1b69', sealBorder: '#ffd700', sealColor: '#ffd700', cornerColor: '#b388ff',
    },
  },
  {
    id: 'not-your-ex',
    name: 'Not Your Ex',
    emoji: '🥶',
    tagline: 'Cold, unbothered, moving on',
    description: 'Officially declared a completely different person from any previous romantic partners. Legally and emotionally unassociated. Fully in their villain era.',
    sampleName: 'Jordan M.',
    sampleTitle: 'Completely Moved On',
    cardAccent: '#80d8ff',
    cardBg: '#121212',
    customField: {
      label: "Your Ex's Name",
      placeholder: "Who are we distancing you from?",
    },
    tiers: [
      {
        id: 'basic', name: 'Not Your Ex Certificate', tagline: 'Different person, confirmed', price: '$2.99', highlight: false,
        checkoutUrl: `${LS_BASE}/500a3357-6cc5-4dfc-b2b2-75f147640553`,
        features: ['Official non-association certificate', 'Custom independence declaration', 'Your name in ice blue', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'premium', name: 'Certified Not Your Ex', tagline: 'Fully moved on', price: '$6.99', highlight: true,
        checkoutUrl: `${LS_BASE}/275e5993-956e-4a0f-b325-4ed836ca1b64`,
        features: ['Full independence credentials', 'Elaborate non-association documentation', 'Completed healing protocol honors', 'Villain era achievement badge', 'Your title (cold and unbothered)', 'Downloadable as image', 'Shareable to socials'],
      },
      {
        id: 'supreme', name: 'Completely Over It', tagline: 'Who?', price: '$12.99', highlight: false,
        checkoutUrl: `${LS_BASE}/367abccf-02cb-47ff-ae85-10d03ebb0c87`,
        features: ['Maximum independence certificate', 'Ex still thinking about them, confirmed', 'Fake PhD in Moving On Successfully', 'Honorary member of Global Council of Thriving', 'Multiple glow-up achievement awards', 'Downloadable as image', 'Shareable to socials'],
      },
    ],
    certColors: {
      bg: '#121212', bgInner: '#1a1a1a', outerBorder: '6px double #80d8ff', innerBorder: '2px solid #4dd0e1',
      orgColor: '#80d8ff', subtitleColor: '#b0bec5', nameColor: '#ffffff', textColor: '#eceff1',
      accentColor: '#80d8ff', dividerColor: '#1c313a', sealBorder: '#80d8ff', sealColor: '#80d8ff', cornerColor: '#80d8ff',
    },
  },
]

export function getCertType(id: string): CertTypeConfig | null {
  return CERT_TYPES.find((c) => c.id === id) ?? null
}

export function getCertTier(certType: CertTypeConfig, tierId: TierId): CertTierConfig | null {
  return certType.tiers.find((t) => t.id === tierId) ?? null
}
