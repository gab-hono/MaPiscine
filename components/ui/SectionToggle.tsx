// components/ui/SectionToggle.tsx
// Composant accordion réutilisable — ouvert par défaut, repliable au clic
"use client"

import { useState } from "react"

interface SectionToggleProps {
  titre: string
  icone?: string
  children: React.ReactNode
  // Ouvert par défaut — peut être fermé en passant defaultOuvert={false}
  defaultOuvert?: boolean
  // Variante visuelle : "card" (avec bordure et fond blanc) ou "plain" (sans fond, pour les sous-sections)
  variante?: "card" | "plain"
}

export function SectionToggle({
  titre,
  icone,
  children,
  defaultOuvert = true,
  variante = "card",
}: SectionToggleProps) {
  const [ouvert, setOuvert] = useState(defaultOuvert)

  if (variante === "plain") {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setOuvert(!ouvert)}
          className="flex items-center justify-between py-2 hover:text-bleu-moyen transition-colors"
          aria-expanded={ouvert}
        >
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">
            {icone && <span aria-hidden="true" className="mr-1">{icone}</span>}
            {titre}
          </span>
          <span
            className={`text-muted text-xs transition-transform duration-200 ${
              ouvert ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
        {ouvert && <div className="pb-2">{children}</div>}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-bleu-tres-pale transition-colors"
        aria-expanded={ouvert}
      >
        <span className="flex items-center gap-2 font-semibold text-bleu-profond">
          {icone && <span aria-hidden="true">{icone}</span>}
          {titre}
        </span>
        <span
          className={`text-muted transition-transform duration-200 ${
            ouvert ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {ouvert && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}