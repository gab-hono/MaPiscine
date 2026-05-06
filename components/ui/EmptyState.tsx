//./components/ui/EmptyState.tsx
//Afiché quand une liste ne retourne aucun résultat (filtres trop restrictifs, etc.)

interface EmptyStateProps {
    title?: string
    description?: string
    // Action optionnelle (ex: bouton "Réinitiliser les filtrez")
    action?: React.ReactNode
}

export function EmptyState({
    title = "Aucune piscine trouvée",
    description = "Essayez de modifier vos filtres pour voir plus de résultats",
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
            {/* Icône décorative */}
            <div className="text-5xl" aria-hidden="true">
                🏊🏼‍♀️
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 max-w-sm">{description}</p>
            </div>

            {/* Bouton d'action si fourni */}
            {action && <div>{action}</div>}
        </div>
    )
}