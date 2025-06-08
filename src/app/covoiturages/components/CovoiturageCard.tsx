import Image from 'next/image';
import Link from 'next/link';
import ParticiperButton from '@/components/ParticiperButton';
import { formatDateFr, formatHeure, getDureeHeuresSimple } from '../utils/dateUtils';

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

interface CovoiturageCardProps {
  covoiturage: Covoiturage;
}

export default function CovoiturageCard({ covoiturage }: CovoiturageCardProps) {
  const duree = getDureeHeuresSimple(covoiturage);
  const dureeAffichee = duree ? `${duree.h}h${String(duree.m).padStart(2, '0')}` : 'NC';

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center gap-4 border border-primary-light">
      <Image
        src={covoiturage.chauffeur.photo}
        alt={covoiturage.chauffeur.pseudo}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover border"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-primary">{covoiturage.chauffeur.pseudo}</span>
          <span className="text-yellow-500">★ {covoiturage.chauffeur.note}</span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          {covoiturage.nb_place} place{covoiturage.nb_place > 1 ? 's' : ''} disponible
          {covoiturage.nb_place > 1 ? 's' : ''} &bull; {covoiturage.prix_personne} € / pers
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Départ : {formatDateFr(covoiturage.date_depart)} à {formatHeure(covoiturage.heure_depart)}{' '}
          &bull; Arrivée : {formatDateFr(covoiturage.date_arrivee)} à{' '}
          {formatHeure(covoiturage.heure_arrivee)} &bull; Durée : {dureeAffichee}
        </div>
        {covoiturage.ecologique ? (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Trajet écologique
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Trajet standard
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <ParticiperButton
          covoiturageId={covoiturage.id}
          nbPlaces={covoiturage.nb_place}
          prixPersonne={covoiturage.prix_personne}
        />
        <Link
          href={`/covoiturages/${covoiturage.id}`}
          className="btn btn-outline-primary px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
        >
          Détail
        </Link>
      </div>
    </div>
  );
}
