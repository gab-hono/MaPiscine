// components/piscines/PiscineListPage.tsx
// Orchestrateur client — gère l'état global (filtres, toggle vue, recherche)
"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { usePiscines } from "@/hooks/usePiscines"
import { PiscineList } from "@/components/piscines/PiscineList"
import { FiltresDrawer } from "@/components/piscines/FiltresDrawer"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import type { PiscinesFiltres } from "@/hooks/usePiscines"

const PiscineMap = dynamic(
  () => import("@/components/piscines/PiscineMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-125 bg-bleu-tres-pale rounded-2xl flex items-center justify-center">
        <LoadingSpinner message="Chargement de la carte..." />
      </div>
    ),
  }
)

type VueMode = "liste" | "carte"

// -----------------------------------------------------------------
// Utilitaire : compte le nombre de filtres actifs
// Utilisé pour afficher le badge sur le bouton Filtres
// -----------------------------------------------------------------

function compterFiltresActifs(filtres: PiscinesFiltres): number {
  return Object.values(filtres).filter((v) => v !== undefined).length
}

export function PiscineListPage() {
  const [vue, setVue] = useState<VueMode>("liste")
  const [filtresOuverts, setFiltresOuverts] = useState(false)
  const [recherche, setRecherche] = useState("")

  const {
    piscines,
    loading,
    erreur,
    filtres,
    mettreAJourFiltre,
    reinitialiserFiltres,

  } = usePiscines()

  // Filtrage frontend par nom — appliqué sur les piscines déjà chargées
  // useMemo évite de recalculer à chaque render si piscines et recherche n'ont pas changé
  const piscinesFiltrees = useMemo(() => {
    if (!recherche.trim()) return piscines
    const terme = recherche.toLowerCase().trim()
    return piscines.filter(
      (p) =>
        p.nom.toLowerCase().includes(terme) ||
        p.adresse.toLowerCase().includes(terme) ||
        p.arrondissement.toString().includes(terme)
    )
  }, [piscines, recherche])

  const nombreFiltresActifs = compterFiltresActifs(filtres)

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">

        {/* Barre de recherche + contrôles */}
        <div className="flex items-center gap-3">

          {/* Barre de recherche */}
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm"
              aria-hidden="true"
            >
              🔍
            </span>
            <input
              type="search"
              placeholder="Rechercher une piscine..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white
                         text-sm text-foreground placeholder:text-muted
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Bouton Filtres */}
          <button
            onClick={() => setFiltresOuverts(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                       border border-border bg-white text-sm font-semibold
                       text-foreground hover:bg-bleu-tres-pale transition-colors
                       shrink-0"
            aria-label="Ouvrir les filtres"
          >
            <span aria-hidden="true">⚙️</span>
            Filtres
            {/* Badge nombre de filtres actifs */}
            {nombreFiltresActifs > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-bleu-moyen text-white
                               text-xs rounded-full w-5 h-5 flex items-center justify-center
                               font-bold">
                {nombreFiltresActifs}
              </span>
            )}
          </button>

          {/* Toggle liste / carte */}
          <div className="flex rounded-xl border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setVue("liste")}
              className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
                vue === "liste"
                  ? "bg-bleu-profond text-white"
                  : "bg-white text-muted hover:bg-bleu-tres-pale"
              }`}
              aria-label="Vue liste"
            >
              ≡ Liste
            </button>
            <button
              onClick={() => setVue("carte")}
              className={`px-3 py-2.5 text-sm font-semibold transition-colors ${
                vue === "carte"
                  ? "bg-bleu-profond text-white"
                  : "bg-white text-muted hover:bg-bleu-tres-pale"
              }`}
              aria-label="Vue carte"
            >
              ⊞ Carte
            </button>
          </div>
        </div>

        {/* Résumé des filtres actifs + recherche */}
        {(nombreFiltresActifs > 0 || recherche.trim()) && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>
              {piscinesFiltrees.length} résultat{piscinesFiltrees.length !== 1 ? "s" : ""}
              {recherche.trim() && ` pour "${recherche}"`}
              {nombreFiltresActifs > 0 && ` · ${nombreFiltresActifs} filtre${nombreFiltresActifs > 1 ? "s" : ""} actif${nombreFiltresActifs > 1 ? "s" : ""}`}
            </span>
            <button
              onClick={() => { reinitialiserFiltres(); setRecherche("") }}
              className="text-rouge hover:underline text-xs"
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* Erreur API */}
        {erreur && (
          <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
            Une erreur est survenue : {erreur}
          </div>
        )}

        {/* Mode liste */}
        {vue === "liste" && (
          <>
            <PiscineList
              piscines={piscinesFiltrees}
              loading={loading}
              onReinitialiserFiltres={() => { reinitialiserFiltres(); setRecherche("") }}
            />
          </>
        )}

        {/* Mode carte */}
        {vue === "carte" && (
          <div className="h-150">
            {loading ? (
              <div className="min-h-125 bg-bleu-tres-pale rounded-2xl flex items-center justify-center">
                <LoadingSpinner message="Chargement des piscines..." />
              </div>
            ) : (
              <PiscineMap piscines={piscinesFiltrees} />
            )}
          </div>
        )}

      </div>

      {/* Drawer filtres */}
      <FiltresDrawer
        open={filtresOuverts}
        onClose={() => setFiltresOuverts(false)}
        filtres={filtres}
        onMettreAJour={mettreAJourFiltre}
        onReinitialiser={reinitialiserFiltres}
        nombreFiltresActifs={nombreFiltresActifs}
      />
    </div>
  )
}