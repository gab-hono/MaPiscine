// app/guide/page.tsx
// Guide d'utilisation de MaPiscine + informations pratiques sur les piscines de Paris

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Icon } from "@/components/ui/Icon"

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Retour */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-bleu-moyen hover:text-bleu-profond transition-colors w-fit"
        >
          <Icon name="fleche-gauche" className="w-3.5 h-3.5" />
          Retour à l'accueil
        </Link>

        {/* Titre */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-bleu-profond">
            Guide MaPiscine
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Tout ce que vous devez savoir pour utiliser l'application et préparer votre visite dans une piscine municipale de Paris.
          </p>
        </div>

        {/* ================================================================
            PARTIE 1 — FONCTIONNEMENT DE L'APPLICATION
        ================================================================ */}

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-bleu-profond flex items-center gap-2">
            <Icon name="lupa" className="w-5 h-5 text-bleu-clair" />
            Utiliser MaPiscine
          </h2>
          <p className="text-xs text-muted">Comment trouver la piscine qui vous convient</p>
        </div>

        {/* À propos */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="natation" className="w-4 h-4 text-bleu-clair" />
            À propos de l'application
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            <strong>MaPiscine</strong> est une application indépendante qui centralise les informations sur les 42 piscines municipales de Paris. Elle permet de filtrer les piscines selon vos besoins d'accessibilité, vos équipements préférés et votre arrondissement.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Les données proviennent des sites des piscines de la <strong>Ville de Paris</strong> et sont maintenues par une seule personne. Malgré le soin apporté, des erreurs ou informations obsolètes peuvent subsister. En cas de doute, vérifiez directement auprès de la piscine concernée. On prévoit une amélioration pour que les administrateurs de chaque piscine puissent modifier les informations en temps réel.
          </p>
        </section>

        {/* Filtres */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="filtres" className="w-4 h-4 text-bleu-clair" />
            Utiliser les filtres
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Cliquez sur <strong>Filtres</strong> pour affiner votre recherche. Vous pouvez combiner plusieurs filtres simultanément. Ces filtres sont <strong>indicatifs</strong>. Ils reflètent les informations disponibles dans notre base de données, qui peut ne pas être exhaustive.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-start">
              <span className="text-bleu-moyen font-semibold text-sm shrink-0 w-32">Accessibilité</span>
              <span className="text-sm text-muted">PMR, Queer Friendly, ouverture en temps réel, Pass 3 mois.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-bleu-moyen font-semibold text-sm shrink-0 w-32">Équipements</span>
              <span className="text-sm text-muted">Sèche-cheveux, casiers, distributeurs de boissons et d'équipements sportifs.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-bleu-moyen font-semibold text-sm shrink-0 w-32">Espaces</span>
              <span className="text-sm text-muted">Solarium, vestiaires mixtes, cabine PMR.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-bleu-moyen font-semibold text-sm shrink-0 w-32">Bassins</span>
              <span className="text-sm text-muted">Filtrer par longueur de bassin (25m ou 50m).</span>
            </div>
          </div>
        </section>

        {/* Labels */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-bleu-profond text-base">
            Comprendre les labels
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Badge label="Accessible PMR" variant="pmr" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine est équipée pour accueillir les personnes à mobilité réduite : chaise de mise à l'eau, vestiaires adaptés, cabine PMR et/ou ascenseur. Ces informations sont indicatives. Contactez la piscine pour confirmer les équipements disponibles le jour de votre visite.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Queer Friendly" variant="queer" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine dispose de vestiaires mixtes ou d'espaces de change inclusifs, dans le cadre de la démarche <strong>Quartier d'accessibilité augmentée</strong> de la Ville de Paris, visant à créer des environnements accueillants pour les personnes LGBTQIA+.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Pass 3 mois" variant="passe" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                La piscine accepte le <strong>Pass 3 mois</strong>, un abonnement trimestriel à tarif municipal (43 € plein tarif, 22 € tarif réduit) donnant accès libre à la majorité des piscines parisiennes.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Badge label="Ouverte" variant="ouvert" size="md" />
              <p className="text-sm text-foreground leading-relaxed">
                Le statut d'ouverture est calculé en temps réel à partir des horaires scolaires de la piscine. Il ne tient pas encore compte des horaires de vacances scolaires ni des jours fériés; une amélioration prévue pour une prochaine version. En cas de doute, vérifiez auprès de l'établissement.
              </p>
            </div>
          </div>
        </section>

        {/* Compte */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="compte" className="w-4 h-4 text-bleu-clair" />
            Créer un compte
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            La création d'un compte est <strong>gratuite et facultative</strong>. Elle vous permet de sauvegarder vos piscines favorites et de laisser des évaluations multicritères pour aider d'autres utilisateur·ice·s.
          </p>
          <Link
            href="/inscription"
            className="w-fit text-sm font-semibold text-bleu-moyen hover:text-bleu-profond transition-colors underline underline-offset-2"
          >
            Créer un compte →
          </Link>
        </section>

        {/* ================================================================
            PARTIE 2 — GUIDE PRATIQUE DES PISCINES DE PARIS
        ================================================================ */}

        <div className="flex flex-col gap-1 mt-4">
          <h2 className="text-lg font-bold text-bleu-profond flex items-center gap-2">
            <Icon name="natation" className="w-5 h-5 text-bleu-clair" />
            Guide pratique des piscines parisiennes
          </h2>
          <p className="text-xs text-muted">Rituels, tarifs et équipements : tout ce qu'il faut savoir avant votre première visite</p>
        </div>

        {/* Horaires et règles d'entrée */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="horloge" className="w-4 h-4 text-bleu-clair" />
            Horaires et règles d'entrée
          </h3>
          <div className="flex flex-col gap-2 text-sm text-foreground leading-relaxed">
            <p>Les piscines parisiennes appliquent des règles strictes sur les horaires d'accès :</p>
            <div className="bg-bleu-tres-pale rounded-xl p-4 flex flex-col gap-2">
              <p><strong>Entrée jusqu'à 1h avant la fermeture</strong></p>
              <p><strong>Évacuation du bassin 30 minutes avant la fermeture</strong>. Les nageurs doivent sortir de l'eau à ce moment-là, même si l'accueil reste ouvert.</p>
              <p><strong>Horaires variables selon la période</strong>. Les horaires scolaires diffèrent des horaires de vacances. Consultez la fiche de chaque piscine pour le détail.</p>
            </div>
            <p className="text-muted text-xs">Astuce : arrivez au moins 1h avant la fermeture pour profiter pleinement de votre séance.</p>
          </div>
        </section>

        {/* Tarifs */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="tarifs" className="w-4 h-4 text-bleu-clair" />
            Tarifs municipaux
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            La majorité des piscines municipales appliquent la grille tarifaire de la Ville de Paris. Certains établissements (Pontoise, Berlioux, Pailleron, Le Gall -en été-) ont des tarifs propres. Consultez leur fiche.
          </p>
          <div className="bg-bleu-tres-pale rounded-xl p-4 text-sm flex flex-col gap-2">
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
            <div className="flex justify-between border-t border-border pt-2 mt-1">
              <span className="text-foreground">Pass 3 mois</span>
              <span className="font-semibold text-bleu-profond">43,00 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Pass 3 mois réduit</span>
              <span className="font-semibold text-bleu-profond">22,00 €</span>
            </div>
          </div>
          <p className="text-xs text-muted">
            Le tarif réduit s'applique aux enfants, personnes en situation de handicap, demandeurs d'emploi et bénéficiaires du RSA. Un justificatif est obligatoire.
          </p>
        </section>

        {/* Équipement requis */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="equipements" className="w-4 h-4 text-bleu-clair" />
            Équipement obligatoire
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Les piscines municipales parisiennes imposent des règles d'hygiène strictes sur la tenue de bain :
          </p>
          <div className="bg-bleu-tres-pale rounded-xl p-4 flex flex-col gap-2 text-sm">
            <p><strong>Bonnet de bain obligatoire</strong> pour tou·te·s les nageur·euse·s, sans exception, quel que soit la longueur ou le type de cheveux.</p>
            <p><strong>Maillot de bain ajusté obligatoire</strong>. Les shorts de bain, bermudas et vêtements de sport ne sont pas acceptés.</p>
            <p><strong>Chaussures de piscine recommandées</strong> pour se déplacer dans les zones mouillées.</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Si vous n'avez pas de bonnet, certaines piscines en vendent ou en louent à l'accueil. Des distributeurs d'équipements (bonnets, lunettes) sont disponibles dans certains établissements. Consultez la fiche de la piscine.
          </p>
        </section>

        {/* Rituels avant la baignade */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base">
            Avant de plonger
          </h3>
          <div className="flex flex-col gap-2 text-sm text-foreground leading-relaxed">
            <p>Le protocole d'entrée est le même dans toutes les piscines parisiennes :</p>
            <ol className="flex flex-col gap-1.5 list-decimal list-inside text-sm text-foreground">
              <li>Payer l'entrée à l'accueil et récupérer un bracelet ou une clé de casier.</li>
              <li>Se diriger vers les vestiaires, se changer et ranger ses affaires dans un casier.</li>
              <li>Passer par les <strong>pédiluve</strong> (bac d'eau) obligatoires avant d'accéder au bord du bassin.</li>
              <li>Se doucher avant d'entrer dans l'eau. Obligatoire pour des raisons d'hygiène.</li>
            </ol>
            <p className="text-muted text-xs mt-1">
              Les maîtres-nageurs sauveteurs (MNS) veillent au respect de ces règles et peuvent refuser l'accès au bassin en cas de non-conformité.
            </p>
          </div>
        </section>

        {/* Activités */}
        <section className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-bleu-profond text-base flex items-center gap-2">
            <Icon name="activites" className="w-4 h-4 text-bleu-clair" />
            Activités proposées
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            Au-delà de la natation libre, de nombreuses piscines proposent des cours et activités encadrés :
          </p>
          <div className="flex flex-wrap gap-2">
            {["Aquafitness", "Aquabiking", "Aquarunning", "Aquapalm", "Cours de natation", "Natation synchronisée", "Water-polo", "Brevet de natation"].map((a) => (
              <span
                key={a}
                className="text-xs bg-bleu-tres-pale text-bleu-moyen px-3 py-1.5 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Ces activités sont souvent réservées à certains créneaux et peuvent nécessiter une inscription préalable auprès de l'accueil de la piscine. Consultez la fiche de chaque établissement pour connaître les activités disponibles.
          </p>
        </section>

      </div>
    </div>
  )
}