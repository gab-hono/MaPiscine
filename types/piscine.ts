// types/piscine.ts
// Types TypeScript reflétant les réponses de l'API /api/piscines

// -----------------------------------------------------------------
// Types auxiliaires (objets imbriqués dans Piscine)
// -----------------------------------------------------------------

// Reflète un objet du tableau "bassins"
type Bassin = {
  id: number
  nom: string
  longueur: number
  largeur: number
  profondeur_min: number | null
  profondeur_max: number | null
  nb_couloirs: number | null
  piscineId: number
}

// Reflète un objet du tableau "horaires_reguliers"
// "periode" est un union type car seules deux valeurs sont possibles
type HoraireRegulier = {
  id: number
  periode: "SCOLAIRE" | "VACANCES"
  jour: string
  heure_ouverture: string
  heure_fermeture: string
  ferme: boolean
  piscineId: number
}

// Reflète un objet du tableau "horaires_exceptions"
// Les dates voyagent en JSON comme des strings ISO 8601
type HoraireException = {
  id: number
  date_debut: string
  date_fin: string
  description: string | null
  piscineId: number
}

// Reflète l'objet "_count" (compteurs relationnels)
type PiscineCount = {
  avis: number
  favoris: number
}

// -----------------------------------------------------------------
// Type principal — utilisé pour TOUS les endpoints piscines
// GET /api/piscines renvoie des objets complets (pas de version allégée)
// GET /api/piscines/[id] renvoie le même objet complet
// -----------------------------------------------------------------

export type Piscine = {
  id: number
  nom: string
  adresse: string
  arrondissement: number
  latitude: number
  longitude: number
  description: string | null
  telephone: string | null
  email: string | null
  site_web: string | null

  // Accessibilité et labels
  acces_pmr: boolean
  queer_friendly: boolean
  accepte_passe_paris: boolean
  is_open: boolean
  espace_solarium: boolean

  // Activités et images
  activites: string[]
  images_galerie: string[]

  // Tarifs (peuvent être null si non renseignés)
  prix_entree_normal: number | null
  prix_entree_reduit: number | null
  prix_carnet_normal: number | null
  prix_carnet_reduit: number | null
  prix_abonnement_normal: number | null
  prix_abonnement_reduit: number | null
  prix_brevet_natation: number | null

  // Équipements
  seche_cheveux: boolean
  distributeur_equipements: boolean
  casiers: boolean
  vestiaires_mixtes: boolean
  cabines_individuelles: boolean
  douches_individuelles: boolean
  douches_collectives: boolean
  cabine_pmr: boolean
  distributeur_boisson: boolean

  // Timestamps (strings ISO 8601)
  last_updated_at: string
  created_at: string

  // Relations imbriquées
  bassins: Bassin[]
  horaires_reguliers: HoraireRegulier[]
  horaires_exceptions: HoraireException[]
  _count: PiscineCount
}

// -----------------------------------------------------------------
// Types pour les réponses enveloppées de l'API
// -----------------------------------------------------------------

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Réponse de GET /api/piscines
export type PiscinesResponse = {
  data: Piscine[]
  pagination: PaginationMeta
}

// Réponse de GET /api/piscines/[id]
export type PiscineDetailResponse = {
  data: Piscine
}