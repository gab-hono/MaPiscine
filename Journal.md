# Journal de développement — Piscines de Paris

> Ce journal retrace les avancées du projet semaine par semaine. Il constitue un outil de suivi personnel et un support de documentation pour le dossier RNCP.

---

## Phase 4 : Développement Technique

### DEVÉLOPPEMENT BACK-END (API/BDD)

#### Sous-Étape 1 : Fondations du back-end
**Période : 13 – 26 mars 2025**

---

##### 13 mars 2025

###### Initialisation du projet Next.js et configuration de l'environnement

Démarrage effectif du développement back-end. Le choix de Next.js (App Router) comme framework principal a été confirmé, ce qui implique l'abandon de l'approche initiale avec Express.js : Next.js intègre nativement un système de Route Handlers qui remplace avantageusement un serveur Express séparé, simplifiant l'architecture globale du projet et réduisant le nombre de services à déployer.

Le projet a été initialisé avec les options suivantes :

- TypeScript activé
- Tailwind CSS activé
- App Router activé
- Répertoire `src/` activé
- ESLint activé

Un dépôt GitHub a été créé et le premier commit a été effectué dès l'initialisation du projet.

###### Installation et configuration de Prisma

Prisma a été choisi comme ORM pour la gestion de la base de données PostgreSQL. L'installation a nécessité plusieurs ajustements liés aux changements de comportement introduits dans les versions récentes de Prisma :

- Installation de `prisma` et `@prisma/client`
- Installation de `dotenv` pour la gestion des variables d'environnement
- Création de la base de données sur **Neon** (PostgreSQL serverless), avec récupération de la `DATABASE_URL`
- Création du fichier `.env` avec la chaîne de connexion Neon
- Initialisation de Prisma via `npx prisma init`
- Rédaction d'une première version du `schema.prisma` à partir du modèle de données élaboré lors de la phase de conception (MCD/MLD)

**Difficultés rencontrées :** Les versions récentes de Prisma (7.x) introduisent des changements incompatibles avec le comportement attendu de `PrismaClient`. Après plusieurs tentatives infructueuses, la version **Prisma 6.12.0** a été retenue comme version stable, compatible avec Next.js et Neon sans configuration d'adaptateur supplémentaire.

---

##### 20 mars 2025

###### Singleton PrismaClient

Mise en place du pattern singleton pour `PrismaClient` dans `src/lib/prisma.ts`. Ce pattern est indispensable dans un environnement Next.js en développement : le rechargement à chaud du serveur (`hot reload`) crée de nouvelles instances à chaque modification de fichier, ce qui peut épuiser rapidement le nombre de connexions autorisées par Neon. Le singleton stocke l'instance dans `globalThis` pour la réutiliser entre les rechargements.

###### Refonte du modèle de données

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

###### Migration du schéma final

Exécution de la migration `npx prisma migrate dev --name refactor_schema_complet`, qui a créé l'ensemble des tables dans la base de données Neon. Vérification des tables dans Prisma Studio.

---

##### 21 mars 2025

###### Écriture du fichier de seed

Rédaction du fichier `prisma/seed.ts` avec les données réelles de cinq piscines parisiennes :

- Piscine Suzanne Berlioux (1er)
- Piscine Marie-Marvingt (4e)
- Piscine Jean Taris (5e)
- Espace Sportif Pontoise (5e)
- Piscine Saint-Germain (6e)

Chaque entrée inclut les données complètes : coordonnées géographiques, informations de contact, tarifs, bassins avec leurs caractéristiques techniques, horaires par période (scolaire et vacances), et équipements sur place.

**Difficultés rencontrées :** L'exécution du seed a nécessité plusieurs ajustements liés à la configuration de Prisma. Le problème principal venait du fait que `PrismaClient` ne parvenait pas à lire la `DATABASE_URL` depuis le fichier `.env` lorsqu'il était instancié dans un script externe (hors contexte Next.js). La solution retenue a consisté à supprimer le fichier `prisma.config.ts` — qui introduisait des conflits — et à laisser Prisma 6 lire directement la variable d'environnement depuis `.env`.

---

##### 25 – 26 mars 2025

###### Création des premiers Route Handlers

Mise en place des deux premiers endpoints de l'API :

**`GET /api/piscines`** — Retourne la liste complète des piscines avec leurs bassins et horaires réguliers. Implémenté dans `src/app/api/piscines/route.ts`.

**`GET /api/piscines/[id]`** — Retourne le détail d'une piscine par son identifiant, incluant bassins, horaires réguliers et exceptions. Gestion des cas d'erreur : identifiant non numérique (400), piscine introuvable (404). Implémenté dans `src/app/api/piscines/[id]/route.ts`.

