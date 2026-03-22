-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PeriodeHoraire" AS ENUM ('SCOLAIRE', 'VACANCES');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom_prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "pronoms" TEXT,
    "photo" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Piscine" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "arrondissement" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "site_web" TEXT,
    "acces_pmr" BOOLEAN NOT NULL DEFAULT false,
    "queer_friendly" BOOLEAN NOT NULL DEFAULT false,
    "accepte_passe_paris" BOOLEAN NOT NULL DEFAULT true,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "espace_solarium" BOOLEAN NOT NULL DEFAULT false,
    "activites" TEXT[],
    "images_galerie" TEXT[],
    "prix_entree_normal" DOUBLE PRECISION,
    "prix_entree_reduit" DOUBLE PRECISION,
    "prix_carnet_normal" DOUBLE PRECISION,
    "prix_carnet_reduit" DOUBLE PRECISION,
    "prix_abonnement_normal" DOUBLE PRECISION,
    "prix_abonnement_reduit" DOUBLE PRECISION,
    "prix_brevet_natation" DOUBLE PRECISION,
    "seche_cheveux" BOOLEAN NOT NULL DEFAULT false,
    "distributeur_equipements" BOOLEAN NOT NULL DEFAULT false,
    "douche_pmr" BOOLEAN NOT NULL DEFAULT false,
    "douches_collectives_mixtes" BOOLEAN NOT NULL DEFAULT false,
    "douches_individuelles" BOOLEAN NOT NULL DEFAULT false,
    "vestiaires_mixtes" BOOLEAN NOT NULL DEFAULT false,
    "casiers" BOOLEAN NOT NULL DEFAULT false,
    "cabine_pmr" BOOLEAN NOT NULL DEFAULT false,
    "parking_velos" BOOLEAN NOT NULL DEFAULT false,
    "toilettes" BOOLEAN NOT NULL DEFAULT true,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "table_a_langer" BOOLEAN NOT NULL DEFAULT false,
    "distributeur_boisson" BOOLEAN NOT NULL DEFAULT false,
    "defibrillateur" BOOLEAN NOT NULL DEFAULT false,
    "admission_animaux" BOOLEAN NOT NULL DEFAULT false,
    "last_updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Piscine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bassin" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "longueur" DOUBLE PRECISION,
    "largeur" DOUBLE PRECISION,
    "profondeur_min" DOUBLE PRECISION,
    "profondeur_max" DOUBLE PRECISION,
    "nb_couloirs" INTEGER,
    "revetement" TEXT,
    "traitement_eau" TEXT,
    "temperature" DOUBLE PRECISION,
    "lumiere" TEXT,
    "piscineId" INTEGER NOT NULL,

    CONSTRAINT "Bassin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoraireRegulier" (
    "id" SERIAL NOT NULL,
    "periode" "PeriodeHoraire" NOT NULL,
    "jour" TEXT NOT NULL,
    "heure_ouverture" TEXT NOT NULL,
    "heure_fermeture" TEXT NOT NULL,
    "ferme" BOOLEAN NOT NULL DEFAULT false,
    "piscineId" INTEGER NOT NULL,

    CONSTRAINT "HoraireRegulier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoraireException" (
    "id" SERIAL NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "heure_ouverture" TEXT,
    "heure_fermeture" TEXT,
    "ferme" BOOLEAN NOT NULL DEFAULT false,
    "motif" TEXT,
    "piscineId" INTEGER NOT NULL,

    CONSTRAINT "HoraireException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favori" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "piscineId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "note_accessibilite" INTEGER NOT NULL,
    "commentaire_accessibilite" TEXT NOT NULL,
    "note_accueil" INTEGER NOT NULL,
    "commentaire_accueil" TEXT NOT NULL,
    "note_bassin" INTEGER NOT NULL,
    "commentaire_bassin" TEXT NOT NULL,
    "note_vestiaires" INTEGER NOT NULL,
    "commentaire_vestiaires" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" INTEGER NOT NULL,
    "piscineId" INTEGER NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_utilisateurId_piscineId_key" ON "Favori"("utilisateurId", "piscineId");

-- CreateIndex
CREATE UNIQUE INDEX "Avis_utilisateurId_piscineId_key" ON "Avis"("utilisateurId", "piscineId");

-- AddForeignKey
ALTER TABLE "Bassin" ADD CONSTRAINT "Bassin_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoraireRegulier" ADD CONSTRAINT "HoraireRegulier_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoraireException" ADD CONSTRAINT "HoraireException_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
