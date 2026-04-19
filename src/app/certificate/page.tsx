import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'
import CertificateView from './CertificateView'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CertificatePage({ searchParams }: Props) {
  const [{ session_id = '' }, language] = await Promise.all([searchParams, getLanguage()])
  const tr = await getTranslations(language)
  return <CertificateView sessionId={session_id} tr={tr} />
}
