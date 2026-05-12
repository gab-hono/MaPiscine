// app/inscription/page.tsx
// Page d'inscription — formulaire nom + email + mot de passe + pronoms (optionnel)
// Utilise Better Auth côté client via authClient
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/src/lib/auth-client"

export default function InscriptionPage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [pronoms, setPronoms] = useState("")
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)

    // Validation côté client
    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.")
      return
    }

    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setChargement(true)

    try {
      const result = await signUp.email({
        email,
        password: motDePasse,
        name: nom,
        // Champs additionnels définis dans auth.ts
        // @ts-expect-error — Better Auth accepte les champs additionnels mais ne les type pas automatiquement
        pronoms: pronoms || null,
      })

      if (result.error) {
        // Cas le plus fréquent : email déjà utilisé
        if (result.error.status === 422) {
          setErreur("Cette adresse e-mail est déjà utilisée.")
        } else {
          setErreur("Une erreur est survenue lors de l'inscription.")
        }
        return
      }

      // Redirection vers l'accueil après inscription réussie
      // Better Auth connecte automatiquement l'utilisateur après signUp
      router.push("/")
      router.refresh()
    } catch {
      setErreur("Une erreur est survenue. Réessayez.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* En-tête */}
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-bleu-profond">Créer un compte</h1>
          <p className="text-sm text-muted">Rejoignez la communauté de MaPiscine !</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">

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
              autoComplete="name"
              placeholder="ex: alex_nageur"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground placeholder:text-muted bg-white
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

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

          {/* Pronoms — optionnel */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pronoms" className="text-sm font-semibold text-foreground">
              Pronoms{" "}
              <span className="text-muted font-normal">(optionnel)</span>
            </label>
            <input
              id="pronoms"
              type="text"
              value={pronoms}
              onChange={(e) => setPronoms(e.target.value)}
              autoComplete="off"
              placeholder="ex: il/lui, elle/elle, iel/ellui..."
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm
                         text-foreground placeholder:text-muted bg-white
                         focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <input
                id="mot-de-passe"
                type={showPassword ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border text-sm
                        text-foreground placeholder:text-muted bg-white
                        focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted
                        hover:text-foreground transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
                {showPassword ? "🙈" : "👁️"}
            </button>
            </div>

          {/* Confirmation mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmation" className="text-sm font-semibold text-foreground">
                Confirmer le mot de passe
            </label>
          <div className="relative">
            <input
                id="confirmation"
                type={showConfirmation ? "text" : "password"}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border text-sm
                        text-foreground placeholder:text-muted bg-white
                        focus:outline-none focus:ring-2 focus:ring-bleu-clair"
            />
            <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted
                        hover:text-foreground transition-colors"
                aria-label={showConfirmation ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
                {showConfirmation ? "🙈" : "👁️"}
            </button>
            </div>
            </div>

          {/* Mention RGPD */}
          <p className="text-xs text-muted leading-relaxed">
            En créant un compte, vous acceptez notre{" "}
            <Link
              href="/confidentialite"
              className="text-bleu-moyen hover:text-bleu-profond underline underline-offset-2"
            >
              politique de confidentialité
            </Link>
            .
          </p>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full py-3 bg-bleu-profond text-white rounded-xl
                       font-semibold text-sm hover:bg-bleu-moyen transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? "Création en cours..." : "Créer mon compte"}
          </button>

        </form>

        {/* Lien connexion */}
        <p className="text-sm text-center text-muted">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="text-bleu-moyen font-semibold hover:text-bleu-profond transition-colors"
          >
            Se connecter
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