// components/layout/Navbar.tsx
// Barre de navigation principale — présente sur toutes les pages
"use client"

import { useState } from "react"
import Link from "next/link"
import { NavDrawer } from "@/components/layout/NavDrawer"

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-bleu-profond text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Bouton hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-bleu-moyen transition-colors"
            aria-label="Ouvrir le menu"
            aria-expanded={drawerOpen}
          >
            {/* Icône hamburger en SVG — plus fiable que texte ou emoji */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect y="3" width="22" height="2" rx="1" fill="white" />
              <rect y="10" width="22" height="2" rx="1" fill="white" />
              <rect y="17" width="22" height="2" rx="1" fill="white" />
            </svg>
          </button>

          {/* Titre — lien vers l'accueil */}
          <Link
            href="/"
            className="font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            MaPiscine
          </Link>

          {/* Espace réservé pour futures actions (favoris, profil) */}
          {/* Sprint suivant : remplacé par avatar ou icône profil */}
          <div className="w-10" aria-hidden="true" />

        </div>
      </header>

      {/* Drawer — monté ici pour être au-dessus de tout le contenu */}
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}