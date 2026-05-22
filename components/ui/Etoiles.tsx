// components/ui/Etoiles.tsx
// Composant étoiles — utilise les icônes SVG de la charte

import { Icon } from "@/components/ui/Icon"

interface EtoilesProps {
  note: number // entier 0-5
  className?: string
}

export function Etoiles({ note, className = "" }: EtoilesProps) {
  return (
    <span
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={`${note} sur 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name={i < note ? "etoile-pleine" : "etoile"}
          className="w-3.5 h-3.5 text-orange"
        />
      ))}
    </span>
  )
}