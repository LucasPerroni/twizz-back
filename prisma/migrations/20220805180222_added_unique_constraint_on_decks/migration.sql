/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `decks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "decks_name_userId_key" ON "decks"("name", "userId");
