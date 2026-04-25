import { getLanguage } from '@/lib/get-language'
import { getTranslations } from '@/lib/translate'
import CertificateView from './CertificateView'

interface Props {
  searchParams: Promise<{ certType?: string; order_id?: string }>
}

export default async function CertificatePage({ searchParams }: Props) {
  const [{ certType, order_id }, language] = await Promise.all([searchParams, getLanguage()])
  const tr = await getTranslations(language)
  return <CertificateView certType={certType ?? ''} orderId={order_id ?? ''} tr={tr} language={language} />
}
