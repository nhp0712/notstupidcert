import Link from "next/link"

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden="true">←</span>
        Back to homepage
      </Link>
      <h1 className="text-3xl font-bold">Refund Policy</h1>
      <p className="mt-4">
        We want customers to have a smooth experience using Not Stupid Cert.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Digital Personalized Product</h2>
      <p className="mt-2">
        Our products are personalized digital items created based on the information you submit.
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Eligible Refunds</h2>
      <p className="mt-2">
        Refunds may be provided in cases of duplicate charges, failed delivery, or technical errors
        that prevent you from receiving your certificate.
      </p>

      <h2 className="mt-8 text-xl font-semibold">3. Non-Refundable Cases</h2>
      <p className="mt-2">
        Once a personalized certificate has been successfully generated and delivered,
        refunds are generally not available except where required by applicable law.
      </p>

      <h2 className="mt-8 text-xl font-semibold">4. Requesting a Refund</h2>
      <p className="mt-2">
        To request a refund, contact: support@notstupidcert.com and include details of your order and the issue encountered.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Review Time</h2>
      <p className="mt-2">
        We aim to review refund requests within a reasonable time.
      </p>
    </main>
  )
}