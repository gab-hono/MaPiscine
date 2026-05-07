// components/piscines/PiscineListPage.tsx
// Orchestrateur client — gère l'état global (filtres, pagination, toggle vue)
"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { usePiscines } from "@/hooks/usePiscines"
import { PiscineFiltres } from "@/components/piscines/PiscineFiltres"
import { PiscineList } from "@/components/piscines/PiscineList"
import { Pagination } from "@/components/ui/Pagination"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

// -----------------------------------------------------------------
// Dynamic import de Leaflet — ssr: false obligatoire
// Leaflet accède à window, qui n'existe pas côté serveur
// Sans ça : "window is not defined" au build
// -----------------------------------------------------------------

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

          <aside className="lg:w-64 shrink-0">
            <PiscineFiltres
              filtres={filtres}
              onMettreAJour={mettreAJourFiltre}
              onReinitialiser={reinitialiserFiltres}
            />
          </aside>

          <main className="flex-1 flex flex-col gap-4">

            {erreur && (
              <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
                Une erreur est survenue : {erreur}
              </div>
            )}

            {/* Mode liste */}
            {vue === "liste" && (
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
            )}

          {/* Mode carte — monté seulement quand l'utilisateur clique sur Carte */}
          {vue === "carte" && (
            <div className="h-150">
              {loading ? (
                <div className="min-h-125 bg-bleu-tres-pale rounded-2xl flex items-center justify-center">
                  <LoadingSpinner message="Chargement des piscines..." />
                </div>
              ) : (
                <PiscineMap piscines={piscines} />
              )}
            </div>
          )}

          </main>
        </div>
      </div>
    </div>
  )
}