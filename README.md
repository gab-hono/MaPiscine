# 🏊 Piscines de Paris

Application web de centralisation et d'accessibilité des informations sur les piscines municipales parisiennes, avec une dimension inclusive forte.

> Projet de fin de formation — Titre RNCP niveau 6 · Développeur·euse web full stack · Ada Tech School

---

## 📋 Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)

---

## 🌊 À propos du projet

**Piscines de Paris** répond à un double constat : les informations sur les piscines municipales parisiennes sont dispersées et peu accessibles, et l'accueil des personnes trans et non binaires y est souvent insuffisamment adapté.

L'application poursuit trois objectifs :

1. **Centraliser** les informations pratiques de chaque piscine (horaires, tarifs, équipements, accessibilité, état des bassins et vestiaires).
2. **Inclure** via un filtre *Queer Friendly* identifiant les piscines ayant suivi une formation spécifique avec une association partenaire.
3. **Fiabiliser les données** en impliquant directement les agent·es des piscines dans la mise à jour de leur établissement via un rôle Admin dédié.

---

## ✨ Fonctionnalités

### Tous les profils (non authentifié·e)
- Liste et carte interactive des piscines parisiennes (OpenStreetMap / Leaflet.js)
- Recherche textuelle et filtres multicritères : accessibilité PMR, label *Queer Friendly*, statut ouvert/fermé, type de bassin…
- Fiches détaillées : infos pratiques, galerie d'images, notes moyennes par critère
- Guide pédagogique pour les personnes débutantes (tarifs, équipement, règles d'usage)
- Page *À propos*

### Utilisateur·ice authentifié·e
- Sauvegarde de piscines en favoris
- Soumission d'avis notés par critère (accessibilité, accueil, état du bassin, état des vestiaires)
- Consultation et suppression de ses propres avis
- Gestion du profil (nom d'utilisateur, pronoms, email, mot de passe)

### Administrateur·ice (agent·e de piscine)
- Tableau de bord dédié accessible après authentification
- Mise à jour des informations de sa piscine (horaires, tarifs, équipements, label *Queer Friendly*…)
- Suivi de la date de dernière mise à jour
- Consultation des avis laissés par les utilisateur·ices

---

## 🛠 Stack technique

| Couche | Technologie |
|---|---|
| **Frontend** | Next.js (App Router) · Tailwind CSS · Leaflet.js |
| **Backend** | Prisma ORM · JWT · bcrypt |
| **Base de données** | PostgreSQL (Neon en production) |
| **Déploiement** | Vercel (frontend) · Railway (backend) · Neon (BDD) · Cloudinary (images) |

---

## 🏗 Architecture

L'application suit une architecture **MVC monolithique client-serveur à trois couches** :

```
┌─────────────────────────────────────────────┐
│              Frontend (Next.js)             │  ← Vercel
│  Pages · Composants · Appels API fetch      │
└─────────────────────┬───────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────┐
│              Backend (Express.js)           │  ← Railway
│  Routes · Contrôleurs · Middleware Auth     │
│  Middleware Admin (rôle + id_piscine)       │
└─────────────────────┬───────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────┐
│           Base de données (PostgreSQL)      │  ← Neon
│  Tables : piscines · users · avis           │
│           favoris · horaires · équipements  │
└─────────────────────────────────────────────┘
```

### Sécurité des routes Admin

Chaque compte Admin est lié à un `id_piscine` unique. Un middleware côté serveur vérifie à la fois le **rôle** et l'**id_piscine** avant toute modification, garantissant qu'un Admin ne peut mettre à jour que son propre établissement.

---

## 📁 Structure du projet

```
piscines-de-paris/
├── frontend/                  # Application Next.js
│   ├── app/                   # App Router (pages et layouts)
│   ├── components/            # Composants réutilisables
│   ├── lib/                   # Utilitaires et appels API
│   └── public/                # Assets statiques
│
├── backend/                   # Serveur Express.js
│   ├── prisma/
│   │   ├── schema.prisma      # Schéma de la base de données
│   │   └── migrations/        # Historique des migrations
│   ├── src/
│   │   ├── controllers/       # Logique métier
│   │   ├── routes/            # Définition des endpoints
│   │   ├── middlewares/       # Auth, Admin, gestion d'erreurs
│   │   └── index.js           # Point d'entrée Express
│   └── .env
│
└── README.md
```

---

## ☁️ Déploiement

| Service | Plateforme | Usage |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Déploiement automatique depuis `main` |
| Backend | [Railway](https://railway.app) | Serveur Node.js / Express |
| Base de données | [Neon](https://neon.tech) | PostgreSQL serverless |
| Images | [Cloudinary](https://cloudinary.com) | Stockage et optimisation des photos |

---

*Projet développé dans le cadre du titre RNCP niveau 6 · Ada Tech School · 2025–2026*
