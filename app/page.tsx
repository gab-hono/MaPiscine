// app/page.tsx
// Page d'accueil — Server Component (pas de "use client")
// Son seul rôle : monter PiscineListPage qui gère tout le state côté client

import { PiscineListPage } from "@/components/piscines/PiscineListPage"

export default function HomePage() {
  return <PiscineListPage />
}