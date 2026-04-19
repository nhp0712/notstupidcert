import Link from 'next/link'
import { TIERS } from '@/lib/tiers'
import { getLanguage } from '@/lib/get-language'
import { getTranslations, fill, tierFeatures } from '@/lib/translate'

export default async function Home() {
  const language = await getLanguage()
  const tr = await getTranslations(language)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center">
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
          <p className="text-base text-blue-300 mb-10 max-w-xl mx-auto">{tr.hero_description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href="#tiers"
              className="w-full sm:w-auto inline-block bg-yellow-400 text-black font-black py-4 px-10 rounded-full text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/30"
            >
              {tr.hero_cta}
            </a>
            <span className="text-blue-400 text-sm">{tr.hero_starting_at}</span>
          </div>

          <p className="text-blue-400 text-sm italic">{tr.hero_social_proof}</p>
        </div>
      </section>

      {/* Example certificate */}
      <section className="px-4 pb-16">
        <p className="text-center text-blue-400 text-xs mb-4 font-semibold tracking-widest uppercase">
          {tr.example_label}
        </p>
        <div className="max-w-lg mx-auto transform rotate-1 shadow-2xl shadow-black/50">
          <div className="bg-white text-gray-800" style={{ border: '5px double #1e3a5f', padding: '4px' }}>
            <div className="border-2 border-[#2d5a8a] p-6 bg-[#f8f9fc]">
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4a6fa5] mb-2">
                  International Bureau of Human Intelligence Standards
                </p>
                <hr className="border-[#b8cce4] mb-2" />
                <h2
                  className="text-xl font-bold text-[#1e3a5f] mb-1"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Certificate of Non-Stupidity
                </h2>
                <hr className="border-[#b8cce4] mt-2 mb-4" />
                <p className="text-xs italic text-gray-500 mb-2">{tr.example_cert_this_is_to}</p>
                <p
                  className="text-3xl font-black text-[#0f1e2e] mb-1"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  YOUR NAME HERE
                </p>
                <p className="text-xs text-[#2c3e50] max-w-xs mx-auto leading-relaxed mt-3 mb-4">
                  {tr.example_cert_body}
                </p>
                <div className="flex justify-between items-end mt-4 pt-3 border-t border-[#b8cce4]">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-center p-2" style={{ border: '3px solid #1e3a5f' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center p-1" style={{ border: '1px solid #1e3a5f' }}>
                      <span className="text-[6px] font-black text-[#1e3a5f] leading-tight uppercase">
                        Certified Not Stupid Official
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-gray-500">
                    <p>{tr.cd_issued} Today</p>
                    <p>{tr.cd_cert_num} CNS-DEMO-2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-blue-400 text-xs mt-4">{tr.example_cert_caption}</p>
      </section>

      {/* Tiers */}
      <section id="tiers" className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-3">
            {tr.tiers_heading1} <span className="text-yellow-400">{tr.tiers_heading2}</span>
          </h2>
          <p className="text-center text-blue-300 mb-10 text-sm">{tr.tiers_subheading}</p>

          <div className="grid sm:grid-cols-3 gap-6 items-stretch">
            {TIERS.map((tier) => {
              const name = tr[`tier_${tier.id}_name` as keyof typeof tr] as string
              const tagline = tr[`tier_${tier.id}_tagline` as keyof typeof tr] as string
              const features = tierFeatures(tr, tier.id as 'basic' | 'premium' | 'supreme')

              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl p-6 text-gray-800 flex flex-col relative ${
                    tier.highlight ? 'ring-4 ring-yellow-400 sm:scale-105' : ''
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap">
                      {tr.tiers_most_popular}
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-3xl">{tier.emoji}</span>
                    <h3 className="text-lg font-black mt-2 mb-1">{name}</h3>
                    <p className="text-gray-500 text-sm">{tagline}</p>
                  </div>

                  <div className="mb-5">
                    <span className="text-4xl font-black">{tier.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{tr.tiers_one_time}</span>
                  </div>

                  <ul className="space-y-2 mb-8 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout?tier=${tier.id}`}
                    className={`w-full text-center py-3.5 rounded-xl font-bold transition-colors text-sm ${
                      tier.id === 'supreme'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : tier.id === 'premium'
                          ? 'bg-amber-400 text-black hover:bg-amber-500'
                          : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                  >
                    {fill(tr.tiers_get_cta, { name })}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">{tr.faq_heading}</h2>
          <div className="space-y-6">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n}>
                <h3 className="font-bold text-yellow-400 mb-1">
                  {tr[`faq_q${n}` as keyof typeof tr] as string}
                </h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  {tr[`faq_a${n}` as keyof typeof tr] as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-black mb-3">{tr.fence_heading}</h2>
          <p className="text-blue-300 mb-6 text-sm">{tr.fence_sub}</p>
          <a
            href="#tiers"
            className="inline-block bg-yellow-400 text-black font-black py-4 px-10 rounded-full text-lg hover:bg-yellow-300 transition-colors"
          >
            {tr.fence_cta}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center px-4 pb-8 border-t border-blue-900 pt-8">
        <p className="text-blue-400 text-xs font-bold mb-2">{tr.footer_rights}</p>
        <p className="text-blue-600 text-xs max-w-md mx-auto">{tr.footer_disclaimer}</p>
      </footer>
    </div>
  )
}
