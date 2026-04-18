/*
  Warnings:

  - You are about to drop the column `lumiere` on the `Bassin` table. All the data in the column will be lost.
  - You are about to drop the column `revetement` on the `Bassin` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `Bassin` table. All the data in the column will be lost.
  - You are about to drop the column `traitement_eau` on the `Bassin` table. All the data in the column will be lost.
  - You are about to drop the column `admission_animaux` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `defibrillateur` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `douche_pmr` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `douches_collectives_mixtes` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `parking_velos` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `table_a_langer` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `toilettes` on the `Piscine` table. All the data in the column will be lost.
  - You are about to drop the column `wifi` on the `Piscine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Avis" ALTER COLUMN "note_accessibilite" DROP NOT NULL,
ALTER COLUMN "commentaire_accessibilite" DROP NOT NULL,
ALTER COLUMN "note_accueil" DROP NOT NULL,
ALTER COLUMN "commentaire_accueil" DROP NOT NULL,
ALTER COLUMN "note_bassin" DROP NOT NULL,
ALTER COLUMN "commentaire_bassin" DROP NOT NULL,
ALTER COLUMN "note_vestiaires" DROP NOT NULL,
ALTER COLUMN "commentaire_vestiaires" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bassin" DROP COLUMN "lumiere",
DROP COLUMN "revetement",
DROP COLUMN "temperature",
DROP COLUMN "traitement_eau";

-- AlterTable
ALTER TABLE "Piscine" DROP COLUMN "admission_animaux",
DROP COLUMN "defibrillateur",
DROP COLUMN "douche_pmr",
DROP COLUMN "douches_collectives_mixtes",
DROP COLUMN "parking_velos",
DROP COLUMN "table_a_langer",
DROP COLUMN "toilettes",
DROP COLUMN "wifi",
ADD COLUMN     "cabines_individuelles" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "douches_collectives" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "piscineId" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_piscineId_fkey" FOREIGN KEY ("piscineId") REFERENCES "Piscine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
