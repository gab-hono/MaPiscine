/*
  Warnings:

  - The primary key for the `Avis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `utilisateurId` on the `Avis` table. All the data in the column will be lost.
  - The primary key for the `Favori` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `utilisateurId` on the `Favori` table. All the data in the column will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,piscineId]` on the table `Avis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,piscineId]` on the table `Favori` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Avis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Favori` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Avis" DROP CONSTRAINT "Avis_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "Favori" DROP CONSTRAINT "Favori_utilisateurId_fkey";

-- DropIndex
DROP INDEX "Avis_utilisateurId_piscineId_key";

-- DropIndex
DROP INDEX "Favori_utilisateurId_piscineId_key";

-- AlterTable
ALTER TABLE "Avis" DROP CONSTRAINT "Avis_pkey",
DROP COLUMN "utilisateurId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Avis_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Avis_id_seq";

-- AlterTable
ALTER TABLE "Favori" DROP CONSTRAINT "Favori_pkey",
DROP COLUMN "utilisateurId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Favori_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Favori_id_seq";

-- DropTable
DROP TABLE "Utilisateur";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mot_de_passe" TEXT,
    "pronoms" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Avis_userId_piscineId_key" ON "Avis"("userId", "piscineId");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_userId_piscineId_key" ON "Favori"("userId", "piscineId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
