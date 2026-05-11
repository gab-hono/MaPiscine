// app/guide/page.tsx
// Page statique — guide d'utilisation de l'application

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Bouton retour */}
        <Link
          href="/"
          className="text-sm text-bleu-moyen hover:text-bleu-profond transition-colors flex items-center gap-1 w-fit"
        >
          ← Retour à l'accueil
        </Link>

        {/* En-tête */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-bleu-profond">
            Guide des piscines de Paris
          </h1>
          <p className="text-muted text-sm">
            Tout ce que vous devez savoir pour utiliser l'application et trouver
            la piscine qui vous convient.
          </p>
        </div>

        {/* Section : À propos */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-bleu-profond text-base">
            🏊 À propos de l'application
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            <strong>À la piscine !</strong> est une application indépendante qui
            centralise les informations sur les 42 piscines municipales de Paris.
            Elle permet de filtrer les piscines selon vos besoins d'accessibilité,
            vos équipements préférés et votre arrondissement.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Les données proviennent de la <strong>Ville de Paris</strong> et sont
            mises à jour régulièrement. En cas d'erreur ou d'information obsolète,
            le personnel de chaque piscine peut mettre à jour les informations
            depuis leur espace administrateur.
          </p>
        </section>

        {/* Section : Labels */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-bleu-profond text-base">
            🏷️ Comprendre les labels
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Badge label="Accessible PMR" variant="pmr" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine est équipée pour accueillir les personnes à mobilité
                réduite : chaise de mise à l'eau, vestiaires adaptés, cabine PMR
                et/ou ascenseur accessible.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Queer Friendly" variant="queer" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine dispose de vestiaires mixtes ou d'espaces de change
                inclusifs, et s'inscrit dans la démarche
                {" "}<strong>Quartier d'accessibilité augmentée</strong> de la Ville
                de Paris, qui vise à créer des environnements accueillants pour
                les personnes LGBTQIA+.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Pass 3 mois" variant="passe" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine accepte le <strong>Pass 3 mois</strong>, un abonnement
                trimestriel à tarif municipal (43 € plein tarif, 22 € tarif réduit)
                donnant accès libre à la majorité des piscines parisiennes.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Ouverte" variant="ouvert" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine est actuellement ouverte au public. Ce statut est mis
                à jour par le personnel de la piscine. Vérifiez toujours les
                horaires avant de vous déplacer.
              </p>
            </div>
          </div>
        </section>

        {/* Section : Filtres */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-bleu-profond text-base">
            ⚙️ Utiliser les filtres
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            Cliquez sur le bouton <strong>Filtres</strong> pour affiner votre
            recherche. Vous pouvez combiner plusieurs filtres simultanément.
          </p>
          <ul className="text-sm text-foreground flex flex-col gap-2">
            <li className="flex gap-2">
              <span className="text-bleu-moyen font-semibold shrink-0">Accessibilité</span>
              <span className="text-muted">PMR, Queer Friendly, horaires d'ouverture, Pass 3 mois.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bleu-moyen font-semibold shrink-0">Équipements</span>
              <span className="text-muted">Sèche-cheveux, casiers, distributeurs de boissons et d'équipements sportifs.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bleu-moyen font-semibold shrink-0">Espaces</span>
              <span className="text-muted">Solarium, vestiaires mixtes, cabines individuelles, douches.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bleu-moyen font-semibold shrink-0">Bassins</span>
              <span className="text-muted">Filtrer par longueur de bassin (25m ou 50m).</span>
            </li>
          </ul>
        </section>

        {/* Section : Tarifs */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-bleu-profond text-base">
            💶 Tarifs municipaux
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            La majorité des piscines municipales appliquent la grille tarifaire
            de la Ville de Paris. Certaines piscines (Pontoise, Berlioux) ont
            des tarifs propres.
          </p>
          <div className="bg-bleu-tres-pale rounded-xl p-3 text-sm flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-foreground">Entrée normale</span>
              <span className="font-semibold text-bleu-profond">3,50 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Entrée réduite</span>
              <span className="font-semibold text-bleu-profond">2,00 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Carnet 10 entrées</span>
              <span className="font-semibold text-bleu-profond">28,00 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Pass 3 mois</span>
              <span className="font-semibold text-bleu-profond">43,00 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Pass 3 mois réduit</span>
              <span className="font-semibold text-bleu-profond">22,00 €</span>
            </div>
          </div>
          <p className="text-xs text-muted">
            Le tarif réduit s'applique aux enfants, personnes en situation de
            handicap, demandeurs d'emploi et bénéficiaires du RSA. Justificatif
            obligatoire.
          </p>
        </section>

        {/* Section : Compte utilisateur */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-bleu-profond text-base">
            👤 Créer un compte
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            La création d'un compte est gratuite et facultative. Elle vous permet
            de sauvegarder vos piscines favorites et de laisser des évaluations
            pour aider d'autres utilisateur·ice·s.
          </p>
          <Link
            href="/inscription"
            className="w-fit text-sm font-semibold text-bleu-moyen hover:text-bleu-profond
                       transition-colors underline underline-offset-2"
          >
            Créer un compte →
          </Link>
        </section>

      </div>
    </div>
  )
}