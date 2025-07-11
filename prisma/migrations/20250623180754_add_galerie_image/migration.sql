-- CreateTable
CREATE TABLE `galerie_image` (
    `galerie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_fichier` VARCHAR(191) NOT NULL,
    `titre` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `ordre` INTEGER NOT NULL DEFAULT 0,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`galerie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
