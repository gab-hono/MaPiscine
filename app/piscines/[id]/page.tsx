// app/piscines/[id]/page.tsx
// Page détail d'une piscine — Server Component
// Fetch côté serveur, gestion 404, sections repliables via SectionToggle

import { notFound } from "next/navigation"
import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"
import { SectionToggle } from "@/components/ui/SectionToggle"
import { AvisSection } from "@/components/piscines/AvisSection"

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
// Composants internes (Server — pas de state)
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

function EquipementItem({ label, actif }: { label: string; actif: boolean }) {
  return (
    <div
      className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
        actif ? "bg-vert/10 text-vert" : "bg-gray-50 text-muted line-through"
      }`}
    >
      <span aria-hidden="true">{actif ? "✓" : "✗"}</span>
      {label}
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

  // Fetch en parallèle — plus rapide qu'en séquence
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
          className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors flex items-center gap-1 w-fit"
        >
          ← Retour à la liste
        </Link>

        {/* En-tête — toujours visible, pas de toggle */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="h-48 bg-bleu-tres-pale flex items-center justify-center">
            {piscine.images_galerie.length > 0 ? (
              <img
                src={piscine.images_galerie[0]}
                alt={piscine.nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl opacity-20" aria-hidden="true">🏊</span>
            )}
          </div>

          <div className="p-5 flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold text-bleu-profond">{piscine.nom}</h1>
              <p className="text-sm text-muted mt-1 flex items-center gap-1">
                <span aria-hidden="true">📍</span>
                {piscine.adresse}, Paris {piscine.arrondissement}e
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                label={piscine.is_open ? "Ouverte" : "Fermée"}
                variant={piscine.is_open ? "ouvert" : "ferme"}
                size="md"
              />
              {piscine.acces_pmr && <Badge label="Accessible PMR" variant="pmr" size="md" />}
              {piscine.queer_friendly && <Badge label="Queer Friendly" variant="queer" size="md" />}
              {piscine.accepte_passe_paris && <Badge label="Pass 3 mois" variant="passe" size="md" />}
            </div>

            {piscine.description && (
              <p className="text-sm text-foreground leading-relaxed">{piscine.description}</p>
            )}

            {/* Contact */}
            <div className="flex flex-wrap gap-3 pt-1">
              {piscine.telephone && (
                <a
                  href={`tel:${piscine.telephone}`}
                  className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
                >
                  📞 {piscine.telephone}
                </a>
              )}
              {piscine.site_web && (
                <a
                  href={piscine.site_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
                >
                  🌐 Site web
                </a>
              )}
              {piscine.latitude && piscine.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${piscine.latitude},${piscine.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors"
                >
                  📍 Voir sur Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bassins */}
        {piscine.bassins.length > 0 && (
          <SectionToggle titre="Bassins" icone="🏊">
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
          <SectionToggle titre="Horaires" icone="🕐">
            <div className="flex flex-col gap-3">
              {(["SCOLAIRE", "VACANCES"] as const).map((periode) => {
                const parJour = horairesGroupes[periode]
                if (Object.keys(parJour).length === 0) return null

                return (
                  <SectionToggle
                    key={periode}
                    titre={periode === "SCOLAIRE" ? "Période scolaire" : "Période vacances scolaires"}
                    variante="plain"
                    defaultOuvert={periode === "SCOLAIRE"}
                  >
                    <div className="flex flex-col">
                      {Object.entries(parJour).map(([jour, creneaux]) => (
                        <div
                          key={jour}
                          className="flex justify-between text-sm py-1.5 border-b border-border last:border-0"
                        >
                          <span className="text-foreground font-medium w-24">{jour}</span>
                          {creneaux[0].ferme ? (
                            <span className="text-rouge">Fermé</span>
                          ) : (
                            <div className="flex flex-col items-end gap-0.5">
                              {creneaux.map((h) => (
                                <span key={h.id} className="text-muted">
                                  {h.heure_ouverture} – {h.heure_fermeture}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionToggle>
                )
              })}
            </div>
          </SectionToggle>
        )}

        {/* Tarifs */}
        <SectionToggle titre="Tarifs" icone="💶">
          <LigneInfo label="Entrée normale" valeur={piscine.prix_entree_normal ? `${piscine.prix_entree_normal} €` : null} />
          <LigneInfo label="Entrée réduite" valeur={piscine.prix_entree_reduit ? `${piscine.prix_entree_reduit} €` : null} />
          <LigneInfo label="Carnet 10 entrées" valeur={piscine.prix_carnet_normal ? `${piscine.prix_carnet_normal} €` : null} />
          <LigneInfo label="Carnet réduit" valeur={piscine.prix_carnet_reduit ? `${piscine.prix_carnet_reduit} €` : null} />
          <LigneInfo label="Abonnement 3 mois" valeur={piscine.prix_abonnement_normal ? `${piscine.prix_abonnement_normal} €` : null} />
          <LigneInfo label="Abonnement réduit" valeur={piscine.prix_abonnement_reduit ? `${piscine.prix_abonnement_reduit} €` : null} />
          <LigneInfo label="Brevet de natation" valeur={piscine.prix_brevet_natation ? `${piscine.prix_brevet_natation} €` : null} />
        </SectionToggle>

        {/* Équipements */}
        <SectionToggle titre="Équipements & espaces" icone="🛁">
          <div className="grid grid-cols-2 gap-2">
            <EquipementItem label="Sèche-cheveux" actif={piscine.seche_cheveux} />
            <EquipementItem label="Casiers" actif={piscine.casiers} />
            <EquipementItem label="Dist. boissons" actif={piscine.distributeur_boisson} />
            <EquipementItem label="Dist. équipements" actif={piscine.distributeur_equipements} />
            <EquipementItem label="Solarium" actif={piscine.espace_solarium} />
            <EquipementItem label="Vestiaires mixtes" actif={piscine.vestiaires_mixtes} />
            <EquipementItem label="Cabines indiv." actif={piscine.cabines_individuelles} />
            <EquipementItem label="Douches indiv." actif={piscine.douches_individuelles} />
            <EquipementItem label="Douches collectives" actif={piscine.douches_collectives} />
            <EquipementItem label="Cabine PMR" actif={piscine.cabine_pmr} />
          </div>
        </SectionToggle>

        {/* Activités */}
        {piscine.activites.length > 0 && (
          <SectionToggle titre="Activités" icone="🤽">
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
        <SectionToggle titre="Avis" icone="★" defaultOuvert={true}>
          <AvisSection avis={avis} piscineId={piscine.id} />
        </SectionToggle>

      </div>
    </div>
  )
}