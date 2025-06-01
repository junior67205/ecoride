/*
  Warnings:

  - You are about to alter the column `photo` on the `utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `utilisateur` MODIFY `photo` VARCHAR(255) NULL;
