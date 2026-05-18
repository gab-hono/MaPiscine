# 🏊 MaPiscine

Application web de centralisation et d'accessibilité des informations sur les piscines municipales parisiennes, avec une dimension inclusive forte.

> Projet de fin de formation — Titre RNCP niveau 6 · Concepteur·rice Développeur·euse d'Applications · Ada Tech School · 2025–2026

---

## À propos du projet

**MaPiscine** répond à un double constat : les informations sur les piscines municipales parisiennes sont dispersées et peu accessibles, et l'accueil des personnes trans et non binaires y est souvent insuffisamment documenté.

L'application poursuit trois objectifs :

1. **Centraliser** les informations pratiques de chaque piscine (horaires, tarifs, équipements, accessibilité, bassins et vestiaires).
2. **Inclure** via un filtre *Queer Friendly* identifiant les piscines ayant suivi une formation spécifique avec une association partenaire.
3. **Fiabiliser les données** en impliquant directement les agent·es des piscines dans la mise à jour de leur établissement via un rôle Admin dédié.

---

## Fonctionnalités

### Tous les profils (non authentifié·e)

* Liste et carte interactive des 42 piscines parisiennes (OpenStreetMap / Leaflet.js)
* Filtres multicritères : accessibilité PMR, label *Queer Friendly*, Passe Paris, statut ouvert/fermé, type de vestiaires, solarium…
* Fiches détaillées : infos pratiques, horaires, bassins, avis des utilisateurs
* Consultation des avis sans exposition des données des auteurs

### Utilisateur·ice authentifié·e

* Sauvegarde de piscines en favoris (ajout, consultation, suppression)
* Soumission d'avis notés par critère (accessibilité, accueil, bassin, vestiaires) avec commentaires optionnels
* Modification et suppression de ses propres avis
* Gestion du profil (nom, pronoms, image)
* Changement de mot de passe

### Administrateur·ice (agent·e de piscine)

* Tableau de bord dédié accessible après authentification
* Consultation du détail complet de sa piscine assignée et de tous les avis reçus
* Mise à jour des champs temps réel : `queer_friendly`, `acces_pmr`, `is_open`, `espace_solarium`
* Accès strictement limité à la piscine assignée

---

## 🛠 Stack technique

| Couche | Technologie |
| --- | --- |
| **Framework** | Next.js 16.2.1 (App Router) |
| **Langage** | TypeScript |
| **Base de données** | PostgreSQL · Neon (serverless) |
| **ORM** | Prisma 6.12.0 |
| **Authentification** | Better Auth v1.6.2 |
| **Styling** | Tailwind CSS v4 |
| **Carte** | Leaflet.js |
| **Déploiement** | Vercel · Neon · Cloudinary |

---

## Architecture

L'application suit une architecture **monolithique Next.js full-stack** avec App Router :

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js App Router)       │  ← Vercel
│  Pages · Composants · Appels fetch internes │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│           proxy.ts (Middleware Auth)        │
│  Vérifie le token Bearer → injecte          │
│  x-user-id et x-user-role dans les headers  │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│         Route Handlers (src/app/api/)       │
│  REST API · Logique métier · Guards HTTP    │
└─────────────────────┬───────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────┐
│        Base de données (PostgreSQL)         │  ← Neon
│  piscine · user · avis · favori             │
│  bassin · horaire_regulier · account        │
└─────────────────────────────────────────────┘
```

### Sécurité des routes

Le fichier `proxy.ts` intercepte toutes les requêtes vers `/api/favoris/*`, `/api/avis/*`, `/api/admin/*` et `/api/users/*`. Il vérifie le token Bearer via `/api/auth/verify` et injecte le `userId` et le `role` dans les headers de la requête avant de la transmettre au Route Handler.

Les routes admin vérifient en plus que le `piscineId` de la piscine demandée correspond à celui assigné au compte admin — un admin ne peut accéder qu'à son propre établissement.

---

## Endpoints API

### Publics (sans authentification)

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/piscines` | Liste paginée avec filtres optionnels |
| `GET` | `/api/piscines/:id` | Détail d'une piscine |
| `GET` | `/api/avis?piscineId=:id` | Avis d'une piscine (sans userId) |

### Authentifiés (token Bearer requis)

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/users/me` | Profil de l'utilisateur connecté |
| `PATCH` | `/api/users/me` | Mise à jour du profil |
| `PATCH` | `/api/users/me/password` | Changement de mot de passe |
| `POST` | `/api/favoris` | Ajouter un favori |
| `GET` | `/api/favoris` | Consulter ses favoris |
| `DELETE` | `/api/favoris/:id` | Supprimer un favori |
| `POST` | `/api/avis` | Créer un avis |
| `PATCH` | `/api/avis/:id` | Modifier son avis |
| `DELETE` | `/api/avis/:id` | Supprimer son avis |

### Admin (rôle ADMIN + piscine assignée requis)

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/admin/piscines/:id` | Détail complet avec tous les avis |
| `PATCH` | `/api/admin/piscines/:id` | Mise à jour des champs temps réel |

---

## 🚀 Installation et lancement

```bash
# Cloner le repo
git clone https://github.com/gab-hono/piscines-paris.git
cd piscines-paris

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Peupler la base de données
npm run seed

# Lancer le serveur de développement
npm run dev
```

---

## ☁️ Déploiement

| Service | Plateforme | Usage |
| --- | --- | --- |
| Application | [Vercel](https://vercel.com) | Déploiement automatique depuis `master` |
| Base de données | [Neon](https://neon.tech) | PostgreSQL serverless |
| Images | [Cloudinary](https://cloudinary.com) | Stockage et optimisation des photos |

---

*Projet développé dans le cadre du titre RNCP niveau 6, par GABRIEL HONO · Ada Tech School · 2025–2026*
