// app/profil/modifier/page.tsx
// Formulaire de modification des informations personnelles
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/src/lib/auth-client"

export default function ModifierProfilPage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [pronoms, setPronoms] = useState("")
  const [loading, setLoading] = useState(true)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [succes, setSucces] = useState(false)

  // Charger les données actuelles au montage
  useEffect(() => {
    authClient.getSession().then((result) => {
      if (!result?.data?.user) {
        router.push("/connexion")
        return
      }

      fetch("/api/users/me")
        .then((res) => res.json())
        .then((json) => {
          setNom(json.data.name ?? "")
          setPronoms(json.data.pronoms ?? "")
        })
        .finally(() => setLoading(false))
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setSucces(false)
    setChargement(true)

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom,
          pronoms: pronoms || null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setErreur(json.error ?? "Une erreur est survenue.")
        return
      }

      setSucces(true)
      // Retour au profil après 1.5s
      setTimeout(() => router.push("/profil"), 1500)
    } catch {
      setErreur("Une erreur est survenue. Réessayez.")
    } finally {
      setChargement(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-muted text-sm">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-sm mx-auto px-4 py-6 flex flex-col gap-6">

        {/* En-tête */}
        <div className="flex items-center gap-3">
          <Link
            href="/profil"
            className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            ← Retour
          </Link>
          <h1 className="text-xl font-bold text-bleu-profond">
            Modifier mon profil
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">

          {/* Succès */}
          {succes && (
            <div className="bg-vert/10 border border-vert/20 text-vert rounded-xl px-4 py-3 text-sm">
              Profil mis à jour ! Redirection...
            </div>
          )}

          {/* Erreur */}
          {erreur && (
            <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nom" className="text-sm font-semibold text-foreground">
              Nom d'utilisateur·ice
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Pronoms */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pronoms" className="text-sm font-semibold text-foreground">
              Pronoms <span className="text-muted font-normal">(optionnel)</span>
            </label>
            <input
              id="pronoms"
              type="text"
              value={pronoms}
              onChange={(e) => setPronoms(e.target.value)}
              placeholder="ex: il/lui, elle/elle, iel/ellui..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground placeholder:text-muted bg-white
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement || succes}
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm hover:bg-bleu-moyen transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>

        </form>

      </div>
    </div>
  )
}