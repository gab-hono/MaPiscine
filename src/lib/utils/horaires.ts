// src/lib/utils/horaires.ts
// Calcule si une piscine est ouverte maintenant basé sur ses horaires réguliers
// Version simplifiée : utilise uniquement les horaires SCOLAIRES
// Amélioration prévue : intégrer le calendrier scolaire officiel pour gérer
// automatiquement la période VACANCES selon les dates réelles

// -----------------------------------------------------------------
// Types minimaux nécessaires pour le calcul
// -----------------------------------------------------------------

type HoraireRegulier = {
  periode: "SCOLAIRE" | "VACANCES"
  jour: string
  heure_ouverture: string | null
  heure_fermeture: string | null
  ferme: boolean
}

// -----------------------------------------------------------------
// Mapping jour JS (0=dimanche) → nom français
// -----------------------------------------------------------------

const JOURS: Record<number, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
}

// -----------------------------------------------------------------
// Convertit "HH:MM" en minutes depuis minuit
// -----------------------------------------------------------------

function heureEnMinutes(heure: string): number {
  const [h, m] = heure.split(":").map(Number)
  return h * 60 + m
}

// -----------------------------------------------------------------
// Fonction principale
// Retourne true si la piscine est ouverte à l'heure actuelle (Paris)
// Utilise uniquement les horaires SCOLAIRES (limitation connue)
// -----------------------------------------------------------------

export function estOuverteMaintenant(horaires: HoraireRegulier[]): boolean {

  const maintenant = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })
  )

  const jourActuel = JOURS[maintenant.getDay()]
  const minutesActuelles = maintenant.getHours() * 60 + maintenant.getMinutes()

  // Filtrer les horaires SCOLAIRES du jour actuel
  const horairesDuJour = horaires.filter(
    (h) => h.periode === "SCOLAIRE" && h.jour === jourActuel
  )

  // Aucun horaire pour ce jour → fermée
  if (horairesDuJour.length === 0) return false

  // Si le jour est explicitement marqué fermé → fermée
  if (horairesDuJour.some((h) => h.ferme)) return false

  // Vérifier si l'heure actuelle tombe dans un des créneaux
  return horairesDuJour.some((h) => {
    if (!h.heure_ouverture || !h.heure_fermeture) return false
    const ouverture = heureEnMinutes(h.heure_ouverture)
    const fermeture = heureEnMinutes(h.heure_fermeture)
    return minutesActuelles >= ouverture && minutesActuelles < fermeture
  })
}