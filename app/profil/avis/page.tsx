// app/profil/avis/page.tsx
"use client"

import { Etoiles } from "@/components/ui/Etoiles"
import { Icon } from "@/components/ui/Icon"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { authClient } from "@/src/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AvisUtilisateur, FormulaireModification } from "@/components/piscines/FormulaireModificationAvis"

export default function ProfilAvisPage() {
  const router = useRouter()
  const [avis, setAvis] = useState<AvisUtilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)
  const [avisEnEdition, setAvisEnEdition] = useState<string | null>(null)
  const [suppressionEnCours, setSuppressionEnCours] = useState<string | null>(null)

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (!result?.data?.user) {
        router.push("/connexion")
        return
      }
      fetch("/api/avis")
        .then((res) => res.json())
        .then((json) => setAvis(json.data ?? []))
        .catch(() => setErreur("Impossible de charger vos avis."))
        .finally(() => setLoading(false))
    })
  }, [router])

  async function handleSupprimer(avisId: string) {
    if (!confirm("Supprimer cet avis définitivement ?")) return
    setSuppressionEnCours(avisId)
    try {
      const res = await fetch(`/api/avis/${avisId}`, { method: "DELETE" })
      if (!res.ok) {
        const json = await res.json()
        alert(json.error ?? "Erreur lors de la suppression.")
        return
      }
      setAvis((prev) => prev.filter((a) => a.id !== avisId))
    } catch {
      alert("Une erreur est survenue.")
    } finally {
      setSuppressionEnCours(null)
    }
  }

  function handleModificationSuccess(avisModifie: AvisUtilisateur) {
    setAvis((prev) => prev.map((a) => a.id === avisModifie.id ? avisModifie : a))
    setAvisEnEdition(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner message="Chargement de vos avis..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Link
            href="/profil"
            className="flex items-center gap-1 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            <Icon name="fleche-gauche" className="w-3 h-3" />
            Mon compte
          </Link>
          <span className="text-muted">/</span>
          <span className="text-sm font-semibold text-foreground">Mes avis</span>
        </div>

        <h1 className="text-2xl font-bold text-bleu-profond">Mes avis</h1>

        {erreur && (
          <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
            {erreur}
          </div>
        )}

        {/* Liste vide */}
        {avis.length === 0 && !erreur && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Icon name="etoile" className="w-12 h-12 text-bleu-clair opacity-40" />
            <h2 className="font-semibold text-foreground">Aucun avis pour le moment</h2>
            <p className="text-sm text-muted max-w-xs">
              Visitez une piscine et laissez votre premier avis !
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

        {/* Liste des avis */}
        {avis.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              {avis.length} avis publié{avis.length > 1 ? "s" : ""}
            </p>

            {avis.map((a) => {
              const moyenne = (
                a.note_accessibilite + a.note_accueil + a.note_bassin + a.note_vestiaires
              ) / 4

              const date = new Date(a.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })

              return (
                <div key={a.id} className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-3">

                  {/* En-tête : piscine + date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/piscines/${a.piscine.id}`}
                        className="font-semibold text-bleu-profond text-sm hover:underline"
                      >
                        {a.piscine.nom}
                      </Link>
                      <span className="text-xs text-muted">
                        Paris {a.piscine.arrondissement}e · {date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-bold text-bleu-profond text-sm">{moyenne.toFixed(1)}</span>
                      <Etoiles note={Math.round(moyenne)} />
                    </div>
                  </div>

                  {/* Détail des notes */}
                  {avisEnEdition !== a.id && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: "Accessibilité", note: a.note_accessibilite, com: a.commentaire_accessibilite },
                        { label: "Accueil", note: a.note_accueil, com: a.commentaire_accueil },
                        { label: "Bassin", note: a.note_bassin, com: a.commentaire_bassin },
                        { label: "Vestiaires", note: a.note_vestiaires, com: a.commentaire_vestiaires },
                      ].map(({ label, note, com }) => (
                        <div key={label} className="flex flex-col gap-0.5 bg-bleu-tres-pale rounded-lg p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">{label}</span>
                            <Etoiles note={note} />
                          </div>
                          {com && <p className="text-xs text-foreground italic">{com}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulaire de modification inline */}
                  {avisEnEdition === a.id && (
                    <FormulaireModification
                      avis={a}
                      onSuccess={handleModificationSuccess}
                      onAnnuler={() => setAvisEnEdition(null)}
                    />
                  )}

                  {/* Actions */}
                  {avisEnEdition !== a.id && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setAvisEnEdition(a.id)}
                        className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl
                                   border border-bleu-profond text-bleu-profond text-xs font-semibold
                                   hover:bg-bleu-tres-pale transition-colors"
                      >
                        <Icon name="modifier" className="w-3.5 h-3.5" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleSupprimer(a.id)}
                        disabled={suppressionEnCours === a.id}
                        className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl
                                   border border-rouge text-rouge text-xs font-semibold
                                   hover:bg-rouge/10 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon name="supprimer" className="w-3.5 h-3.5" />
                        {suppressionEnCours === a.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}