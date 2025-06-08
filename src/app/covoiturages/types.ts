export type Covoiturage = {
  id: number;
  chauffeur: {
    pseudo: string;
    photo: string;
    note: number;
  };
  nb_place: number;
  prix_personne: number;
  date_depart: string;
  heure_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  ecologique: boolean;
};
