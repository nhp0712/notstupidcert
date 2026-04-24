import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden="true">←</span>
        Back to homepage
      </Link>
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4">
        Welcome to Not Stupid Cert. By using this website and purchasing our products,
        you agree to these Terms of Service.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Our Product</h2>
      <p className="mt-2">
        Not Stupid Cert sells novelty personalized digital certificates for entertainment
        purposes only. These certificates are not official academic, professional, or legal credentials.
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Orders and Payment</h2>
      <p className="mt-2">
        All prices are shown at checkout. Payments are processed securely by our payment partner.
        Your order is considered complete only after successful payment.
      </p>

      <h2 className="mt-8 text-xl font-semibold">3. Delivery</h2>
      <p className="mt-2">
        After successful payment, your personalized digital certificate will be generated and delivered online.
        Delivery times may vary depending on system availability.
      </p>

      <h2 className="mt-8 text-xl font-semibold">4. Personalized Content</h2>
      <p className="mt-2">
        You are responsible for the accuracy of the name, title, and other information you submit.
        We may refuse content that is unlawful, abusive, defamatory, or inappropriate.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Entertainment Only</h2>
      <p className="mt-2">
        Our certificates are intended as humorous novelty items only and must not be used to mislead,
        defraud, or falsely represent official qualifications.
      </p>

      <h2 className="mt-8 text-xl font-semibold">6. Refunds</h2>
      <p className="mt-2">
        Refunds are governed by our Refund Policy available on this website.
      </p>

      <h2 className="mt-8 text-xl font-semibold">7. Limitation of Liability</h2>
      <p className="mt-2">
        To the maximum extent permitted by law, Not Stupid Cert is not liable for indirect,
        incidental, or consequential damages arising from use of the service.
      </p>

      <h2 className="mt-8 text-xl font-semibold">8. Contact</h2>
      <p className="mt-2">
        For support, please contact: support@notstupidcert.com
      </p>
    </main>
  )
}