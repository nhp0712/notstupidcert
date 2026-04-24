import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'
import CertificateView from './CertificateView'

interface Props {
  searchParams: Promise<{ order_id?: string }>
}

export default async function CertificatePage({ searchParams }: Props) {
  const [{ order_id }, language] = await Promise.all([searchParams, getLanguage()])
  const tr = await getTranslations(language)
  return <CertificateView tr={tr} language={language} orderId={order_id} />
}
