// app/layout.tsx
// Layout racine — appliqué à toutes les pages de l'application

import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

// Chargement de Montserrat depuis Google Fonts (next/font optimise automatiquement)
// subsets: ["latin"] suffit pour le français
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  // On charge les graisses utilisées dans la charte : normal (400), semi-bold (600), bold (700)
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Piscines de Paris",
  description:
    "Trouvez une piscine municipale accessible et inclusive à Paris. Filtrez par accès PMR, label Queer Friendly, horaires et tarifs.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}