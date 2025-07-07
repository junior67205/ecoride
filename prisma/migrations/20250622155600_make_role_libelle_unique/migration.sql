/*
  Warnings:

  - A unique constraint covering the columns `[libelle]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `role_libelle_key` ON `role`(`libelle`);
