USE ecoride;

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE avis;
TRUNCATE TABLE covoiturage;
TRUNCATE TABLE voiture;
TRUNCATE TABLE utilisateur;
TRUNCATE TABLE marque;
TRUNCATE TABLE role;
SET FOREIGN_KEY_CHECKS=1;

-- Rôles
INSERT INTO role (role_id, libelle) VALUES (1, 'Utilisateur'), (2, 'Administrateur'), (3, 'Employé');

-- Utilisateurs (30 + 1 admin + 1 employé)
INSERT INTO utilisateur (civilite, nom, prenom, email, password, telephone, adresse, date_naissance, pseudo, role_id, credit)
VALUES
('M.', 'Dupont', 'Jean', 'jean.dupont@email.com', 'password123', '0600000001', '1 rue de Paris', '1985-01-01', 'jdupont', 1, 20),
('Mme', 'Martin', 'Sophie', 'sophie.martin@email.com', 'password456', '0600000002', '2 avenue de Lyon', '1990-05-12', 'smartin', 1, 35),
('M.', 'Durand', 'Paul', 'paul.durand@email.com', 'password789', '0600000003', '3 rue de Lille', '1988-03-22', 'pdurand', 1, 5),
('Mme', 'Bernard', 'Julie', 'julie.bernard@email.com', 'password321', '0600000004', '4 avenue de Bordeaux', '1992-07-18', 'jbernard', 1, 0),
('M.', 'Petit', 'Luc', 'luc.petit@email.com', 'password654', '0600000005', '5 rue de Nice', '1987-11-30', 'lpetit', 1, 50),
('Mme', 'Robert', 'Claire', 'claire.robert@email.com', 'password987', '0600000006', '6 avenue de Nantes', '1991-09-14', 'crobert', 1, 12),
('M.', 'Richard', 'Hugo', 'hugo.richard@email.com', 'passwordabc', '0600000007', '7 rue de Rennes', '1986-05-25', 'hrichard', 1, 8),
('Mme', 'Simon', 'Emma', 'emma.simon@email.com', 'passworddef', '0600000008', '8 avenue de Toulouse', '1993-12-02', 'esimon', 1, 25),
('M.', 'Lefevre', 'Louis', 'louis.lefevre@email.com', 'passwordghi', '0600000009', '9 rue de Strasbourg', '1989-04-10', 'llefevre', 1, 18),
('Mme', 'Moreau', 'Alice', 'alice.moreau@email.com', 'passwordjkl', '0600000010', '10 avenue de Montpellier', '1994-08-21', 'amoreau', 1, 40),
-- Conducteurs (id 1-10)
('M.', 'Garcia', 'Pierre', 'pierre.garcia@email.com', 'passwordmno', '0600000011', '11 rue de Dijon', '1985-02-15', 'pgarcia', 1, 22),
('Mme', 'Martinez', 'Laura', 'laura.martinez@email.com', 'passwordpqr', '0600000012', '12 avenue de Limoges', '1990-06-19', 'lmartinez', 1, 15),
('M.', 'Lopez', 'Antoine', 'antoine.lopez@email.com', 'passwordstu', '0600000013', '13 rue de Brest', '1988-10-05', 'alopez', 1, 7),
('Mme', 'Gonzalez', 'Camille', 'camille.gonzalez@email.com', 'passwordvwx', '0600000014', '14 avenue de Reims', '1992-01-28', 'cgonzalez', 1, 30),
('M.', 'Perez', 'Lucas', 'lucas.perez@email.com', 'passwordyz1', '0600000015', '15 rue de Metz', '1987-07-13', 'lperez', 1, 19),
('Mme', 'Sanchez', 'Léa', 'lea.sanchez@email.com', 'password234', '0600000016', '16 avenue de Tours', '1991-03-09', 'lsanchez', 1, 11),
('M.', 'Roux', 'Maxime', 'maxime.roux@email.com', 'password567', '0600000017', '17 rue de Pau', '1986-09-27', 'mroux', 1, 27),
('Mme', 'Morel', 'Chloé', 'chloe.morel@email.com', 'password890', '0600000018', '18 avenue de Perpignan', '1993-11-16', 'cmorel', 1, 6),
('M.', 'Fournier', 'Nathan', 'nathan.fournier@email.com', 'passwordabc', '0600000019', '19 rue de Mulhouse', '1989-02-03', 'nfournier', 1, 13),
('Mme', 'Girard', 'Sarah', 'sarah.girard@email.com', 'passworddef', '0600000020', '20 avenue de Caen', '1994-05-29', 'sgirard', 1, 17),
-- Passagers (id 11-20)
('M.', 'Andre', 'Julien', 'julien.andre@email.com', 'passwordghi', '0600000021', '21 rue de Nancy', '1985-08-11', 'jandre', 1, 21),
('Mme', 'Mercier', 'Eva', 'eva.mercier@email.com', 'passwordjkl', '0600000022', '22 avenue de Poitiers', '1990-12-23', 'emercier', 1, 9),
('M.', 'Blanc', 'Hugo', 'hugo.blanc@email.com', 'passwordmno', '0600000023', '23 rue de Béziers', '1988-06-07', 'hblanc', 1, 16),
('Mme', 'Guerin', 'Lina', 'lina.guerin@email.com', 'passwordpqr', '0600000024', '24 avenue de Quimper', '1992-10-19', 'lguerin', 1, 3),
('M.', 'Boyer', 'Tom', 'tom.boyer@email.com', 'passwordstu', '0600000025', '25 rue de Colmar', '1987-01-31', 'tboyer', 1, 14),
('Mme', 'Lemoine', 'Anna', 'anna.lemoine@email.com', 'passwordvwx', '0600000026', '26 avenue de Tarbes', '1991-05-15', 'alemoine', 1, 24),
('M.', 'Faure', 'Enzo', 'enzo.faure@email.com', 'passwordyz1', '0600000027', '27 rue de Laval', '1986-08-28', 'efaure', 1, 2),
('Mme', 'Carpentier', 'Léonie', 'leonie.carpentier@email.com', 'password234', '0600000028', '28 avenue de Chambéry', '1993-02-12', 'lcarpentier', 1, 38),
('M.', 'Boucher', 'Axel', 'axel.boucher@email.com', 'password567', '0600000029', '29 rue de Vannes', '1989-10-04', 'aboucher', 1, 4),
('Mme', 'Muller', 'Jade', 'jade.muller@email.com', 'password890', '0600000030', '30 avenue de La Rochelle', '1994-03-18', 'jmuller', 1, 23),
-- Les deux (id 21-30)
('M.', 'Leroy', 'Baptiste', 'baptiste.leroy@email.com', 'passwordabc', '0600000031', '31 rue de Saint-Malo', '1985-04-14', 'bleroy', 1, 12),
('Mme', 'Roussel', 'Lola', 'lola.roussel@email.com', 'passworddef', '0600000032', '32 avenue de Brive', '1990-09-26', 'lroussel', 1, 29),
('M.', 'Morin', 'Gabriel', 'gabriel.morin@email.com', 'passwordghi', '0600000033', '33 rue de Sète', '1988-12-08', 'gmorin', 1, 31),
('Mme', 'Mathieu', 'Léna', 'lena.mathieu@email.com', 'passwordjkl', '0600000034', '34 avenue de Bastia', '1992-06-20', 'lmathieu', 1, 10),
('M.', 'Clement', 'Noah', 'noah.clement@email.com', 'passwordmno', '0600000035', '35 rue de Carcassonne', '1987-03-03', 'nclement', 1, 26),
('Mme', 'Gauthier', 'Mila', 'mila.gauthier@email.com', 'passwordpqr', '0600000036', '36 avenue de Chalon', '1991-07-17', 'mgauthier', 1, 15),
('M.', 'Jean', 'Ethan', 'ethan.jean@email.com', 'passwordstu', '0600000037', '37 rue de Périgueux', '1986-11-01', 'ejean', 1, 20),
('Mme', 'Masson', 'Rose', 'rose.masson@email.com', 'passwordvwx', '0600000038', '38 avenue de Montauban', '1993-04-25', 'rmasson', 1, 13),
('M.', 'Marchand', 'Adam', 'adam.marchand@email.com', 'passwordyz1', '0600000039', '39 rue de Valence', '1989-06-13', 'amarchand', 1, 17),
('Mme', 'Duval', 'Lina', 'lina.duval@email.com', 'password234', '0600000040', '40 avenue de Gap', '1994-10-07', 'lduval', 1, 22),
-- Admin (id 31)
('M.', 'Admin', 'Super', 'admin@email.com', 'adminpass', '0600000041', '41 rue de l''Admin', '1980-01-01', 'admin', 2, 100),
-- Employé (id 32)
('M.', 'Employe', 'Staff', 'employe@email.com', 'employepass', '0600000042', '42 rue de l''Employé', '1982-02-02', 'employe', 3, 20);

