/*
  Warnings:

  - A unique constraint covering the columns `[propriete]` on the table `parametre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `parametre_propriete_key` ON `parametre`(`propriete`);
