// ./components/ui/Etoiles.tsx

export function Etoiles({ note }: { note: number }) {
    return (
        <span className="text-orange text-xs" aria-label={`${note} sur 5`}>
            {"★".repeat(note)}{"☆".repeat(5 - note)}
        </span>
    )
}