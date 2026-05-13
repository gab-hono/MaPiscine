// components/piscines/AvisSection.tsx
// Section avis d'une piscine — affichage public + boutons d'action
// Client Component car gère l'état du pop-up d'auth
"use client"

import { AuthPopup } from "@/components/ui/AuthPopup"
import { BoutonFavori } from "@/components/piscines/BoutonFavori"
import { useState, useEffect } from "react"
import { authClient } from "@/src/lib/auth-client"
import { FormulaireAvis } from "@/components/piscines/FormulaireAvis"

// -----------------------------------------------------------------
// Types — reflète la réponse de GET /api/avis?piscineId=:id
// -----------------------------------------------------------------

type Avis = {
  id: string
  note_accessibilite: number
  commentaire_accessibilite: string | null
  note_accueil: number
  commentaire_accueil: string | null
  note_bassin: number
  commentaire_bassin: string | null
  note_vestiaires: number
  commentaire_vestiaires: string | null
  created_at: string
  piscineId: number
}

interface AvisSectionProps {
  avis: Avis[]
  piscineId: number
}

// -----------------------------------------------------------------
// Composant étoiles — affiche N étoiles pleines sur 5
// -----------------------------------------------------------------

function Etoiles({ note }: { note: number }) {
  return (
    <span className="text-orange text-sm" aria-label={`${note} sur 5`}>
      {"★".repeat(note)}
      {"☆".repeat(5 - note)}
    </span>
  )
}

// -----------------------------------------------------------------
// Composant ligne de note avec commentaire optionnel
// -----------------------------------------------------------------

function LigneNote({
  label,
  note,
  commentaire,
}: {
  label: string
  note: number
  commentaire: string | null
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <Etoiles note={note} />
      </div>
      {commentaire && (
        <p className="text-xs text-foreground italic">{commentaire}</p>
      )}
    </div>
  )
}

// -----------------------------------------------------------------
// Composant carte d'un avis
// -----------------------------------------------------------------

function CarteAvis({ avis }: { avis: Avis }) {
  const date = new Date(avis.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const moyenne =
    (avis.note_accessibilite +
      avis.note_accueil +
      avis.note_bassin +
      avis.note_vestiaires) /
    4

  return (
    <div className="bg-bleu-tres-pale rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-bleu-profond text-base">
            {moyenne.toFixed(1)}
          </span>
          <Etoiles note={Math.round(moyenne)} />
        </div>
        <span className="text-xs text-muted">{date}</span>
      </div>

      <div className="flex flex-col gap-2">
        <LigneNote
          label="Accessibilité"
          note={avis.note_accessibilite}
          commentaire={avis.commentaire_accessibilite}
        />
        <LigneNote
          label="Accueil"
          note={avis.note_accueil}
          commentaire={avis.commentaire_accueil}
        />
        <LigneNote
          label="Bassin"
          note={avis.note_bassin}
          commentaire={avis.commentaire_bassin}
        />
        <LigneNote
          label="Vestiaires"
          note={avis.note_vestiaires}
          commentaire={avis.commentaire_vestiaires}
        />
      </div>
    </div>
  )
}

// -----------------------------------------------------------------
// Composant principal
// -----------------------------------------------------------------

export function AvisSection({ avis, piscineId }: AvisSectionProps) {
  const [popupOuvert, setPopupOuvert] = useState(false)
  const [estConnecte, setEstConnecte] = useState(false)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [avisLocaux, setAvisLocaux] = useState(avis)

  useEffect(() => {
    authClient.getSession().then((result) => {
      setEstConnecte(!!result?.data?.user)
    })
  }, [])

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* BoutonFavori gère lui-même le popup d'auth si non connecté */}
          <BoutonFavori piscineId={piscineId} variante="detail" />

          {/* Bouton laisser un avis — popup si non connecté */}
          <button
            onClick={() => {
              if (!estConnecte) {
                setPopupOuvert(true)
              } else {
                setFormulaireOuvert(!formulaireOuvert)
              }
            }}
            className="flex-1 py-3 rounded-xl border border-bleu-profond
                      text-bleu-profond font-semibold text-sm
                      hover:bg-bleu-tres-pale transition-colors"
          >
            {formulaireOuvert ? "✕ Annuler" : "★ Laisser un avis"}
          </button>
        </div>

        {formulaireOuvert && (
            <FormulaireAvis
              piscineId={piscineId}
              onSuccess={() => {
                setFormulaireOuvert(false)
                // Recharger la page pour voir le nouvel avis
                window.location.reload()
              }}
              onAnnuler={() => setFormulaireOuvert(false)}
            />
          )}

        {/* Liste des avis */}
        {avis.length === 0 ? (
          <p className="text-sm text-muted text-center py-4">
            Aucun avis pour le moment. Soyez le·la premier·ère !
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted">
              {avis.length} avis
            </p>
            {avis.map((a) => (
              <CarteAvis key={a.id} avis={a} />
            ))}
          </div>
        )}
      </div>

      {/* Pop-up pour laisser un avis */}
      <AuthPopup
        open={popupOuvert}
        onClose={() => setPopupOuvert(false)}
        message="Connectez-vous ou créez un compte pour laisser un avis sur cette piscine."
      />
    </>
  )
}