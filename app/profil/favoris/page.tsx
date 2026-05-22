// app/profil/favoris/page.tsx
// Page liste des favoris de l'utilisateur connecté
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { authClient } from "@/src/lib/auth-client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { BoutonFavori } from "@/components/piscines/BoutonFavori"
import { useFavoris } from "@/hooks/useFavoris"
import type { Piscine } from "@/types/piscine"
import { Icon } from "@/components/ui/Icon"

type FavoriAvecPiscine = {
  id: string
  piscineId: number
  created_at: string
  piscine: Piscine
}

export default function FavorisPage() {
  const router = useRouter()
  const [favoris, setFavoris] = useState<FavoriAvecPiscine[]>([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  // useFavoris instancié une seule fois — fournit estFavori/toggleFavori/estConnecte
  const { estFavori, toggleFavori, estConnecte } = useFavoris()

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (!result?.data?.user) {
        router.push("/connexion")
        return
      }
      fetch("/api/favoris")
        .then((res) => res.json())
        .then((json) => setFavoris(json.data ?? []))
        .catch(() => setErreur("Impossible de charger vos favoris."))
        .finally(() => setLoading(false))
    })
  }, [router])

  // Quand l'utilisateur retire un favori, on le supprime aussi de la liste locale
  async function handleToggle(piscineId: number) {
    await toggleFavori(piscineId)
    // Si le favori vient d'être retiré, on le supprime de l'affichage
    if (estFavori(piscineId)) {
      setFavoris((prev) => prev.filter((f) => f.piscineId !== piscineId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner message="Chargement de vos favoris..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            ← Accueil
          </Link>
          <span className="text-muted">/</span>
          <span className="text-sm text-foreground font-semibold">Mes favoris</span>
        </div>

        <h1 className="text-2xl font-bold text-bleu-profond">
          Mes piscines favorites
        </h1>

        {/* Erreur */}
        {erreur && (
          <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
            {erreur}
          </div>
        )}

        {/* Liste vide */}
        {favoris.length === 0 && !erreur && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl" aria-hidden="true">♡</span>
            <h2 className="font-semibold text-foreground">Aucun favori pour le moment</h2>
            <p className="text-sm text-muted max-w-xs">
              Explorez les piscines et ajoutez vos préférées à vos favoris.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 bg-bleu-profond text-white rounded-xl
                         text-sm font-semibold hover:bg-bleu-moyen transition-colors"
            >
              Découvrir les piscines
            </Link>
          </div>
        )}

        {/* Liste des favoris */}
        {favoris.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">
              {favoris.length} piscine{favoris.length > 1 ? "s" : ""} sauvegardée{favoris.length > 1 ? "s" : ""}
            </p>

            {favoris.map(({ piscine, piscineId }) => (
              <div
                key={piscineId}
                className="bg-white rounded-2xl border border-border p-4
                           flex items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <p className="font-semibold text-bleu-profond text-sm leading-tight truncate">
                    {piscine.nom}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {piscine.adresse}, Paris {piscine.arrondissement}e
                  </p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <Badge
                      label={piscine.is_open ? "Ouverte" : "Fermée"}
                      variant={piscine.is_open ? "ouvert" : "ferme"}
                    />
                    {piscine.acces_pmr && <Badge label="PMR" variant="pmr" />}
                    {piscine.queer_friendly && <Badge label="QF" variant="queer" />}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <BoutonFavori
                    piscineId={piscineId}
                    variante="card"
                    estFavori={estFavori(piscineId)}
                    onToggle={handleToggle}
                    estConnecte={estConnecte}
                  />
                  <Link
                    href={`/piscines/${piscineId}`}
                    className="p-2 rounded-xl bg-bleu-tres-pale text-bleu-moyen
                               hover:bg-bleu-pale transition-colors text-sm"
                    aria-label="Voir la fiche"
                  >
                    →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}