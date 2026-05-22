// components/piscines/PiscineHoraires.tsx
// Section horaires — groupement par jour et par période
// Server Component — pas de state

import type { Piscine } from "@/types/piscine"
import { SectionToggle } from "@/components/ui/SectionToggle"
import { Icon } from "@/components/ui/Icon"

interface PiscineHorairesProps {
  horairesGroupes: {
    SCOLAIRE: Record<string, Piscine["horaires_reguliers"]>
    VACANCES: Record<string, Piscine["horaires_reguliers"]>
  }
}

export function PiscineHoraires({ horairesGroupes }: PiscineHorairesProps) {
  return (
    <SectionToggle
      titre="Horaires"
      icone={<Icon name="horloge" className="w-4 h-4 text-bleu-clair" />}
    >
      <div className="flex flex-col gap-3">
        {(["SCOLAIRE", "VACANCES"] as const).map((periode) => {
          const parJour = horairesGroupes[periode]
          if (Object.keys(parJour).length === 0) return null

          return (
            <SectionToggle
              key={periode}
              titre={periode === "SCOLAIRE" ? "Période scolaire" : "Période vacances scolaires"}
              variante="plain"
              defaultOuvert={periode === "SCOLAIRE"}
            >
              <div className="flex flex-col">
                {Object.entries(parJour).map(([jour, creneaux]) => (
                  <div
                    key={jour}
                    className="flex justify-between text-sm py-1.5 border-b border-border last:border-0"
                  >
                    <span className="text-foreground font-medium w-24">{jour}</span>
                    {creneaux[0].ferme ? (
                      <span className="text-rouge">Fermé</span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        {creneaux.map((h) => (
                          <span key={h.id} className="text-muted">
                            {h.heure_ouverture} – {h.heure_fermeture}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionToggle>
          )
        })}
      </div>
    </SectionToggle>
  )
}