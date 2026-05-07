// components/piscines/PiscineListPage.tsx
// Orchestrateur client — gère l'état global (filtres, pagination, toggle vue)
// C'est le seul composant qui utilise usePiscines — les enfants reçoivent des props
"use client"

import { useState } from "react"
import { usePiscines } from "@/hooks/usePiscines"
import { PiscineFiltres } from "@/components/piscines/PiscineFiltres"
import { PiscineList } from "@/components/piscines/PiscineList"
import { Pagination } from "@/components/ui/Pagination"

// Le mapa Leaflet sera chargé dynamiquement (ssr: false) — à implémenter dans PiscineMap
// import dynamic from "next/dynamic"
// const PiscineMap = dynamic(() => import("@/components/piscines/PiscineMap"), { ssr: false })

type VueMode = "liste" | "carte"

export function PiscineListPage() {
  const [vue, setVue] = useState<VueMode>("liste")

  const {
    piscines,
    pagination,
    loading,
    erreur,
    filtres,
    mettreAJourFiltre,
    reinitialiserFiltres,
    page,
    setPage,
  } = usePiscines(12)

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* En-tête + toggle liste/carte */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-bleu-profond">
            Piscines de Paris
          </h1>

          {/* Toggle liste / carte */}
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setVue("liste")}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                vue === "liste"
                  ? "bg-bleu-profond text-white"
                  : "bg-white text-muted hover:bg-bleu-tres-pale"
              }`}
            >
              ≡ Liste
            </button>
            <button
              onClick={() => setVue("carte")}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                vue === "carte"
                  ? "bg-bleu-profond text-white"
                  : "bg-white text-muted hover:bg-bleu-tres-pale"
              }`}
            >
              ⊞ Carte
            </button>
          </div>
        </div>

        {/* Layout principal : filtres + contenu */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Panneau filtres — fixe à gauche sur desktop, plein largeur sur mobile */}
          <aside className="lg:w-64 shrink-0">
            <PiscineFiltres
              filtres={filtres}
              onMettreAJour={mettreAJourFiltre}
              onReinitialiser={reinitialiserFiltres}
            />
          </aside>

          {/* Zone de contenu principale */}
          <main className="flex-1 flex flex-col gap-4">

            {/* Erreur API */}
            {erreur && (
              <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
                Une erreur est survenue : {erreur}
              </div>
            )}

            {/* Mode liste ou carte */}
            {vue === "liste" ? (
              <>
                <PiscineList
                  piscines={piscines}
                  loading={loading}
                  onReinitialiserFiltres={reinitialiserFiltres}
                />
                {pagination && (
                  <Pagination pagination={pagination} onPageChange={setPage} />
                )}
              </>
            ) : (
              // Placeholder carte — sera remplacé par PiscineMap avec dynamic import
              <div className="h-96 bg-bleu-tres-pale rounded-2xl flex items-center justify-center border border-border">
                <p className="text-muted text-sm">Carte à venir (Leaflet)</p>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}