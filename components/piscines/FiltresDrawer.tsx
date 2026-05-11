// components/piscines/FiltresDrawer.tsx
// Drawer/modal qui contient le panneau de filtres
// S'ouvre depuis le bouton "Filtres" de la page principale
"use client"

import { useEffect } from "react"
import { PiscineFiltres } from "@/components/piscines/PiscineFiltres"
import type { PiscinesFiltres } from "@/hooks/usePiscines"

interface FiltresDrawerProps {
  open: boolean
  onClose: () => void
  filtres: PiscinesFiltres
  onMettreAJour: (cle: keyof PiscinesFiltres, valeur: PiscinesFiltres[typeof cle]) => void
  onReinitialiser: () => void
  // Nombre de filtres actifs — affiché sur le bouton
  nombreFiltresActifs: number
}

export function FiltresDrawer({
  open,
  onClose,
  filtres,
  onMettreAJour,
  onReinitialiser,
  nombreFiltresActifs,
}: FiltresDrawerProps) {
  // Bloquer le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panneau — slide depuis la droite */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Filtres de recherche"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-bold text-bleu-profond">
            Filtres
            {nombreFiltresActifs > 0 && (
              <span className="ml-2 text-xs bg-bleu-moyen text-white rounded-full px-2 py-0.5">
                {nombreFiltresActifs}
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Fermer les filtres"
          >
            ✕
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <PiscineFiltres
            filtres={filtres}
            onMettreAJour={onMettreAJour}
            onReinitialiser={onReinitialiser}
          />
        </div>

        {/* Bouton Appliquer */}
        <div className="px-4 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm hover:bg-bleu-moyen transition-colors"
          >
            Voir les résultats
            {nombreFiltresActifs > 0 && ` (${nombreFiltresActifs} filtre${nombreFiltresActifs > 1 ? "s" : ""})`}
          </button>
        </div>
      </div>
    </>
  )
}