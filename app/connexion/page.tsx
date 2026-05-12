// app/connexion/page.tsx
// Page de connexion — formulaire email + mot de passe
// Utilise Better Auth côté client via authClient
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/src/lib/auth-client"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setChargement(true)

    try {
      const result = await signIn.email({
        email,
        password: motDePasse,
      })

      if (result.error) {
        setErreur("Email ou mot de passe incorrect.")
        return
      }

      // Redirection vers l'accueil après connexion réussie
      router.push("/")
      router.refresh() // Force le rechargement de la session dans le layout
    } catch {
      setErreur("Une erreur est survenue. Réessayez.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* En-tête */}
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-bleu-profond">Se connecter</h1>
          <p className="text-sm text-muted">Bienvenue sur À la piscine !</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">

          {/* Erreur */}
          {erreur && (
            <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground placeholder:text-muted bg-white
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mot-de-passe" className="text-sm font-semibold text-foreground">
              Mot de passe
            </label>
            <input
              id="mot-de-passe"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground placeholder:text-muted bg-white
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm hover:bg-bleu-moyen transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? "Connexion en cours..." : "Se connecter"}
          </button>

        </form>

        {/* Lien inscription */}
        <p className="text-sm text-center text-muted">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="text-bleu-moyen font-semibold hover:text-bleu-profond transition-colors"
          >
            Créer un compte
          </Link>
        </p>

        {/* Retour accueil */}
        <Link
          href="/"
          className="text-xs text-center text-muted hover:text-foreground transition-colors"
        >
          Continuer sans compte
        </Link>

      </div>
    </div>
  )
}