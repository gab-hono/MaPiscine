// app/confidentialite/page.tsx
// Page statique — politique de confidentialité (RGPD)

import Link from "next/link"

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

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
            Politique de confidentialité
          </h1>
          <p className="text-xs text-muted">
            Dernière mise à jour : mai 2026
          </p>
        </div>

        {/* Contenu RGPD */}
        <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-6 text-sm text-foreground leading-relaxed">

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">1. Responsable du traitement</h2>
            <p>
              L'application <strong>À la piscine !</strong> est un projet étudiant
              développé dans le cadre d'une certification RNCP Niveau 6 à Ada Tech
              School (Paris). Elle n'est pas une application commerciale.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">2. Données collectées</h2>
            <p>
              Lors de la création d'un compte, nous collectons les données suivantes :
            </p>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1 ml-2">
              <li>Nom d'utilisateur·ice</li>
              <li>Adresse e-mail</li>
              <li>Mot de passe (chiffré, jamais stocké en clair)</li>
              <li>Pronoms (optionnel, renseigné volontairement)</li>
            </ul>
            <p>
              Nous collectons également les données liées à votre utilisation :
              piscines ajoutées en favoris, évaluations soumises.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">3. Finalité du traitement</h2>
            <p>
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1 ml-2">
              <li>Permettre la connexion à votre compte</li>
              <li>Sauvegarder vos piscines favorites</li>
              <li>Afficher vos évaluations sur les fiches piscines</li>
            </ul>
            <p>
              Aucune donnée n'est vendue, partagée ou transmise à des tiers à des
              fins commerciales.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">4. Durée de conservation</h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. Vous
              pouvez supprimer votre compte à tout moment depuis votre espace
              personnel, ce qui entraîne la suppression de toutes vos données.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">5. Vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1 ml-2">
              <li><strong>Droit d'accès</strong> — consulter vos données personnelles</li>
              <li><strong>Droit de rectification</strong> — corriger des informations inexactes</li>
              <li><strong>Droit à l'effacement</strong> — supprimer votre compte et vos données</li>
              <li><strong>Droit à la portabilité</strong> — obtenir une copie de vos données</li>
              <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements</li>
            </ul>
            <p>
              Ces droits peuvent être exercés directement depuis votre espace
              personnel ou en contactant l'équipe via la page d'accueil.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">6. Cookies</h2>
            <p>
              L'application utilise uniquement des cookies techniques nécessaires
              au fonctionnement de l'authentification (token de session). Aucun
              cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">7. Hébergement des données</h2>
            <p>
              Les données sont hébergées sur <strong>Neon</strong> (PostgreSQL
              serverless) avec des serveurs localisés dans l'Union Européenne,
              et sur <strong>Vercel</strong> pour l'application web.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-bleu-profond">8. Source des données piscines</h2>
            <p>
              Les informations sur les piscines (horaires, tarifs, équipements,
              accessibilité) proviennent du site officiel de la{" "}
              <a
                href="https://www.paris.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bleu-moyen hover:text-bleu-profond underline underline-offset-2"
              >
                Ville de Paris
              </a>{" "}
              et sont mises à jour régulièrement. Ces données sont publiques et
              librement accessibles.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}