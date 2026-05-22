// components/layout/NavDrawer.tsx
// Panel latéral de navigation — s'ouvre au clic sur le bouton hamburger
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { authClient, signOut } from "@/src/lib/auth-client"
import { Icon } from "@/components/ui/Icon"

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

type SessionUser = {
  name: string
  email: string
} | null

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const [user, setUser] = useState<SessionUser>(null)

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result?.data?.user) {
        setUser({
          name: result.data.user.name,
          email: result.data.user.email,
        })
      } else {
        setUser(null)
      }
    })
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panneau latéral */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link
            href="/"
            onClick={onClose}
            className="font-bold text-bleu-profond text-lg hover:opacity-80 transition-opacity"
          >
            MaPiscine
          </Link>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Fermer le menu"
          >
            <Icon name="croix" className="w-4 h-4 text-bleu-clair" />
          </button>
        </div>

        {/* Contenu */}
        <nav className="flex flex-col flex-1 px-4 py-6 gap-1">

          {user ? (
            <>
              {/* Infos utilisateur */}
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-semibold text-bleu-profond">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>

              <Link
                href="/profil"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-foreground text-sm hover:bg-bleu-tres-pale
                           hover:text-bleu-profond transition-colors"
              >
                <Icon name="compte" className="w-4 h-4 text-bleu-clair" />
                Mon compte
              </Link>

              <Link
                href="/profil/favoris"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-foreground text-sm hover:bg-bleu-tres-pale
                           hover:text-bleu-profond transition-colors"
              >
                <Icon name="coeur" className="w-4 h-4 text-bleu-clair" />
                Mes favoris
              </Link>

              <Link
                href="/profil/avis"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-foreground text-sm hover:bg-bleu-tres-pale
                           hover:text-bleu-profond transition-colors"
              >
                <Icon name="etoile" className="w-4 h-4 text-bleu-clair" />
                Mes avis
              </Link>

              <div className="my-2 border-t border-border" />

              <button
                onClick={async () => {
                  await signOut()
                  onClose()
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-rouge text-sm hover:bg-rouge/10 transition-colors w-full"
              >
                <Icon name="deconnexion" className="w-4 h-4 text-rouge" />
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl
                         bg-bleu-profond text-white font-semibold text-sm
                         hover:bg-bleu-moyen transition-colors"
            >
              <Icon name="compte" className="w-4 h-4 text-white" />
              Se connecter / S'inscrire
            </Link>
          )}

          <div className="my-3 border-t border-border" />

          <Link
            href="/guide"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl
                       text-foreground text-sm hover:bg-bleu-tres-pale
                       hover:text-bleu-profond transition-colors"
          >
            <Icon name="natation" className="w-4 h-4 text-bleu-clair" />
            Guide sur les piscines de Paris
          </Link>

          <Link
            href="/confidentialite"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl
                       text-foreground text-sm hover:bg-bleu-tres-pale
                       hover:text-bleu-profond transition-colors"
          >
            <Icon name="confidentialite" className="w-4 h-4 text-bleu-clair" />
            Confidentialité (RGPD)
          </Link>

        </nav>

        {/* Pied */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-muted text-center">
            MaPiscine • Données : Ville de Paris
          </p>
        </div>
      </div>
    </>
  )
}