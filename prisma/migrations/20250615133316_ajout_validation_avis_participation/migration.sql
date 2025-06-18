-- AlterTable
ALTER TABLE `participation` ADD COLUMN `avis` VARCHAR(191) NULL,
    ADD COLUMN `commentaire` VARCHAR(191) NULL,
    ADD COLUMN `note` INTEGER NULL,
    ADD COLUMN `validation` BOOLEAN NULL;
