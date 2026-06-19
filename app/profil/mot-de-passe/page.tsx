// app/profil/mot-de-passe/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function validerMotDePasse(password: string): string | null {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères."
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule."
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre."
  }
  return null
}

export default function MotDePassePage() {
  const router = useRouter()
  const [actuel, setActuel] = useState("")
  const [nouveau, setNouveau] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [showActuel, setShowActuel] = useState(false)
  const [showNouveau, setShowNouveau] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [succes, setSucces] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setSucces(false)

    const erreurPassword = validerMotDePasse(nouveau)
    if (erreurPassword) {
      setErreur(erreurPassword)
      return
    }

    if (nouveau !== confirmation) {
      setErreur("Les nouveaux mots de passe ne correspondent pas.")
      return
    }

    if (nouveau === actuel) {
      setErreur("Le nouveau mot de passe doit être différent de l'actuel.")
      return
    }

    setChargement(true)

    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: actuel,
          newPassword: nouveau,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setErreur(json.error ?? "Une erreur est survenue.")
        return
      }

      setSucces(true)
      setTimeout(() => router.push("/profil"), 1500)
    } catch {
      setErreur("Une erreur est survenue. Réessayez.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-sm mx-auto px-4 py-6 flex flex-col gap-6">

        <div className="flex items-center gap-3">
          <Link
            href="/profil"
            className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
          >
            Retour
          </Link>
          <h1 className="text-xl font-bold text-bleu-profond">
            Changer mon mot de passe
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">

          {succes && (
            <div className="bg-vert/10 border border-vert/20 text-vert rounded-xl px-4 py-3 text-sm">
              Mot de passe mis à jour ! Redirection...
            </div>
          )}

          {erreur && (
            <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          {/* Mot de passe actuel */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="actuel" className="text-sm font-semibold text-foreground">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                id="actuel"
                type={showActuel ? "text" : "password"}
                value={actuel}
                onChange={(e) => setActuel(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border text-sm
                           text-foreground placeholder:text-muted bg-white
                           focus:outline-none focus:ring-2 focus:ring-bleu-clair"
              />
              <button
                type="button"
                onClick={() => setShowActuel(!showActuel)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                aria-label={showActuel ? "Masquer" : "Afficher"}
              >
                {showActuel ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nouveau" className="text-sm font-semibold text-foreground">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="nouveau"
                type={showNouveau ? "text" : "password"}
                value={nouveau}
                onChange={(e) => setNouveau(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="8 caractères minimum"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border text-sm
                           text-foreground placeholder:text-muted bg-white
                           focus:outline-none focus:ring-2 focus:ring-bleu-clair"
              />
              <button
                type="button"
                onClick={() => setShowNouveau(!showNouveau)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                aria-label={showNouveau ? "Masquer" : "Afficher"}
              >
                {showNouveau ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-xs text-muted">
              8 caractères minimum, avec une majuscule et un chiffre.
            </p>
          </div>

          {/* Confirmation */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmation" className="text-sm font-semibold text-foreground">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmation"
                type={showConfirmation ? "text" : "password"}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border text-sm
                           text-foreground placeholder:text-muted bg-white
                           focus:outline-none focus:ring-2 focus:ring-bleu-clair"
              />
              <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                aria-label={showConfirmation ? "Masquer" : "Afficher"}
              >
                {showConfirmation ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={chargement || succes}
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm hover:bg-bleu-moyen transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? "Mise à jour..." : "Changer mon mot de passe"}
          </button>

        </form>

      </div>
    </div>
  )
}