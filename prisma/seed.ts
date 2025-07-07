import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
console.log('Seed lancé !');
const prisma = new PrismaClient();

/*
 * Règle métier crédits :
 * - Lors d'une réservation : 2 crédits vont à l'admin (plateforme), le reste au chauffeur.
 * - Lors d'une annulation par le chauffeur : chaque passager est remboursé, le chauffeur et l'admin sont débités de leur part.
 * - L'admin (pseudo: 'admin', role_id: 2) doit toujours exister dans la seed.
 */

async function main() {
  const adminPassword = await bcrypt.hash('adminpassword', 10);
  const employePassword = await bcrypt.hash('employepassword', 10);
  const userPassword = await bcrypt.hash('userpassword', 10);

  // Création des rôles
  const roleAdmin = await prisma.role.upsert({
    where: { libelle: 'admin' },
    update: {},
    create: { libelle: 'admin' },
  });

  const roleUser = await prisma.role.upsert({
    where: { libelle: 'user' },
    update: {},
    create: { libelle: 'user' },
  });

  const roleEmploye = await prisma.role.upsert({
    where: { libelle: 'employe' },
    update: {},
    create: { libelle: 'employe' },
  });

  // Création de l'admin
  await prisma.utilisateur.upsert({
    where: { email: 'admin@ecoride.com' },
    update: {},
    create: {
      email: 'admin@ecoride.com',
      password: adminPassword,
      nom: 'Admin',
      prenom: 'Super',
      pseudo: 'superadmin',
      type_utilisateur: 'admin',
      civilite: 'M.',
      role_id: roleAdmin.role_id,
      suspendu: false,
    },
  });

  // Création d'un employé de test
  await prisma.utilisateur.upsert({
    where: { email: 'employe@ecoride.com' },
    update: {},
    create: {
      email: 'employe@ecoride.com',
      password: employePassword,
      nom: 'Employe',
      prenom: 'Test',
      pseudo: 'testemploye',
      type_utilisateur: 'employe',
      civilite: 'Mme.',
      role_id: roleEmploye.role_id,
      suspendu: false,
    },
  });

  // Création d'utilisateurs réguliers
  const users = [];
  for (let i = 1; i <= 15; i++) {
    const user = await prisma.utilisateur.upsert({
      where: { email: `user${i}@ecoride.com` },
      update: {},
      create: {
        email: `user${i}@ecoride.com`,
        password: userPassword,
        nom: `UserNom${i}`,
        prenom: `UserPrenom${i}`,
        pseudo: `user${i}`,
        type_utilisateur: 'utilisateur',
        civilite: i % 2 === 0 ? 'Mme.' : 'M.',
        role_id: roleUser.role_id,
        suspendu: false,
        credit: 50.0,
      },
    });
    users.push(user);
  }

  // Création des paramètres de configuration
  await prisma.parametre.upsert({
    where: { propriete: 'frais_service_credits' },
    update: {},
    create: { propriete: 'frais_service_credits', valeur: '2' },
  });
  await prisma.parametre.upsert({
    where: { propriete: 'credits_bienvenue' },
    update: {},
    create: { propriete: 'credits_bienvenue', valeur: '20' },
  });
  await prisma.parametre.upsert({
    where: { propriete: 'mode_maintenance' },
    update: {},
    create: { propriete: 'mode_maintenance', valeur: 'false' },
  });
  await prisma.parametre.upsert({
    where: { propriete: 'afficher_galerie_homepage' },
    update: {},
    create: { propriete: 'afficher_galerie_homepage', valeur: 'true' },
  });

  // Marques
  const marquePeugeot = await prisma.marque.upsert({
    where: { libelle: 'Peugeot' },
    update: {},
    create: { libelle: 'Peugeot' },
  });
  const marqueRenault = await prisma.marque.upsert({
    where: { libelle: 'Renault' },
    update: {},
    create: { libelle: 'Renault' },
  });
  const marqueCitroen = await prisma.marque.upsert({
    where: { libelle: 'Citroen' },
    update: {},
    create: { libelle: 'Citroen' },
  });

  // Voitures
  const voitures = [];
  const modeles = ['208', 'Clio', 'C3', '308', 'Captur', 'C4'];
  for (let i = 0; i < users.length; i++) {
    const voiture = await prisma.voiture.create({
      data: {
        modele: modeles[i % modeles.length],
        immatriculation: `AB-${123 + i}-CD`,
        energie: i % 3 === 0 ? 'Essence' : 'Diesel',
        couleur: 'Noire',
        nb_place: 5,
        marque_id:
          i % 3 === 0
            ? marquePeugeot.marque_id
            : i % 3 === 1
              ? marqueRenault.marque_id
              : marqueCitroen.marque_id,
        utilisateur_id: users[i].utilisateur_id,
      },
    });
    voitures.push(voiture);
  }

  // Données de base pour les covoiturages
  const covoituragesDataTemplate = [
    {
      lieu_depart: 'Paris',
      lieu_arrivee: 'Lyon',
      prix_personne: 25,
    },
    {
      lieu_depart: 'Lyon',
      lieu_arrivee: 'Marseille',
      prix_personne: 5,
    },
    {
      lieu_depart: 'Marseille',
      lieu_arrivee: 'Nice',
      prix_personne: 6,
    },
    {
      lieu_depart: 'Nice',
      lieu_arrivee: 'Toulouse',
      prix_personne: 10,
    },
    {
      lieu_depart: 'Toulouse',
      lieu_arrivee: 'Bordeaux',
      prix_personne: 12,
    },
    {
      lieu_depart: 'Bordeaux',
      lieu_arrivee: 'Nantes',
      prix_personne: 5,
    },
    {
      lieu_depart: 'Nantes',
      lieu_arrivee: 'Rennes',
      prix_personne: 10,
    },
    {
      lieu_depart: 'Rennes',
      lieu_arrivee: 'Lille',
      prix_personne: 10,
    },
    {
      lieu_depart: 'Lille',
      lieu_arrivee: 'Strasbourg',
      prix_personne: 7,
    },
    {
      lieu_depart: 'Strasbourg',
      lieu_arrivee: 'Metz',
      prix_personne: 5,
    },
    {
      lieu_depart: 'Metz',
      lieu_arrivee: 'Nancy',
      prix_personne: 7,
    },
    {
      lieu_depart: 'Nancy',
      lieu_arrivee: 'Dijon',
      prix_personne: 7,
    },
    {
      lieu_depart: 'Dijon',
      lieu_arrivee: 'Besançon',
      prix_personne: 8,
    },
    {
      lieu_depart: 'Besançon',
      lieu_arrivee: 'Annecy',
      prix_personne: 5,
    },
    {
      lieu_depart: 'Annecy',
      lieu_arrivee: 'Grenoble',
      prix_personne: 5,
    },
  ];

  // Génération des covoiturages
  const covoituragesToCreate = [];
  for (let i = 0; i < 50; i++) {
    const template = covoituragesDataTemplate[i % covoituragesDataTemplate.length];
    const voiture = voitures[i % voitures.length];

    const dateDepart = new Date();
    dateDepart.setDate(dateDepart.getDate() + i);

    const dateArrivee = new Date(dateDepart);

    covoituragesToCreate.push({
      date_depart: dateDepart,
      heure_depart: `${(8 + i) % 24}:00:00`,
      lieu_depart: template.lieu_depart,
      date_arrivee: dateArrivee,
      heure_arrivee: `${(12 + i) % 24}:00:00`,
      lieu_arrivee: template.lieu_arrivee,
      statut: 'ouvert',
      nb_place: Math.floor(Math.random() * 3) + 2,
      prix_personne: template.prix_personne,
      voiture_id: voiture.voiture_id,
      utilisateur_id: voiture.utilisateur_id,
    });
  }

  await prisma.covoiturage.createMany({
    data: covoituragesToCreate,
  });

  // Avis
  await prisma.avis.createMany({
    data: [
      { commentaire: 'Super trajet !', note: '5', statut: 'valide', utilisateur_id: 2 },
      { commentaire: 'Ponctuel et sympa', note: '4', statut: 'valide', utilisateur_id: 1 },
      { commentaire: 'Voiture propre', note: '5', statut: 'valide', utilisateur_id: 3 },
      { commentaire: 'Conducteur prudent', note: '4', statut: 'valide', utilisateur_id: 4 },
      { commentaire: 'Bonne ambiance', note: '5', statut: 'valide', utilisateur_id: 5 },
      { commentaire: 'Retard au départ', note: '3', statut: 'en attente', utilisateur_id: 6 },
      { commentaire: 'Trajet agréable', note: '5', statut: 'valide', utilisateur_id: 7 },
      { commentaire: 'Musique trop forte', note: '2', statut: 'en attente', utilisateur_id: 8 },
      { commentaire: 'Chauffeur très gentil', note: '5', statut: 'valide', utilisateur_id: 9 },
      { commentaire: 'A recommander', note: '5', statut: 'valide', utilisateur_id: 10 },
    ],
  });

  console.log('Seed completed successfully');
}

main()
  .then(() => {
    console.log('Seed terminé !');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    return prisma.$disconnect();
  });
