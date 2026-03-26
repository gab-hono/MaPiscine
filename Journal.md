# Journal de développement — Piscines de Paris

> Ce journal retrace les avancées du projet semaine par semaine. Il constitue un outil de suivi personnel et un support de documentation pour le dossier RNCP.

---

## Phase 2 — Développement du back-end

### Étape 1 — Fondations du back-end
**Période : 13 – 26 mars 2025**

---

#### 13 mars 2025

##### Initialisation du projet Next.js et configuration de l'environnement

Démarrage effectif du développement back-end. Le choix de Next.js (App Router) comme framework principal a été confirmé, ce qui implique l'abandon de l'approche initiale avec Express.js : Next.js intègre nativement un système de Route Handlers qui remplace avantageusement un serveur Express séparé, simplifiant l'architecture globale du projet et réduisant le nombre de services à déployer.

Le projet a été initialisé avec les options suivantes :

- TypeScript activé
- Tailwind CSS activé
- App Router activé
- Répertoire `src/` activé
- ESLint activé

Un dépôt GitHub a été créé et le premier commit a été effectué dès l'initialisation du projet.

##### Installation et configuration de Prisma

Prisma a été choisi comme ORM pour la gestion de la base de données PostgreSQL. L'installation a nécessité plusieurs ajustements liés aux changements de comportement introduits dans les versions récentes de Prisma :

- Installation de `prisma` et `@prisma/client`
- Installation de `dotenv` pour la gestion des variables d'environnement
- Création de la base de données sur **Neon** (PostgreSQL serverless), avec récupération de la `DATABASE_URL`
- Création du fichier `.env` avec la chaîne de connexion Neon
- Initialisation de Prisma via `npx prisma init`
- Rédaction d'une première version du `schema.prisma` à partir du modèle de données élaboré lors de la phase de conception (MCD/MLD)

**Difficultés rencontrées :** Les versions récentes de Prisma (7.x) introduisent des changements incompatibles avec le comportement attendu de `PrismaClient`. Après plusieurs tentatives infructueuses, la version **Prisma 6.12.0** a été retenue comme version stable, compatible avec Next.js et Neon sans configuration d'adaptateur supplémentaire.

---

#### 20 mars 2025

##### Singleton PrismaClient

Mise en place du pattern singleton pour `PrismaClient` dans `src/lib/prisma.ts`. Ce pattern est indispensable dans un environnement Next.js en développement : le rechargement à chaud du serveur (`hot reload`) crée de nouvelles instances à chaque modification de fichier, ce qui peut épuiser rapidement le nombre de connexions autorisées par Neon. Le singleton stocke l'instance dans `globalThis` pour la réutiliser entre les rechargements.

##### Refonte du modèle de données

L'analyse des données réelles de cinq piscines parisiennes a révélé que le schéma initial était insuffisant. Un travail de recherche sur les pages officielles des piscines municipales de Paris a permis d'identifier les données manquantes et de revoir l'architecture de la base de données.

Les modifications suivantes ont été apportées au `schema.prisma` :

- Ajout des champs `arrondissement`, `latitude`, `longitude` sur le modèle `Piscine`
- Ajout des informations de contact : `telephone`, `email`, `site_web`
- Ajout du champ `espace_solarium`
- Ajout du champ `accepte_passe_paris` (booléen indiquant l'éligibilité au pass trimestriel municipal)
- Ajout des champs de tarification : `prix_entree_normal`, `prix_entree_reduit`, `prix_carnet_normal`, `prix_carnet_reduit`, `prix_abonnement_normal`, `prix_abonnement_reduit`, `prix_brevet_natation`
- Ajout de l'ensemble des équipements sur place sous forme de champs booléens : `seche_cheveux`, `distributeur_equipements`, `douche_pmr`, `douches_collectives_mixtes`, `douches_individuelles`, `vestiaires_mixtes`, `casiers`, `cabine_pmr`, `parking_velos`, `toilettes`, `wifi`, `table_a_langer`, `distributeur_boisson`, `defibrillateur`, `admission_animaux`
- Enrichissement du modèle `Bassin` : ajout de `nom`, `largeur`, `profondeur_min`, `profondeur_max`, `nb_couloirs`, `revetement`, `traitement_eau`, `temperature`, `lumiere`
- Refonte du modèle `Horaire` : remplacement du modèle unique par deux modèles distincts — `HoraireRegulier` et `HoraireException` — afin de gérer les horaires variables (période scolaire / vacances scolaires) et les fermetures exceptionnelles
- Ajout d'un enum `PeriodeHoraire` (`SCOLAIRE` / `VACANCES`) sur `HoraireRegulier`
- Ajout du champ `activites` en tant que tableau de chaînes de caractères (`String[]`) directement sur `Piscine`

##### Migration du schéma final

Exécution de la migration `npx prisma migrate dev --name refactor_schema_complet`, qui a créé l'ensemble des tables dans la base de données Neon. Vérification des tables dans Prisma Studio.

---

#### 21 mars 2025

##### Écriture du fichier de seed

Rédaction du fichier `prisma/seed.ts` avec les données réelles de cinq piscines parisiennes :

- Piscine Suzanne Berlioux (1er)
- Piscine Marie-Marvingt (4e)
- Piscine Jean Taris (5e)
- Espace Sportif Pontoise (5e)
- Piscine Saint-Germain (6e)

Chaque entrée inclut les données complètes : coordonnées géographiques, informations de contact, tarifs, bassins avec leurs caractéristiques techniques, horaires par période (scolaire et vacances), et équipements sur place.

**Difficultés rencontrées :** L'exécution du seed a nécessité plusieurs ajustements liés à la configuration de Prisma. Le problème principal venait du fait que `PrismaClient` ne parvenait pas à lire la `DATABASE_URL` depuis le fichier `.env` lorsqu'il était instancié dans un script externe (hors contexte Next.js). La solution retenue a consisté à supprimer le fichier `prisma.config.ts` — qui introduisait des conflits — et à laisser Prisma 6 lire directement la variable d'environnement depuis `.env`.

---

#### 25 – 26 mars 2025

##### Création des premiers Route Handlers

Mise en place des deux premiers endpoints de l'API :

**`GET /api/piscines`** — Retourne la liste complète des piscines avec leurs bassins et horaires réguliers. Implémenté dans `src/app/api/piscines/route.ts`.

**`GET /api/piscines/[id]`** — Retourne le détail d'une piscine par son identifiant, incluant bassins, horaires réguliers et exceptions. Gestion des cas d'erreur : identifiant non numérique (400), piscine introuvable (404). Implémenté dans `src/app/api/piscines/[id]/route.ts`.

Les deux endpoints ont été testés avec Postman et documentés dans la collection dédiée au projet.

---

*Prochaine étape : Étape 2 - Authentification avec NextAuth.js*