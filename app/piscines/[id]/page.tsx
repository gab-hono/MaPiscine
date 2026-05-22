// app/piscines/[id]/page.tsx
// Page détail d'une piscine — Server Component
// Fetch côté serveur, gestion 404, sections repliables via SectionToggle

import { notFound } from "next/navigation"
import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { SectionToggle } from "@/components/ui/SectionToggle"
import { Icon } from "@/components/ui/Icon"
import { AvisSection } from "@/components/piscines/AvisSection"
import { PiscineDetailHeader } from "@/components/piscines/PiscineDetailHeader"
import { PiscineHoraires } from "@/components/piscines/PiscineHoraires"
import { PiscineEquipements } from "@/components/piscines/PiscineEquipements"

// -----------------------------------------------------------------
// Fetch côté serveur — piscine
// -----------------------------------------------------------------

async function getPiscine(id: string): Promise<Piscine | null> {
  try {
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/piscines/${id}`, {
      next: { revalidate: 3600 },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Erreur API : ${res.status}`)
    const json = await res.json()
    return json.data as Piscine
  } catch {
    return null
  }
}

// -----------------------------------------------------------------
// Fetch côté serveur — avis
// -----------------------------------------------------------------

async function getAvis(piscineId: string) {
  try {
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/avis?piscineId=${piscineId}`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

// -----------------------------------------------------------------
// Utilitaire : grouper les horaires par jour dans l'ordre lun→dim
// -----------------------------------------------------------------

const JOURS_ORDRE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

function grouperParJour(horaires: Piscine["horaires_reguliers"]) {
  return JOURS_ORDRE.reduce((acc, jour) => {
    const creneaux = horaires.filter((h) => h.jour === jour)
    if (creneaux.length > 0) acc[jour] = creneaux
    return acc
  }, {} as Record<string, Piscine["horaires_reguliers"]>)
}

// -----------------------------------------------------------------
// Composant interne — ligne de tarif
// -----------------------------------------------------------------

function LigneInfo({ label, valeur }: { label: string; valeur: string | number | null }) {
  if (!valeur) return null
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{valeur}</span>
    </div>
  )
}

// -----------------------------------------------------------------
// Page principale
// -----------------------------------------------------------------

export default async function PiscineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [piscine, avis] = await Promise.all([
    getPiscine(id),
    getAvis(id),
  ])

  if (!piscine) notFound()

  const horairesGroupes = {
    SCOLAIRE: grouperParJour(
      piscine.horaires_reguliers.filter((h) => h.periode === "SCOLAIRE")
    ),
    VACANCES: grouperParJour(
      piscine.horaires_reguliers.filter((h) => h.periode === "VACANCES")
    ),
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">

        {/* Bouton retour */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors w-fit"
        >
          <Icon name="fleche-gauche" className="w-3.5 h-3.5" />
          Retour à la liste
        </Link>

        {/* En-tête */}
        <PiscineDetailHeader piscine={piscine} />

        {/* Bassins */}
        {piscine.bassins.length > 0 && (
          <SectionToggle
            titre="Bassins"
            icone={<Icon name="natation" className="w-4 h-4 text-bleu-clair" />}
          >
            <div className="flex flex-col gap-3">
              {piscine.bassins.map((bassin) => (
                <div
                  key={bassin.id}
                  className="bg-bleu-tres-pale rounded-xl p-3 text-sm flex flex-col gap-1"
                >
                  <p className="font-semibold text-bleu-profond">{bassin.nom ?? "Bassin"}</p>
                  {bassin.longueur && (
                    <p className="text-muted">
                      {bassin.longueur}m
                      {bassin.largeur ? ` × ${bassin.largeur}m` : ""}
                      {bassin.nb_couloirs ? ` — ${bassin.nb_couloirs} couloirs` : ""}
                    </p>
                  )}
                  {(bassin.profondeur_min || bassin.profondeur_max) && (
                    <p className="text-muted">
                      Profondeur : {bassin.profondeur_min}m – {bassin.profondeur_max}m
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionToggle>
        )}

        {/* Horaires */}
        {piscine.horaires_reguliers.length > 0 && (
          <PiscineHoraires horairesGroupes={horairesGroupes} />
        )}

        {/* Tarifs */}
        <SectionToggle
          titre="Tarifs"
          icone={<Icon name="tarifs" className="w-4 h-4 text-bleu-clair" />}
        >
          <LigneInfo label="Entrée normale" valeur={piscine.prix_entree_normal ? `${piscine.prix_entree_normal} €` : null} />
          <LigneInfo label="Entrée réduite" valeur={piscine.prix_entree_reduit ? `${piscine.prix_entree_reduit} €` : null} />
          <LigneInfo label="Carnet 10 entrées" valeur={piscine.prix_carnet_normal ? `${piscine.prix_carnet_normal} €` : null} />
          <LigneInfo label="Carnet réduit" valeur={piscine.prix_carnet_reduit ? `${piscine.prix_carnet_reduit} €` : null} />
          <LigneInfo label="Abonnement 3 mois" valeur={piscine.prix_abonnement_normal ? `${piscine.prix_abonnement_normal} €` : null} />
          <LigneInfo label="Abonnement réduit" valeur={piscine.prix_abonnement_reduit ? `${piscine.prix_abonnement_reduit} €` : null} />
          <LigneInfo label="Brevet de natation" valeur={piscine.prix_brevet_natation ? `${piscine.prix_brevet_natation} €` : null} />
        </SectionToggle>

        {/* Équipements */}
        <PiscineEquipements piscine={piscine} />

        {/* Activités */}
        {piscine.activites.length > 0 && (
          <SectionToggle
            titre="Activités"
            icone={<Icon name="activites" className="w-4 h-4 text-bleu-clair" />}
          >
            <div className="flex flex-wrap gap-2">
              {piscine.activites.map((activite) => (
                <span
                  key={activite}
                  className="text-sm bg-bleu-tres-pale text-bleu-moyen px-3 py-1 rounded-full"
                >
                  {activite}
                </span>
              ))}
            </div>
          </SectionToggle>
        )}

        {/* Avis + boutons d'action */}
        <SectionToggle
          titre="Avis"
          icone={<Icon name="etoile" className="w-4 h-4 text-bleu-clair" />}
          defaultOuvert={true}
        >
          <AvisSection avis={avis} piscineId={piscine.id} />
        </SectionToggle>

      </div>
    </div>
  )
}