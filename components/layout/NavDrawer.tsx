// components/layout/NavDrawer.tsx
// Panel latéral de navigation — s'ouvre au clic sur le bouton hamburger
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { authClient, signOut } from "@/src/lib/auth-client"

interface NavDrawerProps {
  open: boolean
  onClose: () => void
}

type SessionUser = {
    name: string
    email:string
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
    }, [open]) // Se re-vérifie à chaque ouverture du drawer

  // Bloquer le scroll du body quand le drawer est ouvert
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
      {/* Overlay sombre derrière le drawer (clic pour fermer) */}
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
        {/* En-tête du drawer */}
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
            Ⅹ
          </button>
        </div>

        {/* Contenu du drawer */}
        <nav className="flex flex-col flex-1 px-4 py-6 gap-1">

          {/* Bloc conditionnel — connecté ou non */}
          {user ? (
            <>
              {/* Infos utilisateur */}
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-semibold text-bleu-profond">
                  {user.name}
                </p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>

              <Link
                href="/profil"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-foreground text-sm hover:bg-bleu-tres-pale
                           hover:text-bleu-profond transition-colors"
              >
                <span aria-hidden="true">👤</span>
                Mon compte
              </Link>

              <Link
                href="/profil/favoris"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl
                           text-foreground text-sm hover:bg-bleu-tres-pale
                           hover:text-bleu-profond transition-colors"
              >
                <span aria-hidden="true">♡</span>
                Mes favoris
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
                <span aria-hidden="true">🚪</span>
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
              <span aria-hidden="true">🧝🏽‍♂️</span>
              Se connecter / S'inscrire
            </Link>
          )}

          <div className="my-3 border-t border-border" />

          {/* Navigation secondaire — toujours visible */}
          <Link
            href="/guide"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl
                       text-foreground text-sm hover:bg-bleu-tres-pale
                       hover:text-bleu-profond transition-colors"
          >
            <span aria-hidden="true">📖</span>
            Guide sur les piscines de Paris
          </Link>

          <Link
            href="/confidentialite"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl
                       text-foreground text-sm hover:bg-bleu-tres-pale
                       hover:text-bleu-profond transition-colors"
          >
            <span aria-hidden="true">🔒</span>
            Confidentialité (RGPD)
          </Link>

        </nav>

        {/* Pied du drawer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-muted text-center">
            MaPiscine • Données : Ville de Paris
          </p>
        </div>
      </div>
    </>
  )
}