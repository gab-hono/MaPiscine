// components/piscines/PiscineCard.tsx
// Carte visuelle d'une piscine dans la liste — basée sur la maquette haute fidélité

import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"

interface PiscineCardProps {
  piscine: Piscine
}

// Calcule la note moyenne à partir des _count (pas de notes dans la liste)
// On affiche les étoiles seulement si on a un nombre d'avis > 0
function EtoilesAvis({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-xs text-muted">Aucun avis</span>
  }
  return (
    <span className="text-xs text-muted">
      ★★★★☆ <span className="ml-1">({count} avis)</span>
    </span>
  )
}

export function PiscineCard({ piscine }: PiscineCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      
      {/* Zone image — placeholder aquatique si pas d'image */}
      <div className="h-32 bg-bleu-tres-pale flex items-center justify-center overflow-hidden">
        {piscine.images_galerie.length > 0 ? (
          <img
            src={piscine.images_galerie[0]}
            alt={piscine.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl opacity-30" aria-hidden="true">🏊</span>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-4 flex flex-col gap-3">

        {/* Nom + adresse */}
        <div>
          <h2 className="font-bold text-bleu-profond text-base leading-tight">
            {piscine.nom}
          </h2>
          <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
            <span aria-hidden="true">📍</span>
            {piscine.adresse}, Paris {piscine.arrondissement}e
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            label={piscine.is_open ? "Ouverte" : "Fermée"}
            variant={piscine.is_open ? "ouvert" : "ferme"}
          />
          {piscine.acces_pmr && (
            <Badge label="Accessible PMR" variant="pmr" />
          )}
          {piscine.queer_friendly && (
            <Badge label="Queer Friendly" variant="queer" />
          )}
          {piscine.accepte_passe_paris && (
            <Badge label="Pass 3 mois" variant="passe" />
          )}
        </div>

        {/* Avis + action */}
        <div className="flex items-center justify-between">
          <EtoilesAvis count={piscine._count?.avis ?? 0} />
          <Link
            href={`/piscines/${piscine.id}`}
            className="text-sm font-semibold text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            Voir la fiche →
          </Link>
        </div>

      </div>
    </div>
  )
}