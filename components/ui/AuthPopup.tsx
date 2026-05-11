// components/ui/AuthPopup.tsx
// Pop-up affiché quand un utilisateur non connecté tente une action protégée
"use client"

import Link from "next/link"
import { useEffect } from "react"

interface AuthPopupProps {
  open: boolean
  onClose: () => void
  // Message contextuel selon l'action tentée
  message?: string
}

export function AuthPopup({
  open,
  onClose,
  message = "Vous devez être connecté·e pour accéder à cette fonctionnalité.",
}: AuthPopupProps) {
  // Fermer avec la touche Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Pop-up centré */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   z-50 w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6
                   flex flex-col gap-4"
        role="dialog"
        aria-modal="true"
        aria-label="Connexion requise"
      >
        {/* Icône + titre */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-3xl" aria-hidden="true">🔒</span>
          <h2 className="font-bold text-bleu-profond text-lg">
            Connexion requise
          </h2>
          <p className="text-sm text-muted leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            href="/connexion"
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm text-center
                       hover:bg-bleu-moyen transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="w-full py-3 border border-bleu-profond text-bleu-profond
                       rounded-xl font-semibold text-sm text-center
                       hover:bg-bleu-tres-pale transition-colors"
          >
            Créer un compte
          </Link>
        </div>

        {/* Fermer */}
        <button
          onClick={onClose}
          className="text-xs text-muted hover:text-foreground transition-colors text-center"
        >
          Continuer sans compte
        </button>
      </div>
    </>
  )
}