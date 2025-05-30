CREATE DATABASE IF NOT EXISTS ecoride CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoride;

-- Table configuration
CREATE TABLE configuration (
  id_configuration INT AUTO_INCREMENT PRIMARY KEY
);

-- Table parametre
CREATE TABLE parametre (
  parametre_id INT AUTO_INCREMENT PRIMARY KEY,
  propriete VARCHAR(50),
  valeur VARCHAR(50)
);

-- Table role
CREATE TABLE role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(50)
);

-- Table utilisateur
CREATE TABLE utilisateur (
  utilisateur_id INT AUTO_INCREMENT PRIMARY KEY,
  civilite VARCHAR(10),
  nom VARCHAR(50),
  prenom VARCHAR(50),
  email VARCHAR(50) UNIQUE,
  password VARCHAR(50),
  telephone VARCHAR(50),
  adresse VARCHAR(50),
  date_naissance VARCHAR(50),
  photo BLOB,
  pseudo VARCHAR(50),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(role_id),
  credit DECIMAL(10,2) DEFAULT 20
);

-- Table avis
CREATE TABLE avis (
  avis_id INT AUTO_INCREMENT PRIMARY KEY,
  commentaire VARCHAR(50),
  note VARCHAR(50),
  statut VARCHAR(50),
  utilisateur_id INT,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id)
);

-- Table marque
CREATE TABLE marque (
  marque_id INT AUTO_INCREMENT PRIMARY KEY,
  libelle VARCHAR(50)
);

-- Table voiture
CREATE TABLE voiture (
  voiture_id INT AUTO_INCREMENT PRIMARY KEY,
  modele VARCHAR(50),
  immatriculation VARCHAR(50),
  energie VARCHAR(50),
  couleur VARCHAR(50),
  date_premiere_immatriculation VARCHAR(50),
  marque_id INT,
  utilisateur_id INT,
  FOREIGN KEY (marque_id) REFERENCES marque(marque_id),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id)
);

-- Table covoiturage
CREATE TABLE covoiturage (
  covoiturage_id INT AUTO_INCREMENT PRIMARY KEY,
  date_depart DATE,
  heure_depart DATE,
  lieu_depart VARCHAR(50),
  date_arrivee DATE,
  heure_arrivee VARCHAR(50),
  lieu_arrivee VARCHAR(50),
  statut VARCHAR(50),
  nb_place INT,
  prix_personne FLOAT,
  voiture_id INT,
  utilisateur_id INT,
  FOREIGN KEY (voiture_id) REFERENCES voiture(voiture_id),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(utilisateur_id)
);

-- Table de liaison configuration <-> parametre
CREATE TABLE configuration_parametre (
  id_configuration INT,
  parametre_id INT,
  PRIMARY KEY (id_configuration, parametre_id),
  FOREIGN KEY (id_configuration) REFERENCES configuration(id_configuration),
  FOREIGN KEY (parametre_id) REFERENCES parametre(parametre_id)
); 

-- Exemple d'insertion d'utilisateur avec crédit par défaut
INSERT INTO utilisateur (pseudo, email, password, credit)
VALUES ('Jean', 'jean@mail.com', 'motdepasse', 20),
       ('Alice', 'alice@mail.com', 'alicepass', 35),
       ('Bob', 'bob@mail.com', 'bobpass', 5),
       ('Claire', 'claire@mail.com', 'clairepass', 0),
       ('Admin', 'admin@mail.com', 'adminpass', 100);
-- Le crédit est défini pour chaque utilisateur 