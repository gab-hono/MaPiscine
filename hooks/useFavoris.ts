// hooks/useFavoris.ts
// Hook pour gérer les favoris d'un utilisateur connecté
"use client"

import { useState, useEffect, useCallback } from "react"
import { authClient } from "@/src/lib/auth-client"

export function useFavoris() {
  // Set des piscineId favoris — accès O(1) pour vérifier si une piscine est favorite
  const [favorisIds, setFavorisIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  // Récupère la session utilisateur
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result?.data?.user) {
        setUserId(result.data.user.id)
      }
    })
  }, [])

  // Charge les favoris depuis l'API au montage (seulement si connecté)
  useEffect(() => {
    if (!userId) return

    setLoading(true)
    fetch("/api/favoris")
      .then((res) => res.json())
      .then((json) => {
        const ids = new Set<number>(
          json.data?.map((f: { piscineId: number }) => f.piscineId) ?? []
        )
        setFavorisIds(ids)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  // Vérifie si une piscine est dans les favoris
  const estFavori = useCallback(
    (piscineId: number) => favorisIds.has(piscineId),
    [favorisIds]
  )

  // Toggle favori — ajoute ou supprime selon l'état actuel
  const toggleFavori = useCallback(
    async (piscineId: number) => {
      if (!userId) return false // Non connecté

      const estDejàFavori = favorisIds.has(piscineId)

      // Mise à jour optimiste — l'UI réagit immédiatement
      setFavorisIds((prev) => {
        const next = new Set(prev)
        if (estDejàFavori) {
          next.delete(piscineId)
        } else {
          next.add(piscineId)
        }
        return next
      })

      try {
        if (estDejàFavori) {
          // DELETE /api/favoris/[id] — l'id est le piscineId ici
          const res = await fetch(`/api/favoris/${piscineId}`, {
            method: "DELETE",
          })
          if (!res.ok) throw new Error("Erreur DELETE favori")
        } else {
          // POST /api/favoris
          const res = await fetch("/api/favoris", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ piscineId }),
          })
          console.log("Status POST favori:", res.status)
const body = await res.json()
console.log("Body POST favori:", body)

if (!res.ok) throw new Error("Erreur POST favori")
          if (!res.ok) throw new Error("Erreur POST favori")
        }
        return true
      } catch (err) {
        // Rollback si l'API échoue
        setFavorisIds((prev) => {
          const next = new Set(prev)
          if (estDejàFavori) {
            next.add(piscineId)
          } else {
            next.delete(piscineId)
          }
          return next
        })
        console.error(err)
        return false
      }
    },
    [userId, favorisIds]
  )

  return { estFavori, toggleFavori, loading, estConnecte: !!userId }
}