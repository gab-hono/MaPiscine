//./components/ui/Badge.tsx
// Étiquette visuelle réutilisable pour les labels piscine (PMR, Queer Friendly, etc.)

interface BadgeProps {
    label: string
    //Variante de couleur -> chaque type de label a sa couleur sémantique
    variant?: "pmr" | "queer" | "passe" | "ouvert" | "ferme" | "default"
    //taille optionnelle
    size?: "sm"|"md"
}

//Mapping des cariantes vers les classes Tailwind
const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
    pmr: "bg-bleu-tres-pale text-bleu-profond border border-bleu-pale",
    queer: "bg-violet/10 text-violet border border-violet/20",
    passe: "bg-green-100 text-green-800 border border-green-200",
    ouvert: "bg-vert/10 text-vert border border-vert/20",
    ferme: "bg-rouge/10 text-rouge border border-rouge/20",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
}

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
}

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
    return(
        <span
        className={`
            inline-flex items-center rounded-full font-medium
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            `}
        >
            {label}
        </span>
    )
}