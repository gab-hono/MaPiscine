// components/layout/NavDrawer.tsx
// Panel latéral de navigation — s'ouvre au clic sur le bouton hamburger
"use client"

import Link from "next/link"
import { useEffect } from "react"

interface NavDrawerProps {
    open: boolean
    onClose: () => void
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
    //Bloquer le scroll du body quand le drawer est ouvert
    useEffect(() => {
        if(open) {
            document.body.style.overflow ="hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    return (
    <>
        {/* Overlay sombre derrière le drawer (click pour fermer) */}
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
                <span className="font-bold text-bleu-profond text-lg">À la piscine !</span>
                <button
                    onClick={onClose}
                    className="text-muted hover:text-foreground transition-colors"
                    aria-label="Fermer le menu">
                    Ⅹ
                </button>
            </div>

            {/* Contenu du drawer */}
            <nav className="flex flex-col flex-1 px-4 py-6 gap-1">
                
                {/* Connexion / Inscription */}
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

                <div className="my-3 border-t border-border"/>

                {/* Navigation secondaire */}
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
                    À la piscine ! — Données : Ville de Paris
                </p>
            </div>
        </div>
    </>
    )
}