-- Marques automobiles sans doublons
INSERT INTO marque (libelle) VALUES
('Renault'),
('Peugeot'),
('Citroën'),
('Volkswagen'),
('Toyota'),
('Ford'),
('Opel'),
('Fiat'),
('BMW'),
('Mercedes'),
('Audi'),
('Kia'),
('Hyundai'),
('Seat'),
('Dacia'),
('Nissan'),
('Mazda'),
('Honda'),
('Skoda'),
('Mini'),
('Volvo'),
('Suzuki'),
('Chevrolet'),
('Jeep'),
('Lexus'),
('Mitsubishi'),
('Subaru'),
('Alfa Romeo'),
('Jaguar'),
('Land Rover'),
('Porsche');

-- Voitures (15)
INSERT INTO voiture (modele, immatriculation, energie, couleur, date_premiere_immatriculation, marque_id, utilisateur_id) VALUES
('Clio', 'AB-123-CD', 'Essence', 'Rouge', '2015-06-01', 1, 1),
('208', 'EF-456-GH', 'Diesel', 'Bleu', '2018-09-15', 2, 2),
('C3', 'IJ-789-KL', 'Essence', 'Blanc', '2017-03-10', 3, 3),
('Golf', 'MN-012-OP', 'Diesel', 'Noir', '2016-11-20', 4, 4),
('Yaris', 'QR-345-ST', 'Hybride', 'Gris', '2019-08-05', 5, 5),
('Focus', 'UV-678-WX', 'Essence', 'Bleu', '2014-04-18', 6, 6),
('Corsa', 'YZ-901-AB', 'Diesel', 'Rouge', '2013-12-30', 7, 7),
('Panda', 'CD-234-EF', 'Essence', 'Vert', '2012-07-22', 8, 8),
('Serie 1', 'GH-567-IJ', 'Diesel', 'Noir', '2015-09-14', 9, 9),
('Classe A', 'KL-890-MN', 'Essence', 'Blanc', '2016-02-27', 10, 10),
('A3', 'OP-123-QR', 'Diesel', 'Gris', '2017-05-19', 11, 11),
('Picanto', 'ST-456-UV', 'Essence', 'Bleu', '2018-10-23', 12, 12),
('i20', 'WX-789-YZ', 'Hybride', 'Rouge', '2019-01-11', 13, 13),
('Ibiza', 'AB-234-CD', 'Essence', 'Noir', '2014-06-16', 14, 14),
('Sandero', 'EF-567-GH', 'Diesel', 'Blanc', '2013-03-29', 15, 15);

