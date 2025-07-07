/*
  Warnings:

  - A unique constraint covering the columns `[libelle]` on the table `marque` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `marque_libelle_key` ON `marque`(`libelle`);
