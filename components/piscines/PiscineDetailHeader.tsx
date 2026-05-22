// components/piscines/PiscineDetailHeader.tsx
// En-tête de la page détail — image, nom, badges, contact
// Server Component — pas de state

import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"
import { Icon } from "@/components/ui/Icon"

interface PiscineDetailHeaderProps {
  piscine: Piscine
}

export function PiscineDetailHeader({ piscine }: PiscineDetailHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">

      {/* Image */}
      <div className="h-48 bg-bleu-tres-pale flex items-center justify-center overflow-hidden">
        {piscine.images_galerie.length > 0 ? (
          <img
            src={piscine.images_galerie[0]}
            alt={piscine.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon name="natation" className="w-16 h-16 text-bleu-clair opacity-30" />
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">

        {/* Nom + adresse */}
        <div>
          <h1 className="text-2xl font-bold text-bleu-profond">{piscine.nom}</h1>
          <p className="text-sm text-muted mt-1 flex items-center gap-1.5">
            <Icon name="pin" className="w-3.5 h-3.5 text-bleu-clair shrink-0" />
            {piscine.adresse}, Paris {piscine.arrondissement}e
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            label={piscine.is_open ? "Ouverte" : "Fermée"}
            variant={piscine.is_open ? "ouvert" : "ferme"}
            size="md"
          />
          {piscine.acces_pmr && <Badge label="Accessible PMR" variant="pmr" size="md" />}
          {piscine.queer_friendly && <Badge label="Queer Friendly" variant="queer" size="md" />}
          {piscine.accepte_passe_paris && <Badge label="Pass 3 mois" variant="passe" size="md" />}
        </div>

        {/* Description */}
        {piscine.description && (
          <p className="text-sm text-foreground leading-relaxed">{piscine.description}</p>
        )}

        {/* Contact */}
        <div className="flex flex-wrap gap-3 pt-1">
          {piscine.telephone && (
            <a
              href={`tel:${piscine.telephone}`}
              className="flex items-center gap-1.5 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
            >
              <Icon name="telephone" className="w-3.5 h-3.5" />
              {piscine.telephone}
            </a>
          )}
          {piscine.site_web && (
            <a
              href={piscine.site_web}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
            >
              <Icon name="site-web" className="w-3.5 h-3.5" />
              Site web
            </a>
          )}
          {piscine.latitude && piscine.longitude && (
            <a
              href={`https://www.google.com/maps?q=${piscine.latitude},${piscine.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
            >
              <Icon name="pin" className="w-3.5 h-3.5" />
              Voir sur Google Maps
            </a>
          )}
        </div>

      </div>
    </div>
  )
}