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
    pmr: "bg-blue-100 text-blue-800 border border-blue-200",
    queer: "bg-purple-100 text-purple-800 border border-purple-200",
    passe: "bg-green-100 text-green-800 border border-green-200",
    ouvert: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    ferme: "bg-red-100 text-red-700 border border-red-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
}

