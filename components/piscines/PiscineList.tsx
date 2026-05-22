// components/piscines/PiscineList.tsx
// Grille de cartes piscines — gère les états vide et chargement
// Transmet les props favoris à chaque PiscineCard

import type { Piscine } from "@/types/piscine"
import { PiscineCard } from "@/components/piscines/PiscineCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"

interface PiscineListProps {
  piscines: Piscine[]
  loading: boolean
  onReinitialiserFiltres: () => void
  // Props favoris — gérés par PiscineListPage, transmis ici
  estFavori: (piscineId: number) => boolean
  onToggleFavori: (piscineId: number) => void
  estConnecte: boolean
}

export function PiscineList({
  piscines,
  loading,
  onReinitialiserFiltres,
  estFavori,
  onToggleFavori,
  estConnecte,
}: PiscineListProps) {
  if (loading) {
    return <LoadingSpinner message="Recherche des piscines..." />
  }

  if (piscines.length === 0) {
    return (
      <EmptyState
        title="Aucune piscine trouvée"
        description="Essayez de modifier vos filtres pour voir plus de résultats."
        action={
          <button
            onClick={onReinitialiserFiltres}
            className="text-sm font-semibold text-bleu-moyen hover:text-bleu-profond transition-colors underline underline-offset-2"
          >
            Réinitialiser les filtres
          </button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {piscines.map((piscine) => (
        <PiscineCard
          key={piscine.id}
          piscine={piscine}
          estFavori={estFavori(piscine.id)}
          onToggleFavori={onToggleFavori}
          estConnecte={estConnecte}
        />
      ))}
    </div>
  )
}