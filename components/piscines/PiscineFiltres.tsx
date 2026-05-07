// components/piscines/PiscineFiltres.tsx
// Panel de filtres multicritères — version simplifiée pour le demo day
"use client"

import type { PiscinesFiltres } from "@/hooks/usePiscines"

interface PiscineFiltresProps {
  filtres: PiscinesFiltres
  onMettreAJour: (cle: keyof PiscinesFiltres, valeur: PiscinesFiltres[typeof cle]) => void
  onReinitialiser: () => void
}

// Arrondissements de Paris (1 à 20)
const ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => i + 1)

export function PiscineFiltres({ filtres, onMettreAJour, onReinitialiser }: PiscineFiltresProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-bleu-profond text-sm">Filtres</h2>
        <button
          onClick={onReinitialiser}
          className="text-xs text-muted hover:text-rouge transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Arrondissement */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground" htmlFor="arrondissement">
          Arrondissement
        </label>
        <select
          id="arrondissement"
          value={filtres.arrondissement ?? ""}
          onChange={(e) =>
            onMettreAJour(
              "arrondissement",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="text-sm rounded-lg border border-border px-3 py-2 bg-white text-foreground
                     focus:outline-none focus:ring-2 focus:ring-bleu-clair"
        >
          <option value="">Tous les arrondissements</option>
          {ARRONDISSEMENTS.map((arr) => (
            <option key={arr} value={arr}>
              {arr}e arrondissement
            </option>
          ))}
        </select>
      </div>

      {/* Filtres booléens */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground">Accessibilité</label>

        <CheckboxFiltre
          id="acces_pmr"
          label="Accessible PMR"
          checked={filtres.acces_pmr === true}
          onChange={(val) => onMettreAJour("acces_pmr", val || undefined)}
        />
        <CheckboxFiltre
          id="queer_friendly"
          label="Queer Friendly"
          checked={filtres.queer_friendly === true}
          onChange={(val) => onMettreAJour("queer_friendly", val || undefined)}
        />
        <CheckboxFiltre
          id="is_open"
          label="Ouverte uniquement"
          checked={filtres.is_open === true}
          onChange={(val) => onMettreAJour("is_open", val || undefined)}
        />
        <CheckboxFiltre
          id="accepte_passe_paris"
          label="Accepte le Pass Paris"
          checked={filtres.accepte_passe_paris === true}
          onChange={(val) => onMettreAJour("accepte_passe_paris", val || undefined)}
        />
      </div>

    </div>
  )
}

// Sous-composant interne — checkbox réutilisable dans ce fichier
function CheckboxFiltre({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border text-bleu-moyen
                   focus:ring-bleu-clair accent-bleu-moyen"
      />
      <span className="text-sm text-foreground group-hover:text-bleu-moyen transition-colors">
        {label}
      </span>
    </label>
  )
}