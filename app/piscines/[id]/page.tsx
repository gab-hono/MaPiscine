// app/piscines/[id]/page.tsx
// Page détail d'une piscine — Server Component
// Fetch côté serveur, gestion 404, données complètes

import { notFound } from "next/navigation"
import Link from "next/link"
import type { Piscine } from "@/types/piscine"
import { Badge } from "@/components/ui/Badge"

// -----------------------------------------------------------------
// Fetch côté serveur — appelé au moment du rendu
// -----------------------------------------------------------------

async function getPiscine(id: string): Promise<Piscine | null> {
  try {
    // En Server Component, on utilise l'URL absolue
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/piscines/${id}`, {
      // next.js cache : on revalide toutes les heures
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
// Composants internes
// -----------------------------------------------------------------

function SectionTitre({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-bleu-profond flex items-center gap-2 mb-3">
      {children}
    </h2>
  )
}

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
  const piscine = await getPiscine(id)

  // Redirige vers la page 404 de Next.js si la piscine n'existe pas
  if (!piscine) notFound()

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Bouton retour */}
        <Link
          href="/"
          className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors flex items-center gap-1 w-fit"
        >
          ← Retour à la liste
        </Link>

        {/* En-tête */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Zone image */}
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

            {/* Badges */}
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

            {/* Description */}
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
            </div>
          </div>
        </div>

        {/* Bassins */}
        {piscine.bassins.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <SectionTitre>🏊 Bassins</SectionTitre>
            <div className="flex flex-col gap-4">
              {piscine.bassins.map((bassin) => (
                <div key={bassin.id} className="bg-bleu-tres-pale rounded-xl p-3 text-sm flex flex-col gap-1">
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
          </div>
        )}

        {/* Tarifs */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <SectionTitre>💶 Tarifs</SectionTitre>
          <LigneInfo label="Entrée normale" valeur={piscine.prix_entree_normal ? `${piscine.prix_entree_normal} €` : null} />
          <LigneInfo label="Entrée réduite" valeur={piscine.prix_entree_reduit ? `${piscine.prix_entree_reduit} €` : null} />
          <LigneInfo label="Carnet 10 entrées" valeur={piscine.prix_carnet_normal ? `${piscine.prix_carnet_normal} €` : null} />
          <LigneInfo label="Carnet réduit" valeur={piscine.prix_carnet_reduit ? `${piscine.prix_carnet_reduit} €` : null} />
          <LigneInfo label="Abonnement 3 mois" valeur={piscine.prix_abonnement_normal ? `${piscine.prix_abonnement_normal} €` : null} />
          <LigneInfo label="Abonnement réduit" valeur={piscine.prix_abonnement_reduit ? `${piscine.prix_abonnement_reduit} €` : null} />
          <LigneInfo label="Brevet de natation" valeur={piscine.prix_brevet_natation ? `${piscine.prix_brevet_natation} €` : null} />
        </div>

        {/* Équipements */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <SectionTitre>🛁 Équipements & espaces</SectionTitre>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Sèche-cheveux", actif: piscine.seche_cheveux },
              { label: "Casiers", actif: piscine.casiers },
              { label: "Distributeur boissons", actif: piscine.distributeur_boisson },
              { label: "Distributeur équipements", actif: piscine.distributeur_equipements },
              { label: "Espace solarium", actif: piscine.espace_solarium },
              { label: "Vestiaires mixtes", actif: piscine.vestiaires_mixtes },
              { label: "Cabines individuelles", actif: piscine.cabines_individuelles },
              { label: "Douches individuelles", actif: piscine.douches_individuelles },
              { label: "Douches collectives", actif: piscine.douches_collectives },
              { label: "Cabine PMR", actif: piscine.cabine_pmr },
            ].map(({ label, actif }) => (
              <div
                key={label}
                className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
                  actif
                    ? "bg-vert/10 text-vert"
                    : "bg-gray-50 text-muted line-through"
                }`}
              >
                <span aria-hidden="true">{actif ? "✓" : "✗"}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Horaires */}
        {piscine.horaires_reguliers.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5">
            <SectionTitre>🕐 Horaires</SectionTitre>
            {(["SCOLAIRE", "VACANCES"] as const).map((periode) => {
            const horaires = piscine.horaires_reguliers.filter(
                (h) => h.periode === periode
            )
            if (horaires.length === 0) return null

            // Grouper les horaires par jour
            const joursOrdre = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
            const parJour = joursOrdre.reduce((acc, jour) => {
                const creneaux = horaires.filter((h) => h.jour === jour)
                if (creneaux.length > 0) acc[jour] = creneaux
                return acc
            }, {} as Record<string, typeof horaires>)

            return (
                <div key={periode} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                    {periode === "SCOLAIRE" ? "Période scolaire" : "Vacances scolaires"}
                </p>
                <div className="flex flex-col gap-1">
                    {Object.entries(parJour).map(([jour, creneaux]) => (
                    <div key={jour} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
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
                </div>
            )
            })}
        </div>
        )}

        {/* Activités */}
        {piscine.activites.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <SectionTitre>🤽 Activités</SectionTitre>
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
          </div>
        )}

        {/* Boutons actions — placeholder pour l'espace user (sprint suivant) */}
        <div className="flex flex-col sm:flex-row gap-3 pb-6">
          <button
            className="flex-1 py-3 rounded-xl bg-bleu-profond text-white font-semibold text-sm
                       hover:bg-bleu-moyen transition-colors"
            disabled
          >
            ♡ Ajouter aux favoris
          </button>
          <button
            className="flex-1 py-3 rounded-xl border border-bleu-profond text-bleu-profond font-semibold text-sm
                       hover:bg-bleu-tres-pale transition-colors"
            disabled
          >
            ★ Laisser un avis
          </button>
        </div>

      </div>
    </div>
  )
}