Les deux endpoints ont été testés avec Postman et documentés dans la collection dédiée au projet.

---

*Prochaine étape : Sous-Étape 2 - Authentification avec NextAuth.js*


### 📅 12/04/2026
**Sprint:** S2 : Authentification  
**État d'avancement:** 🟢 Fluide

---

**✅ Réalisé aujourd'hui :**

**1. Tentative d'installation de NextAuth v5 beta**
Installation de `next-auth@beta` (v5.0.0-beta.30). Lors de la génération du secret avec `npx auth secret`, le CLI a installé automatiquement `Better Auth` au lieu de NextAuth, affichant `BETTER_AUTH_SECRET` dans le `.env`. Cela a révélé que **NextAuth.js fait désormais partie de Better Auth**, son successeur direct.

**2. Décision technique : migration vers Better Auth**
Après analyse, la décision a été prise d'abandonner NextAuth v5 beta au profit de **Better Auth v1.6.2** pour les raisons suivantes :
- Better Auth est une version stable (pas en beta)
- API plus moderne, conçue nativement pour le App Router de Next.js
- Intégration Prisma native sans adapter séparé
- Le CLI officiel de NextAuth pointe désormais vers Better Auth, ce qui confirme la direction du projet

Désinstallation de NextAuth : `npm uninstall next-auth`  
Installation de Better Auth : `npm install better-auth`

**3. Installation de bcryptjs**
```bash
npm install bcryptjs && npm install -D @types/bcryptjs
```
`bcryptjs` est une librairie de hashage de mots de passe. Elle permet de transformer un mot de passe en clair en une chaîne cryptée impossible à déchiffrer, ce qui garantit qu'aucun mot de passe n'est stocké en clair dans la base de données. `@types/bcryptjs` ajoute les définitions TypeScript nécessaires.

**4. Génération du AUTH_SECRET**
Le secret d'authentification a été généré manuellement avec Node.js :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Ce secret est une clé cryptographique utilisée pour signer et vérifier les tokens de session. Il a été ajouté manuellement au fichier `.env` sous la clé `AUTH_SECRET`.

**5. Création de `src/lib/auth.ts`**
Ce fichier est le **point de configuration central de Better Auth**. Il initialise le système d'authentification en connectant Better Auth à la base de données via l'adapter Prisma, en activant l'authentification par email/password, et en déclarant les champs personnalisés du modèle `user` propres au projet (`role`, `pronoms`). Toute la logique d'auth de l'application passe par ce fichier.

**6. Création de `src/app/api/auth/[...all]/route.ts`**
Ce fichier est le **Route Handler universel de Better Auth**. Il expose automatiquement toutes les routes d'authentification nécessaires (`/api/auth/sign-up/email`, `/api/auth/sign-in/email`, `/api/auth/sign-out`, etc.) sans qu'il soit nécessaire de les créer manuellement. Le nom du dossier `[...all]` est une convention de Next.js App Router qui capture tous les sous-chemins.

**7. Modification du schema Prisma pour Better Auth**
Better Auth nécessite des modèles spécifiques dans la base de données. Le schema a été restructuré avec les changements suivants :
- `Utilisateur` → remplacé par `user` (convention Better Auth, en minuscule)
- `id` de `user`, `Favori` et `Avis` : type `Int` → `String` (Better Auth utilise des IDs string générés automatiquement)
- Ajout des modèles requis par Better Auth : `session`, `account`, `verification`
- Champs `utilisateurId` dans `Favori` et `Avis` → renommés en `userId`
- Les champs personnalisés (`role`, `pronoms`) sont conservés dans le modèle `user` via `additionalFields`

**8. Migration de la base de données**
```bash
npx prisma migrate dev --name add-better-auth
```
Migration appliquée avec succès. Les nouvelles tables ont été créées dans Neon et le client Prisma a été régénéré.

**9. Création de `src/app/api/auth/register/route.ts`**
Endpoint personnalisé `POST /api/auth/register` pour l'inscription des utilisateurs. Bien que Better Auth expose déjà `/api/auth/sign-up/email`, cet endpoint intermédiaire a été créé pour :
- Valider les champs obligatoires avant d'appeler Better Auth (`name`, `email`, `password`)
- Valider le format de l'email et la longueur minimale du mot de passe (8 caractères)
- Vérifier l'unicité de l'email avec un message d'erreur clair (`409 Conflict`)
- Enregistrer les champs personnalisés comme `pronoms`
- Retourner un `201 Created` avec les données de l'utilisateur sans le mot de passe

