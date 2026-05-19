// app/profil/page.tsx

"use client"

import { authClient, signOut } from "@/src/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/* Type - refl}€te la rèponse de GET /api/users/me */

type UserProfil = {
   id: string
   name: string
   email: string
   image: string | null
   pronoms: string | null
   role: string
   createdAt: string
   _count: {
    favoris: number
    avis: number
   } 
}

// COMPOSANT INTERNE
function LigneInfo({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{valeur}</span>
    </div>
  )
}

// PAGE PRINCIPALE

export default function ProfilPage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfil | null>(null)
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur] = useState<string | null> (null)

    useEffect(() => {
        //Vérifier la session puis charger les données du profil
        authClient.getSession().then((result) => {
            if (!result?.data?.user) {
                router.push("/connexion")
                return
            }

            fetch("/api/users/me")
                .then((res) => res.json())
                .then((json) => setUser(json.data))
                .catch(() => setErreur("Impossible de charger votre profil"))
                .finally(() => setLoading(false))
        })
    }, [router])

    async function handleDeconnexion() {
        await signOut()
        router.push("/")
        router.refresh()
    }

    if(loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <p className="text-muted text-sm">Chargement...</p>
            </div>
        )
    }

    if (erreur || !user) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <p className="text-rouge text-sm">{erreur ?? "Erreur inconnue"}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-surface">
            <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

                {/* En-tête */}
                <h1 className="text-2xl font-bold text-bleu-profond">Mon compte</h1>

                {/* Tableau récapitulatif */}
                <div className="grid grid-cols-2 gap-3">

                    {/* Compteur favoris */}
                    <Link
                        href="/profil/favoris"
                        className="bg-white rounded-2xl border border-border p-5 flex flex-col
                                gap-2 hover:shadow-md transition-shadow"
                    >
                        <span className="text-3xl font-bold text-bleu-profond">
                            {user._count.favoris}
                        </span>
                        <span className="text-sm text-muted">
                            Piscine{user._count.favoris !== 1 ? "s" : ""} favorite{user._count.favoris !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-bleu-moyen font-semibold mt-auto">
                            Voir mes favoris
                        </span>
                    </Link>

                    {/* Compteur d'avis */}
                    <Link
                        href="/profil/avis"
                        className="bg-white rounded-2xl border border-border p-5 flex flex-col
                                gap-2 hover:shadow-md transition-shadow"
                    >
                        <span className="text-3xl font-bold text-bleu-profond">
                        {user._count.avis}
                        </span>
                        <span className="text-sm text-muted">
                        Avis publié{user._count.avis !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-bleu-moyen font-semibold mt-auto">
                        Voir mes avis
                        </span> 
                    </Link>

                </div>

                {/* Infos personnelles */}
                <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-bleu-profond">Informations personnelles</h2>
                        <Link
                        href="/profil/modifier"
                        className="text-xs text-bleu-moyen hover:text-bleu-profond
                                    font-semibold transition-colors"
                        >
                            Modifier
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <LigneInfo label="Nom d'utilisateur·ice" valeur={user.name} />
                        <LigneInfo label="Adresse e-mail" valeur={user.email} />
                        <LigneInfo
                        label="Pronoms"
                        valeur={user.pronoms ?? "Non renseignés"} />
                        <LigneInfo
                        label="Membre depuis"
                        valeur={new Date(user.createdAt).toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                        })}
                        />
                    </div>
                </div>

                {/* Sécurité */}
                <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
                    <h2 className="font-semibold text-bleu-profond">Sécurité</h2>
                    <Link
                        href="/profil/mot-de-passe"
                        className="text-sm text-bleu-moyen hover:text-bleu-profond
                                font-semibold transition-colors"
                    >
                        Changer mon mot de passe
                    </Link>
                </div>

                {/* Déconnexion */}
                <button
                    onClick={handleDeconnexion}
                    className="w-full py-3 rounded-xl border border-rouge text-rouge
                                font-semibold text-sm hover:bg-rouge/10 transition-colors"
                    >
                    Se déconnecter
                </button>

            </div>
        </div>
    )
}