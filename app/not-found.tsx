// app/not-found.tsx
// Page 404 globale — affichée par Next.js quand notFound() est appelé

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 gap-6">
      <div className="text-center flex flex-col gap-3">
        <span className="text-6xl" aria-hidden="true">🏊</span>
        <h1 className="text-3xl font-bold text-bleu-profond">Page introuvable</h1>
        <p className="text-muted text-sm max-w-sm">
          Cette piscine n'existe pas ou a été supprimée.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-bleu-profond text-white rounded-xl font-semibold
                   text-sm hover:bg-bleu-moyen transition-colors"
      >
        Retour à la liste
      </Link>
    </div>
  )
}