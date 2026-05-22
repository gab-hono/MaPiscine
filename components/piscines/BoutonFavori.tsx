// components/piscines/BoutonFavori.tsx
// Bouton toggle favori — coeur plein/vide
// Reçoit l'état des favoris via props
// Ouvre AuthPopup si l'utilisateur n'est pas connecté
"use client"

import { useState } from "react"
import { AuthPopup } from "@/components/ui/AuthPopup"
import { Icon } from "@/components/ui/Icon"

interface BoutonFavoriProps {
  piscineId: number
  variante?: "card" | "detail"
  estFavori: boolean
  onToggle: (piscineId: number) => void
  estConnecte: boolean
}

export function BoutonFavori({
  piscineId,
  variante = "card",
  estFavori,
  onToggle,
  estConnecte,
}: BoutonFavoriProps) {
  const [popupOuvert, setPopupOuvert] = useState(false)
  const [enCours, setEnCours] = useState(false)

  async function handleClick() {
    if (!estConnecte) {
      setPopupOuvert(true)
      return
    }
    setEnCours(true)
    await onToggle(piscineId)
    setEnCours(false)
  }

  if (variante === "detail") {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={enCours}
          className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-xl font-semibold text-sm transition-colors
            ${estFavori
              ? "bg-rouge/10 text-rouge border border-rouge/20 hover:bg-rouge/20"
              : "bg-bleu-profond text-white hover:bg-bleu-moyen"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Icon
            name={estFavori ? "coeur-plein" : "coeur"}
            className="w-4 h-4"
          />
          {estFavori ? "Dans mes favoris" : "Ajouter aux favoris"}
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
          ${estFavori
            ? "text-rouge hover:text-rouge/70"
            : "text-muted hover:text-rouge"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Icon
          name={estFavori ? "coeur-plein" : "coeur"}
          className="w-5 h-5"
        />
      </button>

      <AuthPopup
        open={popupOuvert}
        onClose={() => setPopupOuvert(false)}
        message="Connectez-vous pour ajouter cette piscine à vos favoris."
      />
    </>
  )
}