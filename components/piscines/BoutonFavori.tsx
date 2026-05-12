// components/piscines/BoutonFavori.tsx
// Bouton toggle favori — coeur plein/vide
// Ouvre AuthPopup si l'utilisateur n'est pas connecté
"use client"

import { useState } from "react"
import { useFavoris } from "@/hooks/useFavoris"
import { AuthPopup } from "@/components/ui/AuthPopup"

interface BoutonFavoriProps {
  piscineId: number
  // Variante visuelle : "card" (petit, sur les cards) ou "detail" (grand, sur la page détail)
  variante?: "card" | "detail"
}

export function BoutonFavori({ piscineId, variante = "card" }: BoutonFavoriProps) {
  const { estFavori, toggleFavori, estConnecte } = useFavoris()
  const [popupOuvert, setPopupOuvert] = useState(false)
  const [enCours, setEnCours] = useState(false)

  const favori = estFavori(piscineId)

  async function handleClick() {
    if (!estConnecte) {
      setPopupOuvert(true)
      return
    }

    setEnCours(true)
    await toggleFavori(piscineId)
    setEnCours(false)
  }

  if (variante === "detail") {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={enCours}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors
            ${favori
              ? "bg-rouge/10 text-rouge border border-rouge/20 hover:bg-rouge/20"
              : "bg-bleu-profond text-white hover:bg-bleu-moyen"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {favori ? "♥ Dans mes favoris" : "♡ Ajouter aux favoris"}
        </button>

        <AuthPopup
          open={popupOuvert}
          onClose={() => setPopupOuvert(false)}
          message="Connectez-vous pour ajouter cette piscine à vos favoris."
        />
      </>
    )
  }

  // Variante "card" — petit bouton icône
  return (
    <>
      <button
        onClick={handleClick}
        disabled={enCours}
        className={`p-1.5 rounded-full transition-colors
          ${favori
            ? "text-rouge hover:text-rouge/70"
            : "text-muted hover:text-rouge"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <span className="text-lg" aria-hidden="true">
          {favori ? "♥" : "♡"}
        </span>
      </button>

      <AuthPopup
        open={popupOuvert}
        onClose={() => setPopupOuvert(false)}
        message="Connectez-vous pour ajouter cette piscine à vos favoris."
      />
    </>
  )
}