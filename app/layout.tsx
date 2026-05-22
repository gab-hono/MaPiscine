// app/layout.tsx
// Layout racine — appliqué à toutes les pages de l'application

import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Navbar } from "@/components/layout/Navbar"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "MaPiscine",
  description:
    "Trouvez une piscine municipale accessible et inclusive à Paris. Filtrez par accès PMR, label Queer Friendly, horaires et tarifs.",
  icons: {
    icon: "/water-ladder-solid-full.svg"
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}