**10. Tests Postman — Inscription**

| Scénario | Status | Résultat |
|---|---|---|
| Inscription valide | `201` | Utilisateur créé avec `id`, `name`, `email`, `role`, `pronoms` |
| Email déjà utilisé | `409` | `{"error":"Cet email est déjà utilisé"}` |
| Champs manquants | `400` | `{"error":"Nom, email et mot de passe sont obligatoires"}` |
| Mot de passe trop court | `400` | `{"error":"Le mot de passe doit contenir au moins 8 caractères"}` |

**11. Tests Postman — Connexion**
Route utilisée : `POST /api/auth/sign-in/email`  
Headers requis : `Content-Type: application/json`, `Origin: http://localhost:3000`

| Scénario | Status | Résultat |
|---|---|---|
| Connexion valide | `200` | Token de session + données utilisateur |
| Mot de passe incorrect | `401` | `{"code":"INVALID_EMAIL_OR_PASSWORD"}` |
| Utilisateur inexistant | `401` | `{"code":"INVALID_EMAIL_OR_PASSWORD"}` |

Note : Better Auth retourne le même message pour les deux cas d'erreur, ce qui est une bonne pratique de sécurité — on ne révèle pas si l'email existe ou non.

**12. Création du système de protection des routes**

*Problème rencontré :* La première approche utilisait `middleware.ts` à la racine du projet. Deux problèmes ont été identifiés :
- Next.js 16 déprécie `middleware.ts` au profit de `proxy.ts`
- Le middleware s'exécute dans l'**Edge Runtime**, un environnement léger qui ne supporte pas Prisma

*Solution adoptée :*
- Création d'un endpoint interne `src/app/api/auth/verify/route.ts` qui vérifie le token en base de données via Prisma
- Création de `proxy.ts` à la racine qui appelle cet endpoint pour valider chaque requête entrante

`proxy.ts` intercepte toutes les requêtes vers `/api/favoris/*`, `/api/avis/*` et `/api/admin/*`. Si le token est valide, il transmet le `userId` et le `role` de l'utilisateur aux Route Handlers via des headers personnalisés (`x-user-id`, `x-user-role`). Les routes `/api/auth/*` restent publiques.

**13. Création de `src/lib/checkRole.ts`**
Helper utilisé à l'intérieur des Route Handlers protégés pour vérifier le rôle de l'utilisateur. Il lit le header `x-user-role` injecté par le proxy et retourne une réponse `403 Forbidden` si le rôle est insuffisant. Utilisé principalement pour les routes `/api/admin/*` qui nécessitent le rôle `ADMIN`.

**14. Tests Postman — Protection des routes**

| Scénario | Status | Résultat |
|---|---|---|
| GET `/api/favoris` sans token | `401` | `{"error":"Authentication requise"}` |
| GET `/api/favoris` avec token valide | `404` | Route non encore créée, proxy validé ✅ |
| GET `/api/admin/piscines` sans token | `401` | `{"error":"Authentication requise"}` |
| GET `/api/admin/piscines` token ADMIN | `404` | Route non encore créée, proxy validé ✅ |
| GET `/api/admin/piscines` token USER | `404` | Vérification du rôle déléguée au Route Handler via `checkRole` |

---

**🧱 Difficultés rencontrées :**
- **NextAuth → Better Auth** : la tentative initiale avec NextAuth v5 beta a mené à une migration complète vers Better Auth. Décision documentée et justifiée dans les choix techniques.
- **Edge Runtime + Prisma** : le proxy ne peut pas utiliser Prisma directement. Résolu avec un endpoint de vérification intermédiaire.
- **Next.js 16** : dépréciation de `middleware.ts` au profit de `proxy.ts`, découverte en cours de développement.

---

**➡️ Prochaine étape :**
Étape 3 — Routes API complètes : implémentation des endpoints `GET /api/piscines` avec filtres, `POST/DELETE /api/favoris`, `POST /api/avis`, et routes admin protégées.

---

**📝 Pour le dossier RNCP :**
- Justifier le choix de Better Auth vs NextAuth dans la section *Choix techniques* : stabilité, compatibilité App Router, successor officiel
- Documenter l'architecture d'authentification : flux register → login → token → proxy → Route Handler
- Mentionner la contrainte Edge Runtime comme exemple de problème technique résolu

---

##### 18 avril 2026

###### Pause de conception — Remodélisation de la base de données (théorie)

Avant de continuer le développement, une pause de conception a été décidée pour corriger les divergences entre le modèle documenté dans le dossier RNCP et le schéma Prisma réellement implémenté. Cette révision s'appuie sur une analyse des pages officielles des 42 piscines municipales parisiennes (paris.fr).

