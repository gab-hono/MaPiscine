"use client"

import React, { useState } from "react"

//TYPES

interface FormulaireAvisProps {
    piscineId: number
    onSuccess: () => void
    onAnnuler: () => void
}

type NotesState = {
    noteAccessibilite: number | null
    noteAccueil: number | null
    noteBassin: number | null
    noteVestiaire: number | null
}

type CommentairesState = {
    comAccessibilite: string
    comAccueil: string
    comBassin: string
    comVestiaire: string
}

//OK: COMPOSANT SÉLECTEUR D'ÉTOILES (0 À 5)

function SelecteurNote({
    label,
    valeur,
    onChange,
}: {
    label: string
    valeur: number | null
    onChange: (note: number) => void
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{label}</span>
                {valeur !== null && (
                    <span className="text-xs text-muted">{valeur}</span>
                )}
            </div>
            <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((note) => (
                    <button
                        key={note}
                        type="button"
                        onClick={() => onChange(note)}
                        className= {`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            valeur === note
                                ? "bg-bleu-profond text-white"
                                : "bg-bleu-tres-pale text-bleu-moyen hover:bg-bleu-pale"
                            }`}
                            aria-label={`${note} sur 5`}
                    >
                        {note}
                    </button>
                ))}
            </div>
        </div>
    )
}

//TODO : COMPOSANT PRINCIPAL

export function FormulaireAvis({ piscineId, onSuccess, onAnnuler }: FormulaireAvisProps) {
    
    const [notes, setNotes] = useState<NotesState>({
    noteAccessibilite: null,
    noteAccueil: null,
    noteBassin: null,
    noteVestiaire: null,
    })

    const [commentaires, setCommentaires] = useState<CommentairesState>({
        comAccessibilite: "",
        comAccueil: "",
        comBassin: "",
        comVestiaire: "",
    })

    const [erreur, setErreur] = useState<string | null>(null)
    const [chargement, setChargement] = useState(false)

    const toutesNotesRenseignees =
        notes.noteAccessibilite !== null &&
        notes.noteAccueil !== null &&
        notes.noteBassin !== null &&
        notes.noteVestiaire !== null
    
    function setNote(champ: keyof NotesState, valeur: number) {
        setNotes((prev) => ({ ...prev, [champ]: valeur}))
    }

    function setCommentaire(champ: keyof CommentairesState, valeur: string) {
        setCommentaires((prev) => ({ ...prev, [champ]: valeur }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErreur(null)

        if (!toutesNotesRenseignees) {
            setErreur("Veuillez attribuer une note à chaque critère")
            return
        }

        setChargement(true)

        try {
            const res = await fetch("/api/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    piscineId,
                    noteAccessibilite: notes.noteAccessibilite,
                    comAccessibilite: commentaires.comAccessibilite || null,
                    noteAccueil: notes.noteAccueil,
                    comAccueil: commentaires.comAccueil || null,
                    noteBassin: notes.noteBassin,
                    comBassin: commentaires.comBassin || null,
                    noteVestiaire: notes.noteVestiaire,
                    comVestiaire: commentaires.comVestiaire || null,
                }),
            })

            const json = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    setErreur("Vous avez déjà laissé un avis pour cette piscine")
                } else {
                    setErreur(json.error ?? "une erreur est survenue")
                }
                return
            }

            onSuccess()
        } catch {
            setErreur("Une erreur est survenue. Réessayez")
        } finally {
            setChargement(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
 
            <h3 className="font-semibold text-bleu-profond">Laisser un avis</h3>
        
            {/* Erreur */}
            {erreur && (
                <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-4 py-3 text-sm">
                {erreur}
                </div>
            )}
        
            {/* Accessibilité */}
            <div className="flex flex-col gap-2">
                <SelecteurNote
                label="Accessibilité"
                valeur={notes.noteAccessibilite}
                onChange={(n) => setNote("noteAccessibilite", n)}
                />
                <textarea
                value={commentaires.comAccessibilite}
                onChange={(e) => setCommentaire("comAccessibilite", e.target.value)}
                placeholder="Commentaire optionnel..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm
                            text-foreground placeholder:text-muted bg-white resize-none
                            focus:outline-none focus:ring-2 focus:ring-bleu-clair"
                />
            </div>
        
            {/* Accueil */}
            <div className="flex flex-col gap-2">
                <SelecteurNote
                label="Accueil"
                valeur={notes.noteAccueil}
                onChange={(n) => setNote("noteAccueil", n)}
                />
                <textarea
                value={commentaires.comAccueil}
                onChange={(e) => setCommentaire("comAccueil", e.target.value)}
                placeholder="Commentaire optionnel..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm
                            text-foreground placeholder:text-muted bg-white resize-none
                            focus:outline-none focus:ring-2 focus:ring-bleu-clair"
                />
            </div>
        
            {/* Bassin */}
            <div className="flex flex-col gap-2">
                <SelecteurNote
                label="Bassin"
                valeur={notes.noteBassin}
                onChange={(n) => setNote("noteBassin", n)}
                />
                <textarea
                value={commentaires.comBassin}
                onChange={(e) => setCommentaire("comBassin", e.target.value)}
                placeholder="Commentaire optionnel..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm
                            text-foreground placeholder:text-muted bg-white resize-none
                            focus:outline-none focus:ring-2 focus:ring-bleu-clair"
                />
            </div>
        
            {/* Vestiaires */}
            <div className="flex flex-col gap-2">
                <SelecteurNote
                label="Vestiaires"
                valeur={notes.noteVestiaire}
                onChange={(n) => setNote("noteVestiaire", n)}
                />
                <textarea
                value={commentaires.comVestiaire}
                onChange={(e) => setCommentaire("comVestiaire", e.target.value)}
                placeholder="Commentaire optionnel..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm
                            text-foreground placeholder:text-muted bg-white resize-none
                            focus:outline-none focus:ring-2 focus:ring-bleu-clair"
                />
            </div>
        
            {/* Actions */}
            <div className="flex gap-3">
                <button
                type="button"
                onClick={onAnnuler}
                className="flex-1 py-3 rounded-xl border border-border text-muted
                            text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                Annuler
                </button>
                <button
                type="submit"
                disabled={chargement || !toutesNotesRenseignees}
                className="flex-1 py-3 rounded-xl bg-bleu-profond text-white
                            text-sm font-semibold hover:bg-bleu-moyen transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {chargement ? "Envoi en cours..." : "Envoyer mon avis"}
                </button>
            </div>
        
            </form>       
    )

}