// src/lib/utils/__tests__/horaires.test.ts
// Tests unitaires de la fonction estOuverteMaintenant
// Utilise vitest + vi.setSystemTime pour simuler l'heure

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { estOuverteMaintenant } from "../horaires" 

// -----------------------------------------------------------------
// Helpers — créer des horaires de test facilement
// -----------------------------------------------------------------

function creerHoraire(
  jour: string,
  heure_ouverture: string,
  heure_fermeture: string,
  periode: "SCOLAIRE" | "VACANCES" = "SCOLAIRE",
  ferme = false
) {
  return { jour, heure_ouverture, heure_fermeture, periode, ferme }
}

// -----------------------------------------------------------------
// Simuler une date/heure précise (UTC — on teste en UTC+0 pour simplicité)
// La fonction utilise getHours/getDay sur l'objet Date local
// -----------------------------------------------------------------

function simulerHeure(iso: string) {
  vi.setSystemTime(new Date(iso))
}

// -----------------------------------------------------------------
// Tests
// -----------------------------------------------------------------

describe("estOuverteMaintenant", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retourne false si aucun horaire", () => {
    simulerHeure("2026-05-20T10:00:00Z") // mercredi
    expect(estOuverteMaintenant([])).toBe(false)
  })

  it("retourne true si l'heure actuelle est dans un créneau SCOLAIRE", () => {
    // Mercredi 20 mai 2026, 14h00 UTC+2 = 12h00 UTC
    simulerHeure("2026-05-20T12:00:00Z")
    const horaires = [
      creerHoraire("Mercredi", "13:30", "18:00"),
    ]
    // 14h00 Paris = dans le créneau 13:30-18:00
    expect(estOuverteMaintenant(horaires)).toBe(true)
  })

  it("retourne false si l'heure actuelle est hors créneau", () => {
    // Mercredi 20 mai 2026, 10h00 UTC+2 = 08h00 UTC
    simulerHeure("2026-05-20T08:00:00Z")
    const horaires = [
      creerHoraire("Mercredi", "13:30", "18:00"),
    ]
    // 10h00 Paris = hors du créneau 13:30-18:00
    expect(estOuverteMaintenant(horaires)).toBe(false)
  })

  it("retourne true si l'heure tombe dans le deuxième créneau d'un jour", () => {
    // Lundi 18 mai 2026, 12h30 UTC+2 = 10h30 UTC
    simulerHeure("2026-05-18T10:30:00Z")
    const horaires = [
      creerHoraire("Lundi", "07:00", "08:30"),
      creerHoraire("Lundi", "11:30", "13:30"),
    ]
    // 12h30 Paris = dans le créneau 11:30-13:30
    expect(estOuverteMaintenant(horaires)).toBe(true)
  })

  it("retourne false si le jour est marqué fermé", () => {
    simulerHeure("2026-05-18T10:30:00Z") // lundi
    const horaires = [
      creerHoraire("Lundi", "07:00", "08:30", "SCOLAIRE", true),
    ]
    expect(estOuverteMaintenant(horaires)).toBe(false)
  })

  it("ignore les horaires VACANCES", () => {
    // Mercredi, heure dans un créneau VACANCES mais pas SCOLAIRE
    simulerHeure("2026-05-20T10:00:00Z") // 12h00 Paris
    const horaires = [
      creerHoraire("Mercredi", "09:00", "19:00", "VACANCES"),
    ]
    // Pas de créneau SCOLAIRE → fermée
    expect(estOuverteMaintenant(horaires)).toBe(false)
  })

  it("retourne false exactement à l'heure de fermeture (borne exclue)", () => {
    // 18h00 Paris = 16h00 UTC
    simulerHeure("2026-05-20T16:00:00Z")
    const horaires = [
      creerHoraire("Mercredi", "13:30", "18:00"),
    ]
    expect(estOuverteMaintenant(horaires)).toBe(false)
  })

  it("retourne true exactement à l'heure d'ouverture (borne incluse)", () => {
    // 13h30 Paris = 11h30 UTC
    simulerHeure("2026-05-20T11:30:00Z")
    const horaires = [
      creerHoraire("Mercredi", "13:30", "18:00"),
    ]
    expect(estOuverteMaintenant(horaires)).toBe(true)
  })

  it("retourne false si aucun horaire pour le jour actuel", () => {
    // Dimanche
    simulerHeure("2026-05-17T10:00:00Z")
    const horaires = [
      creerHoraire("Lundi", "07:00", "20:00"),
    ]
    expect(estOuverteMaintenant(horaires)).toBe(false)
  })
})