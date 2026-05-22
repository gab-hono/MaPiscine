// components/piscines/PiscineFiltres.tsx
// Panel de filtres multicritères
// Décision UX : cabines_individuelles, douches_individuelles et douches_collectives
// supprimées des filtres car présentes dans toutes les piscines parisiennes
"use client"

import type { PiscinesFiltres } from "@/hooks/usePiscines"

function SectionFiltres({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-foreground">{titre}</p>
      {children}
    </div>
  )
}

function CheckboxFiltre({
  id, label, checked, onChange,
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
        className="w-4 h-4 rounded border-border accent-bleu-moyen focus:ring-bleu-clair"
      />
      <span className="text-sm text-foreground group-hover:text-bleu-moyen transition-colors">
        {label}
      </span>
    </label>
  )
}

interface PiscineFiltresProps {
  filtres: PiscinesFiltres
  onMettreAJour: (cle: keyof PiscinesFiltres, valeur: PiscinesFiltres[typeof cle]) => void
  onReinitialiser: () => void
}

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
            onMettreAJour("arrondissement", e.target.value ? Number(e.target.value) : undefined)
          }
          className="text-sm rounded-lg border border-border px-3 py-2 bg-white text-foreground
                     focus:outline-none focus:ring-2 focus:ring-bleu-clair"
        >
          <option value="">Tous les arrondissements</option>
          {ARRONDISSEMENTS.map((arr) => (
            <option key={arr} value={arr}>{arr}e arrondissement</option>
          ))}
        </select>
      </div>

      {/* Accessibilité */}
      <SectionFiltres titre="Accessibilité">
        <CheckboxFiltre
          id="acces_pmr" label="Accessible PMR"
          checked={filtres.acces_pmr === true}
          onChange={(v) => onMettreAJour("acces_pmr", v || undefined)}
        />
        <CheckboxFiltre
          id="queer_friendly" label="Queer Friendly"
          checked={filtres.queer_friendly === true}
          onChange={(v) => onMettreAJour("queer_friendly", v || undefined)}
        />
        <CheckboxFiltre
          id="is_open" label="Ouverte uniquement"
          checked={filtres.is_open === true}
          onChange={(v) => onMettreAJour("is_open", v || undefined)}
        />
        <CheckboxFiltre
          id="accepte_passe_paris" label="Pass 3 mois"
          checked={filtres.accepte_passe_paris === true}
          onChange={(v) => onMettreAJour("accepte_passe_paris", v || undefined)}
        />
      </SectionFiltres>

      {/* Équipements */}
      <SectionFiltres titre="Équipements">
        <CheckboxFiltre
          id="seche_cheveux" label="Sèche-cheveux"
          checked={filtres.seche_cheveux === true}
          onChange={(v) => onMettreAJour("seche_cheveux", v || undefined)}
        />
        <CheckboxFiltre
          id="casiers" label="Casiers"
          checked={filtres.casiers === true}
          onChange={(v) => onMettreAJour("casiers", v || undefined)}
        />
        <CheckboxFiltre
          id="distributeur_boisson" label="Distributeur de boissons"
          checked={filtres.distributeur_boisson === true}
          onChange={(v) => onMettreAJour("distributeur_boisson", v || undefined)}
        />
        <CheckboxFiltre
          id="distributeur_equipements" label="Distributeur d'équipements"
          checked={filtres.distributeur_equipements === true}
          onChange={(v) => onMettreAJour("distributeur_equipements", v || undefined)}
        />
      </SectionFiltres>

      {/* Espaces — uniquement les différenciateurs */}
      <SectionFiltres titre="Espaces">
        <CheckboxFiltre
          id="espace_solarium" label="Espace solarium"
          checked={filtres.espace_solarium === true}
          onChange={(v) => onMettreAJour("espace_solarium", v || undefined)}
        />
        <CheckboxFiltre
          id="vestiaires_mixtes" label="Vestiaires mixtes"
          checked={filtres.vestiaires_mixtes === true}
          onChange={(v) => onMettreAJour("vestiaires_mixtes", v || undefined)}
        />
        <CheckboxFiltre
          id="cabine_pmr" label="Cabine PMR"
          checked={filtres.cabine_pmr === true}
          onChange={(v) => onMettreAJour("cabine_pmr", v || undefined)}
        />
      </SectionFiltres>

      {/* Bassins */}
      <SectionFiltres titre="Bassins">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-muted">Longueur du bassin</label>
          <div className="flex gap-2">
            {[25, 50].map((longueur) => (
              <button
                key={longueur}
                type="button"
                onClick={() =>
                  filtres.longueur_bassin === longueur
                    ? onMettreAJour("longueur_bassin", undefined)
                    : onMettreAJour("longueur_bassin", longueur)
                }
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  filtres.longueur_bassin === longueur
                    ? "bg-bleu-profond text-white border-bleu-profond"
                    : "bg-white text-foreground border-border hover:bg-bleu-tres-pale"
                }`}
              >
                {longueur}m
              </button>
            ))}
          </div>
        </div>
      </SectionFiltres>

    </div>
  )
}