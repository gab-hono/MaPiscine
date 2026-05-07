// components/piscines/PiscineMap.tsx
// Carte Leaflet interactive — DOIT être importé avec dynamic + ssr:false
// car Leaflet accède à window (API navigateur uniquement)
"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"

// -----------------------------------------------------------------
// Correction du bug de taille — Leaflet ne connaît pas les dimensions
// du conteneur au moment du montage. On force un recalcul après 100ms.
// C'est pour ça que le mapa ne s'affichait qu'en partie au premier rendu.
// -----------------------------------------------------------------

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

// -----------------------------------------------------------------
// Correction du bug d'icônes Leaflet avec webpack/Next.js
// Sans ça, les markers n'affichent pas d'icône
// -----------------------------------------------------------------

function useLeafletIconFix() {
  useEffect(() => {
    // @ts-expect-error — propriété interne Leaflet non typée
    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])
}

interface PiscineMapProps {
  piscines: Piscine[]
}

export default function PiscineMap({ piscines }: PiscineMapProps) {
  useLeafletIconFix()

  const piscinesAvecCoords = piscines.filter(
    (p) => p.latitude && p.longitude
  )

  const centre: [number, number] = [48.8566, 2.3522]

  return (
    <MapContainer
      center={centre}
      zoom={12}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: "500px" }}
    >
      {/* Fix taille — doit être le premier enfant de MapContainer */}
      <InvalidateSizeOnMount />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {piscinesAvecCoords.map((piscine) => (
        <Marker
          key={piscine.id}
          position={[piscine.latitude, piscine.longitude]}
        >
          <Popup minWidth={200}>
            <div className="flex flex-col gap-2 py-1">
              <p className="font-semibold text-bleu-profond text-sm leading-tight">
                {piscine.nom}
              </p>
              <p className="text-xs text-muted">{piscine.adresse}</p>
              <div className="flex flex-wrap gap-1">
                <Badge
                  label={piscine.is_open ? "Ouverte" : "Fermée"}
                  variant={piscine.is_open ? "ouvert" : "ferme"}
                />
                {piscine.acces_pmr && <Badge label="PMR" variant="pmr" />}
                {piscine.queer_friendly && <Badge label="QF" variant="queer" />}
              </div>
              <Link
                href={`/piscines/${piscine.id}`}
                className="text-xs font-semibold text-bleu-moyen hover:text-bleu-profond transition-colors"
              >
                Voir la fiche →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}