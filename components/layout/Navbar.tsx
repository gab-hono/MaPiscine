// components/layout/Navbar.tsx
// Barre de navigation principale — présente sur toutes les pages
// Onde SVG décorative en bas du header pour l'identité visuelle aquatique
"use client"

import { useState } from "react"
import Link from "next/link"
import { NavDrawer } from "@/components/layout/NavDrawer"

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Le header occupe sa hauteur normale + l'espace de l'onde */}
      <header className="sticky top-0 z-30 bg-bleu-profond text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Bouton hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-bleu-moyen transition-colors"
            aria-label="Ouvrir le menu"
            aria-expanded={drawerOpen}
          >
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

          {/* Titre */}
          <Link
            href="/"
            className="font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            MaPiscine
          </Link>

          <div className="w-10" aria-hidden="true" />
        </div>

        {/* Onde SVG décorative — dépasse en dessous du header */}
        <div
          className="absolute left-0 right-0 overflow-hidden pointer-events-none"
          style={{ bottom: "-20px", height: "24px" }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,12 C120,24 240,0 360,12 C480,24 600,0 720,12 C840,24 960,0 1080,12 C1200,24 1320,4 1440,12 L1440,0 L0,0 Z"
              fill="#0D4A73"
            />
          </svg>
        </div>
      </header>

      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  )
}