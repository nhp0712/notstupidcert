'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

interface Props {
  currentLanguage: string
}

export default function LanguagePicker({ currentLanguage }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = useMemo(
    () => (SUPPORTED_LANGUAGES.includes(currentLanguage as (typeof SUPPORTED_LANGUAGES)[number]) ? currentLanguage : 'English'),
    [currentLanguage]
  )

  const onChange = (nextLanguage: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', nextLanguage)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <label htmlFor="language-picker" className="text-sm text-blue-200">
        Language
      </label>
      <select
        id="language-picker"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-blue-700 bg-blue-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-400"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language} className="bg-blue-950 text-white">
            {language}
          </option>
        ))}
      </select>
    </div>
  )
}
