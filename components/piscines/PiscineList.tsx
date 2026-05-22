// components/piscines/PiscineList.tsx
// Grille de cartes piscines — gère les états vide et chargement

import type { Piscine } from "@/types/piscine"
import { PiscineCard } from "@/components/piscines/PiscineCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"

interface PiscineListProps {
  piscines: Piscine[]
  loading: boolean
  onReinitialiserFiltres: () => void
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
    // 1 col mobile → 2 col tablette → 3 col desktop → 4 col grand écran
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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