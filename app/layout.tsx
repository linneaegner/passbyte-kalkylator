import type React from "react"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground antialiased")}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "Passbyte",
  description: "Jämför lön vid passbyte enligt Handelsavtal.",
};
