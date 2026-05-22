// components/piscines/PiscineListPage.tsx
// Orchestrateur client — gère l'état global (filtres, toggle vue, recherche, favoris)
"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { usePiscines } from "@/hooks/usePiscines"
import { useFavoris } from "@/hooks/useFavoris"
import { PiscineList } from "@/components/piscines/PiscineList"
import { FiltresDrawer } from "@/components/piscines/FiltresDrawer"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Icon } from "@/components/ui/Icon"
import type { PiscinesFiltres } from "@/hooks/usePiscines"

const PiscineMap = dynamic(
  () => import("@/components/piscines/PiscineMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[500px] bg-bleu-tres-pale rounded-2xl flex items-center justify-center">
        <LoadingSpinner message="Chargement de la carte..." />
      </div>
    ),
  }
)

type VueMode = "liste" | "carte"

function compterFiltresActifs(filtres: PiscinesFiltres): number {
  return Object.values(filtres).filter((v) => v !== undefined).length
}

export function PiscineListPage() {
  const [vue, setVue] = useState<VueMode>("liste")
  const [filtresOuverts, setFiltresOuverts] = useState(false)
  const [recherche, setRecherche] = useState("")

  const { piscines, loading, erreur, filtres, mettreAJourFiltre, reinitialiserFiltres } = usePiscines()
  const { estFavori, toggleFavori, estConnecte } = useFavoris()

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
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-5 md:gap-6">

        {/* Barre de recherche + contrôles */}
        <div className="flex items-center gap-3">

          {/* Barre de recherche — plus haute en desktop */}
          <div className="relative flex-1">
            <Icon
              name="lupa"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            />
            <input
              type="search"
              placeholder="Rechercher une piscine..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-border bg-white
                         text-sm md:text-base text-foreground placeholder:text-muted
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Bouton Filtres */}
          <button
            onClick={() => setFiltresOuverts(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 md:py-3 rounded-xl
                       border border-border bg-white text-sm md:text-base font-semibold
                       text-foreground hover:bg-bleu-tres-pale transition-colors shrink-0"
            aria-label="Ouvrir les filtres"
          >
            <Icon name="filtres" className="w-4 h-4 text-bleu-clair" />
            Filtres
            {nombreFiltresActifs > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-bleu-moyen text-white
                               text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {nombreFiltresActifs}
              </span>
            )}
          </button>

          {/* Toggle liste / carte */}
          <div className="flex rounded-xl border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setVue("liste")}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base font-semibold transition-colors ${
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
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base font-semibold transition-colors ${
                vue === "carte"
                  ? "bg-bleu-profond text-white"
                  : "bg-white text-muted hover:bg-bleu-tres-pale"
              }`}
              aria-label="Vue carte"
            >
              <Icon name="carte" className="w-4 h-4" />
              Carte
            </button>
          </div>
        </div>

        {/* Résumé filtres */}
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

        {/* Erreur */}
        {erreur && (
          <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
            Une erreur est survenue : {erreur}
          </div>
        )}

        {/* Mode liste */}
        {vue === "liste" && (
          <PiscineList
            piscines={piscinesFiltrees}
            loading={loading}
            onReinitialiserFiltres={() => { reinitialiserFiltres(); setRecherche("") }}
            estFavori={estFavori}
            onToggleFavori={toggleFavori}
            estConnecte={estConnecte}
          />
        )}

        {/* Mode carte */}
        {vue === "carte" && (
          <div className="h-[600px] md:h-[700px]">
            {loading ? (
              <div className="h-full bg-bleu-tres-pale rounded-2xl flex items-center justify-center">
                <LoadingSpinner message="Chargement des piscines..." />
              </div>
            ) : (
              <PiscineMap piscines={piscinesFiltrees} />
            )}
          </div>
        )}

      </div>

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