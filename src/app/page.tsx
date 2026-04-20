import LanguagePicker from '@/components/LanguagePicker'
import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'

export default async function Home() {
  const language = await getLanguage()
  const tr = await getTranslations(language)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 text-white">
      <div className="sticky top-0 z-30 px-4 pt-4">
        <div className="mx-auto max-w-5xl flex justify-end">
          <div className="rounded-xl border border-blue-700/70 bg-blue-950/70 px-3 py-2 backdrop-blur-sm">
            <LanguagePicker currentLanguage={language} />
          </div>
        </div>
      </div>

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

          <p className="text-base text-blue-300 mb-4 max-w-xl mx-auto">
            {tr.hero_description}
          </p>

          <div className="max-w-2xl mx-auto mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">
            Novelty digital certificate for entertainment only. Not an academic, professional,
            legal, or official credential.
          </div>

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

      {/* rest of page */}
    </div>
  )
}