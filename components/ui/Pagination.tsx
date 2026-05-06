//./components/ui/Pagination.tsx 
//Contrôles de navigation entre les pages de résultats

import type { PaginationMeta } from "@/types/piscine";

interface PaginationProps {
    pagination: PaginationMeta
    //Callback appelé quand l'utilisateur change de page
    onPageChange: (page: number) => void
}

export function Pagination ({ pagination, onPageChange }: PaginationProps) {
    const { page, totalPages, total, limit } = pagination

    //Ne rien afficher si une seule page ou aucun résultat
    if(totalPages <= 1) return null

    //Calcul de l'intervalle affiché ("Résultats 1-12 sur 42")
    const debut = (page - 1) * limit + 1
    const fin = Math.min(page * limit, total)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
            {/* Compteur de résultats */}
            <p className="text-sm text-gray-500">
                Résultats {debut}-{fin} sur {total}
            </p>

            {/* Contrôles de navigation */}
            <div className="flex items-center gap-2">
                {/* Bouton Précédent */}
                <button
                    onClick={() => onPageChange(page-1)}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700
                        hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-colors"
                    aria-label="Page précédente"
                >
                    ← Précedent
                </button>

                {/* Indicateur de page courante */}
                <span className="text-sm text-gray-600 px-2">
                    Page {page} / {totalPages}
                </span>

                {/* Bouton Suivant */}
                <button
                   onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700
                             hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                                transition-colors"
                    aria-label="Page suivante" >
                    Suivant →
                </button>
            </div>
        </div>
    )
}