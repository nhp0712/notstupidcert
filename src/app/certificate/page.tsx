import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'
import CertificateView from './CertificateView'

interface Props {
  searchParams: Promise<{ _ptxn?: string }>
}

export default async function CertificatePage({ searchParams }: Props) {
  const [{ _ptxn = '' }, language] = await Promise.all([searchParams, getLanguage()])
  const tr = await getTranslations(language)
  return <CertificateView sessionId={_ptxn} tr={tr} language={language} />
}
