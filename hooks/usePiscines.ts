// hooks/usePiscines.ts
// Hook centralisé pour fetch, filtres et pagination de GET /api/piscines

"use client"

import { useState, useEffect, useCallback } from "react"
import type { Piscine, PaginationMeta } from "@/types/piscine"

// -----------------------------------------------------------------
// Types des filtres — reflètent les query params de GET /api/piscines
// -----------------------------------------------------------------

export type PiscinesFiltres = {
  //Localisation
  arrondissement?: number

  //Accessibilité et labels
  acces_pmr?: boolean
  queer_friendly?: boolean
  accepte_passe_paris?: boolean
  is_open?: boolean

  //Équipements
  seche_cheveux?: boolean
  casiers?: boolean
  distributeur_boisson?: boolean
  distributeur_equipements?: boolean

  //Espaces
  espace_solarium?: boolean
  vestiaires_mixtes?: boolean
  cabines_individuelles?: boolean
  douches_individuelles?: boolean
  douches_collectives?: boolean
  cabine_pmr?: boolean

  //Bassins - valeur numérique (25 ou 50) - Nécessite un endpoint dédié côté API
  longueur_bassin?: number
}

// -----------------------------------------------------------------
// Valeur initiale des filtres (tous vides = pas de filtre actif)
// -----------------------------------------------------------------

const FILTRES_INITIAUX: PiscinesFiltres = {}

// -----------------------------------------------------------------
// Utilitaire : convertit les filtres en query string
// -----------------------------------------------------------------

function filtresVersQueryString(
  filtres: PiscinesFiltres,
  page: number,
  limit: number
): string {
  const params = new URLSearchParams()

  params.set("page", String(page))
  params.set("limit", String(limit))

  // On itère les entrées du filtre pour n'inclure que les valeurs définies
  for (const [cle, valeur] of Object.entries(filtres)) {
    if (valeur !== undefined) {
      params.set(cle, String(valeur))
    }
  }

  return params.toString()
}

// -----------------------------------------------------------------
// Hook principal
// -----------------------------------------------------------------

export function usePiscines(limitParPage = 12) {
  const [piscines, setPiscines] = useState<Piscine[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [filtres, setFiltres] = useState<PiscinesFiltres>(FILTRES_INITIAUX)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  // Fetch déclenché à chaque changement de filtres ou de page
  const fetchPiscines = useCallback(async () => {
    setLoading(true)
    setErreur(null)

    const queryString = filtresVersQueryString(filtres, page, limitParPage)

    try {
      const res = await fetch(`/api/piscines?${queryString}`, {
        cache: "no-store"
      })

      if (!res.ok) {
        throw new Error(`Erreur API : ${res.status}`)
      }

      const json = await res.json()
      setPiscines(json.data)
      setPagination(json.pagination)
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur inconnue")
      setPiscines([])
    } finally {
      setLoading(false)
    }
  }, [filtres, page, limitParPage])

  useEffect(() => {
    fetchPiscines()
  }, [fetchPiscines])

  // Mise à jour d'un filtre — remet la page à 1 automatiquement
  const mettreAJourFiltre = useCallback(
    (cle: keyof PiscinesFiltres, valeur: PiscinesFiltres[typeof cle]) => {
      setFiltres((prev) => ({ ...prev, [cle]: valeur }))
      setPage(1)
    },
    []
  )

  // Suppression d'un filtre spécifique
  const supprimerFiltre = useCallback((cle: keyof PiscinesFiltres) => {
    setFiltres((prev) => {
      const suivant = { ...prev }
      delete suivant[cle]
      return suivant
    })
    setPage(1)
  }, [])

  // Remise à zéro de tous les filtres
  const reinitialiserFiltres = useCallback(() => {
    setFiltres(FILTRES_INITIAUX)
    setPage(1)
  }, [])

  return {
    // Données
    piscines,
    pagination,
    // États
    loading,
    erreur,
    // Filtres
    filtres,
    mettreAJourFiltre,
    supprimerFiltre,
    reinitialiserFiltres,
    // Pagination
    page,
    setPage,
  }
}