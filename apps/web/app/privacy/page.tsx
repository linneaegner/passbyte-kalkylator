import type { Metadata } from "next"
import Link from "next/link"
import { AGREEMENT_YEAR } from "@passbyte/handels"

export const metadata: Metadata = {
  title: "Integritetspolicy — Passbyte",
  description: "Integritetspolicy för Passbyte webb och mobilapp.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        <div>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Tillbaka till Passbyte
          </Link>
          <h1 className="text-2xl font-bold text-primary mt-4">Integritetspolicy</h1>
          <p className="text-sm text-muted-foreground mt-1">Privacy policy</p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">Svenska</h2>
          <p>
            Passbyte (webb och mobilapp) samlar <strong>ingen personlig data</strong> och skickar
            ingen information till våra servrar.
          </p>
          <p>
            Dina inställningar (arbetsområde, lönesteg, skattesats och språk) sparas{" "}
            <strong>lokalt på din enhet</strong> — i webbläsaren respektive i appen. Vi använder
            inte analytics, spårning eller tredjepartsannonser.
          </p>
          <p>
            Kalkylatorn bygger på Handels avtal butik, lager och e-handel ({AGREEMENT_YEAR}).
            Verktyget är inte officiellt kopplat till Handels. Kontrollera alltid din
            lönespecifikation och lokala avtal.
          </p>
          <p>
            Vid frågor, kontakta oss via GitHub-projektet{" "}
            <a
              href="https://github.com/linneaegner/passbyte-kalkylator"
              className="text-primary hover:underline"
            >
              passbyte-kalkylator
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed border-t pt-8">
          <h2 className="text-lg font-semibold">English</h2>
          <p>
            Passbyte (web and mobile app) does <strong>not collect personal data</strong> and does
            not send information to our servers.
          </p>
          <p>
            Your settings (work area, wage tier, tax rate, and language) are stored{" "}
            <strong>locally on your device</strong> — in the browser or in the app. We do not use
            analytics, tracking, or third-party advertising.
          </p>
          <p>
            The calculator is based on the Handels retail, warehouse and e-commerce agreement (
            {AGREEMENT_YEAR}). This tool is not officially affiliated with Handels. Always check
            your payslip and local agreements.
          </p>
        </section>
      </main>
    </div>
  )
}
