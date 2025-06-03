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
};

export type Marque = {
  marque_id: number;
  libelle: string | null;
};
