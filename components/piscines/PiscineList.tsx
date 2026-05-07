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
}

export function PiscineList({ piscines, loading, onReinitialiserFiltres }: PiscineListProps) {
  // État chargement
  if (loading) {
    return <LoadingSpinner message="Recherche des piscines..." />
  }

  // État vide
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

  // Grille de cartes — responsive : 1 colonne mobile, 2 tablette, 3 desktop
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {piscines.map((piscine) => (
        <PiscineCard key={piscine.id} piscine={piscine} />
      ))}
    </div>
  )
}