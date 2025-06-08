import type { Vehicule } from '../typesMonEspace';
import { TrashIcon } from '@heroicons/react/24/outline';

type VehiculeListProps = {
  vehicules: Vehicule[];
  handleDeleteVehicule: (id: number) => void;
};

export default function VehiculeList({ vehicules, handleDeleteVehicule }: VehiculeListProps) {
  if (vehicules.length === 0) {
    return (
      <div className="text-red-600 mb-4">
        Aucun véhicule enregistré. Merci d&apos;en ajouter au moins un pour valider votre rôle.
      </div>
    );
  }
  return (
    <div className="grid gap-6 mb-4 max-w-2xl mx-auto w-full">
      {vehicules.map(v => (
        <div
          key={v.voiture_id}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-green-100"
        >
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xl font-bold text-green-700">{v.immatriculation}</span>
              <span className="text-green-600">
                {v.marque?.libelle} {v.modele}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <b>Couleur :</b> {v.couleur} &bull; <b>Places :</b> {v.nb_place}
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <b>Date 1ère immatriculation :</b> {v.date_premiere_immatriculation}
            </div>
            <div className="text-sm text-gray-700 mb-1">
              <b>Préférences :</b>{' '}
              {v.preferences
                ? (() => {
                    const prefs = JSON.parse(v.preferences);
                    const fumeur = prefs.fumeur ? 'Oui' : 'Non';
                    const animal = prefs.animal ? 'Oui' : 'Non';
                    const girlOnly = prefs.girl_only ? 'Oui' : 'Non';
                    const autres =
                      prefs.autres && prefs.autres.length > 0 ? prefs.autres.join(', ') : 'Aucune';
                    return `Fumeur : ${fumeur}, Animaux acceptés : ${animal}, Girl only : ${girlOnly}, Autres : ${autres}`;
                  })()
                : 'Aucune'}
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition shadow font-semibold"
            onClick={() => handleDeleteVehicule(v.voiture_id)}
          >
            <TrashIcon className="w-5 h-5" />
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