**Décisions de remodélisation :**

- **Horaires** : séparation confirmée en deux entités distinctes — `HoraireRegulier` (créneaux récurrents par période SCOLAIRE/VACANCES) et `HoraireException` (fermetures ou horaires ponctuels). Cette séparation permet à l'interface Admin d'afficher automatiquement les horaires corrects selon la date consultée.
- **Liaison Admin ↔ Piscine** : ajout d'un champ `piscineId Int?` sur le modèle `user`. NULL si role=USER, obligatoire si role=ADMIN. Un compte Admin ne gère qu'une seule piscine (cardinalité 0,1 — 0,1).
- **Bassin simplifié** : suppression des champs trop techniques (`revetement`, `traitement_eau`, `temperature`, `lumiere`). Maintien de `nom`, `longueur`, `largeur`, `profondeur_min`, `profondeur_max`, `nb_couloirs`.
- **Vestiaires granulaires** : décomposition en 5 champs booléens distincts (`vestiaires_mixtes`, `cabines_individuelles`, `douches_individuelles`, `douches_collectives`, `cabine_pmr`) pour permettre des filtres de recherche précis, notamment utiles aux personnes queer, trans et non binaires.
- **Équipements épurés** : suppression des champs peu pertinents (`toilettes`, `wifi`, `table_a_langer`, `defibrillateur`, `admission_animaux`, `douche_pmr`, `douches_collectives_mixtes`).
- **Champs Avis optionnels** : les notes et commentaires passent en `Int?` / `String?` — au moins un critère doit être renseigné, validé côté serveur.
- **Tarifs sur PISCINE** : grille tarifaire standardisée stockée directement sur la table `piscines` — suffisant pour la réalité municipale parisienne.

La section « Synthèse de la modélisation des données » du dossier RNCP a été entièrement réécrite pour refléter ce modèle révisé, incluant les 7 entités MERISE, les 7 relations avec cardinalités, les tables MLD complètes et une note technique de correspondance MERISE ↔ Prisma.

---

###### Implémentation — Migration et seed complet

**Mise à jour du schéma Prisma**

Le fichier `prisma/schema.prisma` a été mis à jour pour refléter le modèle révisé :

- Ajout de `piscineId Int?` sur `user` avec relation nommée `"AdminPiscine"`
- Suppression des champs obsolètes sur `Piscine` : `douche_pmr`, `douches_collectives_mixtes`, `toilettes`, `wifi`, `table_a_langer`, `defibrillateur`, `admission_animaux`
- Ajout des nouveaux champs vestiaires : `vestiaires_mixtes`, `cabines_individuelles`, `douches_individuelles`, `douches_collectives`, `cabine_pmr`
- Suppression des champs techniques sur `Bassin` : `revetement`, `traitement_eau`, `temperature`, `lumiere`
- Champs `Avis` rendus optionnels (`Int?` / `String?`)

**Migration**

```bash
npx prisma migrate dev --name remodel_schema_complet
npx prisma generate
```

Migration appliquée avec succès sur la base Neon.

**Réécriture complète du seed**

Le fichier `prisma/seed.ts` a été entièrement réécrit pour inclure les 42 piscines municipales parisiennes. Structure :

- `deleteMany()` en cascade au début (ordre respectant les FK) pour garantir l'idempotence
- 5 piscines avec données complètes et horaires précis (Berlioux, Marie-Marvingt, Jean Taris, Pontoise, Saint-Germain)
- Helper `horairesMunicipaux()` typé avec `PeriodeHoraire` pour les 37 piscines restantes
- Piscines avec horaires spécifiques (Catherine Lagatu, Roger Le Gall) avec leurs propres créneaux

```bash
npx tsx prisma/seed.ts
```

Seed exécuté avec succès. Vérification dans Prisma Studio : 42 piscines créées, bassins et horaires correctement rattachés.

**Difficultés rencontrées :**
- **Connexion Neon échouée** (`P1001` puis `P1000`) — URL `DATABASE_URL` mal formée dans `.env`. Résolu en récupérant la connection string complète depuis le dashboard Neon.
- **Erreur TypeScript `PeriodeHoraire`** — le helper `horairesMunicipaux` retournait des objets dont `periode` était inféré comme `string`. Résolu en important `PeriodeHoraire` depuis `@prisma/client`, en créant un type local `HoraireInput`, et en typant explicitement les arrays d'horaires.

---

*Prochaine étape : Étape 3 — Routes API complètes*