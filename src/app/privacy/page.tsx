import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden="true">←</span>
        Back to homepage
      </Link>
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4">
        This Privacy Policy explains how Not Stupid Cert collects, uses, and protects your information.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Information We Collect</h2>
      <p className="mt-2">
        We may collect information you provide directly, such as your name, title,
        selected certificate tier, language preference, and contact details if you email us.
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Payment Information</h2>
      <p className="mt-2">
        Payments are processed by third-party payment providers such as Paddle.
        We do not store your full payment card details on our servers.
      </p>

      <h2 className="mt-8 text-xl font-semibold">3. How We Use Information</h2>
      <p className="mt-2">
        We use your information to provide and improve our service, generate your personalized certificate,
        process transactions, prevent fraud, and respond to support requests.
      </p>

      <h2 className="mt-8 text-xl font-semibold">4. Data Sharing</h2>
      <p className="mt-2">
        We may share limited data with service providers that help us operate the website,
        process payments, and deliver our services.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Data Retention</h2>
      <p className="mt-2">
        We retain information only for as long as necessary to provide our services,
        comply with legal obligations, resolve disputes, and enforce agreements.
      </p>

      <h2 className="mt-8 text-xl font-semibold">6. Your Rights</h2>
      <p className="mt-2">
        Depending on your location, you may have rights to access, correct, or delete your personal information.
      </p>

      <h2 className="mt-8 text-xl font-semibold">7. Contact</h2>
      <p className="mt-2">
        For privacy-related questions, contact: harryn.0712@gmail.com
      </p>
    </main>
  )
}
