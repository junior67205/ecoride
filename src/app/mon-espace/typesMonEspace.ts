export type Profil = {
  civilite: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  pseudo: string;
  type_utilisateur: string;
  photo: string;
  credit: number;
};

export type VehiculeForm = {
  immatriculation: string;
  date_premiere_immatriculation: string;
  modele: string;
  couleur: string;
  marque_id: string;
  nb_place: string;
  energie: string;
  preferences: {
    fumeur: boolean;
    animal: boolean;
    girl_only: boolean;
    autres: string[];
  };
  nouvellePreference: string;
};

export type Vehicule = {
  voiture_id: number;
  marque: { libelle: string | null } | null;
  immatriculation: string;
  modele: string;
  couleur: string;
  nb_place: number;
  preferences: string;
  date_premiere_immatriculation: string;
  energie: string;
};

export type Marque = {
  marque_id: number;
  libelle: string | null;
};

export type Participant = {
  id: number;
  pseudo: string;
  photo: string | null;
  email: string;
  date_participation: string;
};

export type Covoiturage = {
  id: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  prix_personne: number;
  nb_place: number;
  statut: string;
  role: 'chauffeur' | 'passager';
  voiture: {
    modele: string;
    marque: string | null;
    immatriculation: string;
  } | null;
  chauffeur: {
    id: number;
    pseudo: string;
    photo: string | null;
    email: string;
  } | null;
  participants: Participant[];
  validation?: boolean | null;
  commentaire?: string | null;
  note?: number | null;
  avis?: string | null;
};

export type VoyageForm = {
  depart: string;
  arrivee: string;
  dateDepart: string;
  heureDepart: string;
  dateArrivee: string;
  heureArrivee: string;
  prix: string;
  vehiculeId: string;
  nb_place: string;
};
