import Image from 'next/image'
import Link from 'next/link'
import LanguagePicker from '@/components/LanguagePicker'
import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'
import { CERT_TYPES } from '@/lib/cert-types'

const TESTIMONIALS = [
  { quote: "I framed it next to my actual degree. My parents finally stopped crying.", name: "Kevin L.", tier: "Not Stupid Certificate" },
  { quote: "My boss hasn't questioned a single decision since I put this on my desk.", name: "Sarah M.", tier: "Certified Genius" },
  { quote: "I bought the Galaxy Brain tier. I now speak at conferences. I have no idea why they keep inviting me back.", name: "James K.", tier: "Galaxy Brain Supreme" },
  { quote: "HR asked if this was real. I said yes. I got promoted.", name: "David K.", tier: "Certified Rizz Master" },
  { quote: "My IQ didn't change but my confidence absolutely did. 12/10 would certify again.", name: "Tuan A.", tier: "Not Stupid Certificate" },
]

const newCerts = CERT_TYPES.filter((c) => c.id !== 'not-stupid')
const notStupid = CERT_TYPES.find((c) => c.id === 'not-stupid')!

export default async function Home() {
  const language = await getLanguage()
  const tr = await getTranslations(language)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white">
      {/* Nav */}
      <div className="sticky top-0 z-30 px-4 pt-4">
        <div className="mx-auto max-w-5xl flex justify-between items-center">
          <div className="text-sm font-black opacity-70">notstupidcert.com</div>
          <div className="rounded-xl border border-blue-700/70 bg-blue-950/70 px-3 py-2 backdrop-blur-sm">
            <LanguagePicker currentLanguage={language} />
          </div>
        </div>
      </div>

      {/* Site Hero */}
      <section className="px-4 pt-16 pb-10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-2 text-xs font-bold tracking-widest text-blue-300 uppercase mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {tr.hero_badge}
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-tight tracking-tight">
            {tr.hero_title1}
            <br />
            <span className="text-yellow-400">{tr.hero_title2}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-200 mb-3 max-w-2xl mx-auto leading-relaxed">
            {tr.hero_subtitle}
          </p>
          <p className="text-base text-blue-300 mb-6 max-w-xl mx-auto">
            5 certificate types. All uniquely generated. All officially meaningless.
          </p>
          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
            Novelty digital certificate for entertainment only. Not an academic, professional, legal, or official credential.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <a href="#certificates" className="w-full sm:w-auto inline-block bg-yellow-400 text-black font-black py-4 px-10 rounded-full text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/30">
              View All Certificates →
            </a>
            <span className="text-blue-400 text-sm">From $2.99</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-700/40 rounded-full px-5 py-2.5 text-sm text-green-300 font-semibold">
            <span>🧠</span>
            <span>3,241 people officially certified so far</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured: Not Stupid */}
      <section id="certificates" className="px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase text-center mb-8">Choose Your Certificate</p>

          {/* Hero cert: Not Stupid */}
          <div className="rounded-3xl overflow-hidden mb-8" style={{ background: '#1e1b4b', border: '2px solid #facc15' }}>
            <div className="grid sm:grid-cols-2 gap-0 items-center">
              <div className="p-8 sm:p-10">
                <div className="text-4xl mb-3">🧠</div>
                <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full mb-3">Most Popular</div>
                <h2 className="text-3xl sm:text-4xl font-black mb-2 text-white">{notStupid.name}</h2>
                <p className="text-blue-200 mb-6">{notStupid.description}</p>
                <div className="flex items-center gap-4">
                  <Link href={`/certificate/${notStupid.id}`}
                    className="inline-block bg-yellow-400 text-black font-black py-3 px-8 rounded-full text-base hover:bg-yellow-300 transition-colors">
                    Get Certified →
                  </Link>
                  <span className="text-yellow-400 font-bold">From $2.99</span>
                </div>
              </div>
              <div className="px-8 pb-8 sm:py-8">
                <div className="max-w-xs mx-auto shadow-2xl shadow-black/60" style={{ transform: 'rotate(-1.5deg)' }}>
                  <Image src="/sample-certificate.png" alt="Sample certificate" width={600} height={800} className="w-full h-auto rounded-sm" priority />
                </div>
              </div>
            </div>
          </div>

          {/* 4 new certs grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {newCerts.map((cert) => (
              <Link key={cert.id} href={`/certificate/${cert.id}`}
                className="group rounded-2xl p-6 flex flex-col transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ background: cert.cardBg, border: `1.5px solid ${cert.cardAccent}55` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{cert.emoji}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{cert.name}</h3>
                    <p className="text-sm opacity-60" style={{ color: cert.cardAccent }}>{cert.tagline}</p>
                  </div>
                </div>
                <p className="text-sm opacity-70 text-white mb-5 leading-relaxed flex-1">{cert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: cert.cardAccent }}>From $2.99</span>
                  <span className="font-black text-sm py-2 px-5 rounded-full transition-opacity group-hover:opacity-90"
                    style={{ background: cert.cardAccent, color: cert.cardBg === '#0a0a0a' || cert.cardBg === '#070718' || cert.cardBg === '#121212' ? '#fff' : '#000' }}>
                    Get Certified →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">{tr.faq_heading}</h2>
          <div className="mb-6 rounded-2xl border border-blue-700 bg-blue-900/40 px-4 py-4 text-sm text-blue-100">
            This product is a personalized digital novelty certificate delivered online after purchase. It is intended for humor and entertainment only.
          </div>
          <div className="space-y-6">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n}>
                <h3 className="font-bold text-yellow-400 mb-1">{tr[`faq_q${n}` as keyof typeof tr] as string}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{tr[`faq_a${n}` as keyof typeof tr] as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">What People Are Saying</h2>
          <p className="text-center text-blue-400 text-sm mb-10">Real quotes from real people*</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-blue-900/40 border border-blue-700/50 rounded-2xl p-5 flex flex-col gap-3">
                <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                <p className="text-blue-100 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-blue-700/40">
                  <span className="font-bold text-white text-sm">— {t.name}</span>
                  <span className="text-xs text-blue-400 bg-blue-800/50 px-2 py-1 rounded-full">{t.tier}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-blue-600 text-xs mt-6">*Verified by our verification department (us)</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-black mb-3">{tr.fence_heading}</h2>
          <p className="text-blue-300 mb-6 text-sm">{tr.fence_sub}</p>
          <a href="#certificates" className="inline-block bg-yellow-400 text-black font-black py-4 px-10 rounded-full text-lg hover:bg-yellow-300 transition-colors">
            {tr.fence_cta}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-center py-8 border-t border-white/10">
        <div className="mb-3 text-blue-300">
          Support: <a href="mailto:support@notstupidcert.com" className="underline hover:text-white">support@notstupidcert.com</a>
        </div>
        <div>
          <a href="/terms" className="mx-2 hover:text-blue-300">Terms</a>
          <a href="/privacy" className="mx-2 hover:text-blue-300">Privacy</a>
          <a href="/refunds" className="mx-2 hover:text-blue-300">Refunds</a>
        </div>
      </footer>
    </div>
  )
}
