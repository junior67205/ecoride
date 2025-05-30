-- CreateTable
CREATE TABLE `avis` (
    `avis_id` INTEGER NOT NULL AUTO_INCREMENT,
    `commentaire` VARCHAR(50) NULL,
    `note` VARCHAR(50) NULL,
    `statut` VARCHAR(50) NULL,
    `utilisateur_id` INTEGER NULL,

    INDEX `utilisateur_id`(`utilisateur_id`),
    PRIMARY KEY (`avis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuration` (
    `id_configuration` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id_configuration`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuration_parametre` (
    `id_configuration` INTEGER NOT NULL,
    `parametre_id` INTEGER NOT NULL,

    INDEX `parametre_id`(`parametre_id`),
    PRIMARY KEY (`id_configuration`, `parametre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `covoiturage` (
    `covoiturage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_depart` DATE NULL,
    `heure_depart` TIME(0) NULL,
    `lieu_depart` VARCHAR(50) NULL,
    `date_arrivee` DATE NULL,
    `heure_arrivee` VARCHAR(50) NULL,
    `lieu_arrivee` VARCHAR(50) NULL,
    `statut` VARCHAR(50) NULL,
    `nb_place` INTEGER NULL,
    `prix_personne` FLOAT NULL,
    `voiture_id` INTEGER NULL,
    `utilisateur_id` INTEGER NULL,

    INDEX `utilisateur_id`(`utilisateur_id`),
    INDEX `voiture_id`(`voiture_id`),
    PRIMARY KEY (`covoiturage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marque` (
    `marque_id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(50) NULL,

    PRIMARY KEY (`marque_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parametre` (
    `parametre_id` INTEGER NOT NULL AUTO_INCREMENT,
    `propriete` VARCHAR(50) NULL,
    `valeur` VARCHAR(50) NULL,

    PRIMARY KEY (`parametre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(50) NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateur` (
    `utilisateur_id` INTEGER NOT NULL AUTO_INCREMENT,
    `civilite` VARCHAR(10) NULL,
    `nom` VARCHAR(50) NULL,
    `prenom` VARCHAR(50) NULL,
    `email` VARCHAR(50) NULL,
    `password` VARCHAR(50) NULL,
    `telephone` VARCHAR(50) NULL,
    `adresse` VARCHAR(50) NULL,
    `date_naissance` VARCHAR(50) NULL,
    `photo` BLOB NULL,
    `pseudo` VARCHAR(50) NULL,
    `role_id` INTEGER NULL,
    `credit` DECIMAL(10, 2) NOT NULL DEFAULT 20.00,

    UNIQUE INDEX `email`(`email`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`utilisateur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voiture` (
    `voiture_id` INTEGER NOT NULL AUTO_INCREMENT,
    `modele` VARCHAR(50) NULL,
    `immatriculation` VARCHAR(50) NULL,
    `energie` VARCHAR(50) NULL,
    `couleur` VARCHAR(50) NULL,
    `date_premiere_immatriculation` VARCHAR(50) NULL,
    `marque_id` INTEGER NULL,
    `utilisateur_id` INTEGER NULL,

    INDEX `marque_id`(`marque_id`),
    INDEX `utilisateur_id`(`utilisateur_id`),
    PRIMARY KEY (`voiture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participation` (
    `participation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateur_id` INTEGER NOT NULL,
    `covoiturage_id` INTEGER NOT NULL,
    `date_participation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `participation_utilisateur_id_covoiturage_id_key`(`utilisateur_id`, `covoiturage_id`),
    PRIMARY KEY (`participation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `avis` ADD CONSTRAINT `avis_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`utilisateur_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `configuration_parametre` ADD CONSTRAINT `configuration_parametre_ibfk_1` FOREIGN KEY (`id_configuration`) REFERENCES `configuration`(`id_configuration`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `configuration_parametre` ADD CONSTRAINT `configuration_parametre_ibfk_2` FOREIGN KEY (`parametre_id`) REFERENCES `parametre`(`parametre_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `covoiturage` ADD CONSTRAINT `covoiturage_ibfk_1` FOREIGN KEY (`voiture_id`) REFERENCES `voiture`(`voiture_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `covoiturage` ADD CONSTRAINT `covoiturage_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`utilisateur_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `utilisateur` ADD CONSTRAINT `utilisateur_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `voiture` ADD CONSTRAINT `voiture_ibfk_1` FOREIGN KEY (`marque_id`) REFERENCES `marque`(`marque_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `voiture` ADD CONSTRAINT `voiture_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`utilisateur_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participation` ADD CONSTRAINT `participation_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur`(`utilisateur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participation` ADD CONSTRAINT `participation_covoiturage_id_fkey` FOREIGN KEY (`covoiturage_id`) REFERENCES `covoiturage`(`covoiturage_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
