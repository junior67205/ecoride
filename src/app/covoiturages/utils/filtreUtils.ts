import { Covoiturage } from '../types';
import { getDureeHeuresSimple } from './dateUtils';

export function filterCovoiturages(
  covoiturages: Covoiturage[],
  {
    filtreEco,
    filtrePrix,
    filtreDuree,
    filtreNote,
  }: {
    filtreEco: boolean;
    filtrePrix: string;
    filtreDuree: string;
    filtreNote: string;
  }
) {
  return covoiturages.filter(covoit => {
    if (filtreEco && !covoit.ecologique) return false;
    if (filtrePrix && covoit.prix_personne > parseFloat(filtrePrix)) return false;
    if (
      filtreNote &&
      (covoit.chauffeur.note === null || covoit.chauffeur.note < parseInt(filtreNote, 10))
    )
      return false;
    if (filtreDuree) {
      const duree = getDureeHeuresSimple(covoit);
      if (duree === null || duree.h > parseFloat(filtreDuree)) return false;
    }
    return true;
  });
}