-- Covoiturages (50)
INSERT INTO covoiturage (date_depart, heure_depart, lieu_depart, date_arrivee, heure_arrivee, lieu_arrivee, statut, nb_place, prix_personne, voiture_id, utilisateur_id) VALUES
('2025-06-10', '12:00:00', 'Paris', '2025-06-10', '16:00:00', 'Lyon', 'ouvert', 3, 25.00, 1, 1),
('2025-06-12', '14:30:00', 'Lyon', '2025-06-12', '18:30:00', 'Marseille', 'ouvert', 2, 30.00, 2, 2),
('2025-06-13', '09:00:00', 'Marseille', '2025-06-13', '13:00:00', 'Nice', 'ouvert', 4, 20.00, 3, 3),
('2025-06-14', '16:00:00', 'Nice', '2025-06-14', '20:00:00', 'Toulouse', 'ouvert', 3, 28.00, 4, 4),
('2025-06-15', '11:00:00', 'Toulouse', '2025-06-15', '15:00:00', 'Bordeaux', 'ouvert', 2, 22.00, 5, 5),
('2025-06-16', '15:00:00', 'Bordeaux', '2025-06-16', '19:00:00', 'Nantes', 'ouvert', 3, 24.00, 6, 6),
('2025-06-17', '10:00:00', 'Nantes', '2025-06-17', '14:00:00', 'Rennes', 'ouvert', 4, 19.00, 7, 7),
('2025-06-18', '13:00:00', 'Rennes', '2025-06-18', '17:00:00', 'Lille', 'ouvert', 3, 27.00, 8, 8),
('2025-06-19', '17:00:00', 'Lille', '2025-06-19', '21:00:00', 'Strasbourg', 'ouvert', 2, 26.00, 9, 9),
('2025-06-20', '12:00:00', 'Strasbourg', '2025-06-20', '16:00:00', 'Metz', 'ouvert', 3, 21.00, 10, 10),
('2025-06-21', '08:00:00', 'Metz', '2025-06-21', '12:00:00', 'Nancy', 'ouvert', 4, 18.00, 11, 11),
('2025-06-22', '14:00:00', 'Nancy', '2025-06-22', '18:00:00', 'Dijon', 'ouvert', 3, 23.00, 12, 12),
('2025-06-23', '16:00:00', 'Dijon', '2025-06-23', '20:00:00', 'Besançon', 'ouvert', 2, 20.00, 13, 13),
('2025-06-24', '09:00:00', 'Besançon', '2025-06-24', '13:00:00', 'Annecy', 'ouvert', 3, 29.00, 14, 14),
('2025-06-25', '11:00:00', 'Annecy', '2025-06-25', '15:00:00', 'Grenoble', 'ouvert', 2, 22.00, 15, 15),
('2025-06-26', '15:00:00', 'Grenoble', '2025-06-26', '19:00:00', 'Chambéry', 'ouvert', 3, 24.00, 1, 1),
('2025-06-27', '10:00:00', 'Chambéry', '2025-06-27', '14:00:00', 'Valence', 'ouvert', 4, 19.00, 2, 2),
('2025-06-28', '13:00:00', 'Valence', '2025-06-28', '17:00:00', 'Avignon', 'ouvert', 3, 27.00, 3, 3),
('2025-06-29', '17:00:00', 'Avignon', '2025-06-29', '21:00:00', 'Montpellier', 'ouvert', 2, 26.00, 4, 4),
('2025-06-30', '12:00:00', 'Montpellier', '2025-06-30', '16:00:00', 'Perpignan', 'ouvert', 3, 21.00, 5, 5),
('2025-07-01', '08:00:00', 'Perpignan', '2025-07-01', '12:00:00', 'Narbonne', 'ouvert', 4, 18.00, 6, 6),
('2025-07-02', '14:00:00', 'Narbonne', '2025-07-02', '18:00:00', 'Carcassonne', 'ouvert', 3, 23.00, 7, 7),
('2025-07-03', '16:00:00', 'Carcassonne', '2025-07-03', '20:00:00', 'Albi', 'ouvert', 2, 20.00, 8, 8),
('2025-07-04', '09:00:00', 'Albi', '2025-07-04', '13:00:00', 'Montauban', 'ouvert', 3, 29.00, 9, 9),
('2025-07-05', '11:00:00', 'Montauban', '2025-07-05', '15:00:00', 'Agen', 'ouvert', 2, 22.00, 10, 10),
('2025-07-06', '15:00:00', 'Agen', '2025-07-06', '19:00:00', 'Pau', 'ouvert', 3, 24.00, 11, 11),
('2025-07-07', '10:00:00', 'Pau', '2025-07-07', '14:00:00', 'Tarbes', 'ouvert', 4, 19.00, 12, 12),
('2025-07-08', '13:00:00', 'Tarbes', '2025-07-08', '17:00:00', 'Lourdes', 'ouvert', 3, 27.00, 13, 13),
('2025-07-09', '17:00:00', 'Lourdes', '2025-07-09', '21:00:00', 'Bayonne', 'ouvert', 2, 26.00, 14, 14),
('2025-07-10', '12:00:00', 'Bayonne', '2025-07-10', '16:00:00', 'Biarritz', 'ouvert', 3, 21.00, 15, 15),
('2025-07-11', '08:00:00', 'Biarritz', '2025-07-11', '12:00:00', 'Anglet', 'ouvert', 4, 18.00, 1, 1),
('2025-07-12', '14:00:00', 'Anglet', '2025-07-12', '18:00:00', 'Dax', 'ouvert', 3, 23.00, 2, 2),
('2025-07-13', '16:00:00', 'Dax', '2025-07-13', '20:00:00', 'Mont-de-Marsan', 'ouvert', 2, 20.00, 3, 3),
('2025-07-14', '09:00:00', 'Mont-de-Marsan', '2025-07-14', '13:00:00', 'Aire-sur-l''Adour', 'ouvert', 3, 29.00, 4, 4),
('2025-07-15', '11:00:00', 'Aire-sur-l''Adour', '2025-07-15', '15:00:00', 'Tarbes', 'ouvert', 2, 22.00, 5, 5),
('2025-07-16', '15:00:00', 'Tarbes', '2025-07-16', '19:00:00', 'Pau', 'ouvert', 3, 24.00, 6, 6),
('2025-07-17', '10:00:00', 'Pau', '2025-07-17', '14:00:00', 'Agen', 'ouvert', 4, 19.00, 7, 7),
('2025-07-18', '13:00:00', 'Agen', '2025-07-18', '17:00:00', 'Montauban', 'ouvert', 3, 27.00, 8, 8),
('2025-07-19', '17:00:00', 'Montauban', '2025-07-19', '21:00:00', 'Albi', 'ouvert', 2, 26.00, 9, 9),
('2025-07-20', '12:00:00', 'Albi', '2025-07-20', '16:00:00', 'Carcassonne', 'ouvert', 3, 21.00, 10, 10),
('2025-07-21', '08:00:00', 'Carcassonne', '2025-07-21', '12:00:00', 'Narbonne', 'ouvert', 4, 18.00, 11, 11),
('2025-07-22', '14:00:00', 'Narbonne', '2025-07-22', '18:00:00', 'Perpignan', 'ouvert', 3, 23.00, 12, 12),
('2025-07-23', '16:00:00', 'Perpignan', '2025-07-23', '20:00:00', 'Montpellier', 'ouvert', 2, 20.00, 13, 13),
('2025-07-24', '09:00:00', 'Montpellier', '2025-07-24', '13:00:00', 'Avignon', 'ouvert', 3, 29.00, 14, 14),
('2025-07-25', '11:00:00', 'Avignon', '2025-07-25', '15:00:00', 'Valence', 'ouvert', 2, 22.00, 15, 15),
('2025-07-26', '15:00:00', 'Valence', '2025-07-26', '19:00:00', 'Chambéry', 'ouvert', 3, 24.00, 1, 1),
('2025-07-27', '10:00:00', 'Chambéry', '2025-07-27', '14:00:00', 'Grenoble', 'ouvert', 4, 19.00, 2, 2),
('2025-07-28', '13:00:00', 'Grenoble', '2025-07-28', '17:00:00', 'Annecy', 'ouvert', 3, 27.00, 3, 3),
('2025-07-29', '17:00:00', 'Annecy', '2025-07-29', '21:00:00', 'Besançon', 'ouvert', 2, 26.00, 4, 4),
('2025-07-30', '12:00:00', 'Besançon', '2025-07-30', '16:00:00', 'Dijon', 'ouvert', 3, 21.00, 5, 5);

-- Avis (validés et en attente)
INSERT INTO avis (commentaire, note, statut, utilisateur_id) VALUES
('Super trajet !', '5', 'valide', 2),
('Ponctuel et sympa', '4', 'valide', 1),
('Voiture propre', '5', 'valide', 3),
('Conducteur prudent', '4', 'valide', 4),
('Bonne ambiance', '5', 'valide', 5),
('Retard au départ', '3', 'en attente', 6),
('Trajet agréable', '5', 'valide', 7),
('Musique trop forte', '2', 'en attente', 8),
('Chauffeur très gentil', '5', 'valide', 9),
('A recommander', '5', 'valide', 10); 