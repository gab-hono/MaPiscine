// components/piscines/PiscineCard.tsx
// Carte visuelle d'une piscine dans la liste
// Reçoit l'état favoris via props — pas d'appel API direct ici

import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"
import { BoutonFavori } from "@/components/piscines/BoutonFavori"
import { Icon } from "@/components/ui/Icon"

interface PiscineCardProps {
  piscine: Piscine
  estFavori: boolean
  onToggleFavori: (piscineId: number) => void
  estConnecte: boolean
}

function CompteurAvis({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-xs text-muted">Aucun avis</span>
  }
  return (
    <span className="flex items-center gap-1 text-xs text-muted">
      <Icon name="etoile-pleine" className="w-3 h-3 text-orange" />
      {count} avis
    </span>
  )
}

export function PiscineCard({ piscine, estFavori, onToggleFavori, estConnecte }: PiscineCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">

      {/* Zone image */}
      <div className="relative h-40 md:h-48 bg-bleu-tres-pale flex items-center justify-center overflow-hidden shrink-0">
        {piscine.images_galerie.length > 0 ? (
          <img
            src={piscine.images_galerie[0]}
            alt={piscine.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon name="natation" className="w-14 h-14 text-bleu-clair opacity-30" />
        )}

        {/* Bouton favori */}
        <div className="absolute top-2 right-2 bg-white rounded-full shadow-sm p-0.5">
          <BoutonFavori
            piscineId={piscine.id}
            variante="card"
            estFavori={estFavori}
            onToggle={onToggleFavori}
            estConnecte={estConnecte}
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 md:p-5 flex flex-col gap-3 flex-1">

        {/* Nom + adresse */}
        <div>
          <Link href={`/piscines/${piscine.id}`}>
            <h2 className="font-bold text-bleu-profond text-base md:text-lg leading-tight hover:underline">
              {piscine.nom}
            </h2>
          </Link>
          <p className="text-xs md:text-sm text-muted mt-0.5 flex items-center gap-1">
            <Icon name="pin" className="w-3 h-3 text-bleu-clair shrink-0" />
            {piscine.adresse}, Paris {piscine.arrondissement}e
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            label={piscine.is_open ? "Ouverte" : "Fermée"}
            variant={piscine.is_open ? "ouvert" : "ferme"}
          />
          {piscine.acces_pmr && <Badge label="Accessible PMR" variant="pmr" />}
          {piscine.queer_friendly && <Badge label="Queer Friendly" variant="queer" />}
          {piscine.accepte_passe_paris && <Badge label="Pass 3 mois" variant="passe" />}
        </div>

        {/* Avis + lien fiche — poussé en bas de la carte */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <CompteurAvis count={piscine._count?.avis ?? 0} />
          <Link
            href={`/piscines/${piscine.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            Voir la fiche
            <Icon name="fleche-droite" className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  )
}