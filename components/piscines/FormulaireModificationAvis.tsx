// components/piscines/FormulaireModificationAvis.tsx

import React, { useState } from "react"

export interface AvisUtilisateur {
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
    piscine: {
        id: number
        nom: string
        arrondissement: number
    }
} 

export function FormulaireModification({
    avis,
    onSuccess,
    onAnnuler,
}: {
    avis: AvisUtilisateur
    onSuccess: (avisModifie: AvisUtilisateur) => void
    onAnnuler: () => void
}) {
    const [notes, setNotes] = useState({
        noteAccessibilite: avis.note_accessibilite,
        noteAccueil: avis.note_accueil,
        noteBassin: avis.note_bassin,
        noteVestiaires: avis.note_vestiaires,
    })

    const [commentaires, setCommentaires] = useState({
        comAccessibilite: avis.commentaire_accessibilite ?? "",
        comAccueil: avis.commentaire_accueil ?? "",
        comBassin: avis.commentaire_bassin ?? "",
        comVestiaire: avis.commentaire_vestiaires ?? "",
    })

    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState< string | null >(null);

    function setNote(champ: keyof typeof notes, valeur: number) {
        setNotes((prev) => ({ ...prev, [champ]: valeur }))
    };

    function setCommentaire(champ: keyof typeof commentaires, valeur: string) {
        setCommentaires((prev) => ({ ...prev, [champ]: valeur }))
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErreur(null)
        setChargement(true)

        try {
            const res = await fetch(`/api/avis/${avis.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    noteAccessibilite: notes.noteAccessibilite,
                    commentaireAccessibilite: commentaires.comAccessibilite || null,
                    noteAccueil: notes.noteAccueil,
                    commentaireAccueil: commentaires.comAccueil || null,
                    noteBassin: notes.noteBassin,
                    commentaireBassin: commentaires.comBassin || null,
                    noteVestiaire: notes.noteVestiaires,
                    commentaireVestiaire: commentaires.comVestiaire || null,
                }),
            })

            const json = await res.json()
            if (!res.ok) {
                setErreur(json.error ?? "Une erreur est survenue.")
                return
            }

            // Construire l'avis mis à jour pour le parent
            onSuccess({
                ...avis,
                note_accessibilite: notes.noteAccessibilite,
                commentaire_accessibilite: commentaires.comAccessibilite || null,
                note_accueil: notes.noteAccueil,
                commentaire_accueil: commentaires.comAccueil || null,
                note_bassin: notes.noteBassin,
                commentaire_bassin: commentaires.comBassin || null,
                note_vestiaires: notes.noteVestiaires,
                commentaire_vestiaires: commentaires.comVestiaire || null,
            })
        } catch {
            setErreur("Une erreur est survenue. Réesayez.")
        } finally {
            setChargement(false)
        }
    }

    const categories = [
        { label: "Accessibilité", noteKey: "noteAccessibilite" as const, comKey: "comAccessibilite" as const },
        { label: "Accueil", noteKey: "noteAccueil" as const, comKey: "comAccueil" as const },
        { label: "Bassin", noteKey: "noteBassin" as const, comKey: "comBassin" as const },
        { label: "Vastiaires", noteKey: "noteVestiaires" as const, comKey: "comVestiaire" as const },
    ]

    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3 border-t border-border">
            {erreur && (
                <div className="bg-rouge/10 border border-rouge/20 text-rouge rounded-xl px-3 py-2 text-xs">
                    {erreur}
                </div>
            )}

            {categories.map(({ label, noteKey, comKey }) => (
                <div key={noteKey} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{label}</span>
                        <span className="text-xs text-muted">{notes[noteKey]}/5</span>
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                            <button
                            key={n}
                            type="button"
                            onClick={() => setNote(noteKey, n)}
                            className= {`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                notes[noteKey] === n
                                    ? "bg-bleu-profond text-white"
                                    : "bg-bleu-tres-pale text-bleu-moyen hover:bg-bleu-pale"
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={commentaires[comKey]}
                        onChange={(e) => setCommentaire(comKey, e.target.value)}
                        placeholder="Commentaire optionnel..."
                        rows={1}
                        className="w-full px-3 py-1.5 rounded-lg border border-border text-xs
                                text-foreground placeholder:text-muted bg-white resize-none
                                focus:outline-none focus:ring-2 focus:ring-bleu-clair"
                    />
                </div>
            ))}

            <div className="flex gap-2">
                <button
                type="button"
                onClick={onAnnuler}
                className="flex-1 py-2 rounded-xl border border-border text-muted
                        text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>

                <button
                type="submit"
                disabled={chargement}
                className="flex-1 py-2 rounded-xl bg-bleu-profond text-white
                     text-xs font-semibold hover:bg-bleu-moyen transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {chargement ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </form>
        </>            
    )
}