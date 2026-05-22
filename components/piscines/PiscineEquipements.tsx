// components/piscines/PiscineEquipements.tsx
// Section équipements & espaces — affiche uniquement les différenciateurs réels
// Décision UX : cabines individuelles, douches collectives et douches individuelles
// ne sont pas affichées car présentes dans toutes les piscines parisiennes
// Server Component — pas de state

import type { Piscine } from "@/types/piscine"
import { SectionToggle } from "@/components/ui/SectionToggle"
import { Icon } from "@/components/ui/Icon"

interface PiscineEquipementsProps {
  piscine: Piscine
}

function EquipementItem({ label, actif }: { label: string; actif: boolean }) {
  return (
    <div
      className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
        actif ? "bg-vert/10 text-vert" : "bg-gray-50 text-muted line-through"
      }`}
    >
      <span aria-hidden="true">{actif ? "✓" : "✗"}</span>
      {label}
    </div>
  )
}

export function PiscineEquipements({ piscine }: PiscineEquipementsProps) {
  return (
    <SectionToggle
      titre="Équipements & espaces"
      icone={<Icon name="equipements" className="w-4 h-4 text-bleu-clair" />}
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Équipements */}
        <EquipementItem label="Sèche-cheveux" actif={piscine.seche_cheveux} />
        <EquipementItem label="Casiers" actif={piscine.casiers} />
        <EquipementItem label="Dist. boissons" actif={piscine.distributeur_boisson} />
        <EquipementItem label="Dist. équipements" actif={piscine.distributeur_equipements} />
        {/* Espaces — uniquement les différenciateurs */}
        <EquipementItem label="Solarium" actif={piscine.espace_solarium} />
        <EquipementItem label="Vestiaires mixtes" actif={piscine.vestiaires_mixtes} />
        <EquipementItem label="Cabine PMR" actif={piscine.cabine_pmr} />
      </div>
    </SectionToggle>
  )
}