//./components/ui/LoadingSpinner.tsx
//Indicateur de chargement addiché pendant les fetches

interface LoadingSpinnerProps {
    //Message optionnel affiché sous le spinner
    message?: string
}

export function LoadingSpinner({ message = "Chargement..." }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            {/* Cercle animé avec border-t transparent pour l'effet de rotation */}
            <div
                className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-bleu-moyen animate-spin"
                role= "status"
                aria-label={message}
            />
            <p className="text-sm text-gray-500">{message}</p>
        </div>
    )
}