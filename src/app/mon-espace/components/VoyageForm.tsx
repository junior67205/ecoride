import React, { useState } from 'react';
import type { Vehicule, VoyageForm as VoyageFormType } from '../typesMonEspace';
import AlertMessage from './AlertMessage';
import PrimaryButton from './PrimaryButton';

type VoyageFormProps = {
  voyageForm: VoyageFormType;
  setVoyageForm: (form: VoyageFormType) => void;
  vehicules: Vehicule[];
  voyageMessage: string;
  voyageError: string;
  voyageLoading: boolean;
  handleVoyageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function SecondaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="btn btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 px-4 py-2 rounded"
      {...props}
    >
      {children}
    </button>
  );
}

export default function VoyageForm({
  voyageForm,
  setVoyageForm,
  vehicules,
  voyageMessage,
  voyageError,
  voyageLoading,
  handleVoyageSubmit,
}: VoyageFormProps) {
  const [villeError, setVilleError] = useState({ depart: '', arrivee: '' });

  // Regex : lettres, espaces, tirets
  const villeRegex = /^[A-Za-zÀ-ÿ\-\s]+$/;

  const handleVilleChange = (field: 'depart' | 'arrivee', value: string) => {
    // Capitalise la première lettre
    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
    if (value === '' || villeRegex.test(value)) {
      setVoyageForm({ ...voyageForm, [field]: formatted });
      setVilleError({ ...villeError, [field]: '' });
    } else {
      setVilleError({
        ...villeError,
        [field]: 'Seules les lettres, espaces et tirets sont autorisés.',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-bold mb-8 text-green-700 border-b border-green-100 pb-4">
        Créer un nouveau covoiturage
      </h2>

      <form onSubmit={handleVoyageSubmit} className="space-y-8">
        {/* Section Véhicule */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-6a1 1 0 00-.293-.707l-2-2A1 1 0 0017 4H3z" />
            </svg>
            Véhicule
          </h3>
          <div className="mb-4">
            <label className="font-medium mb-2 block text-gray-700" htmlFor="vehiculeId">
              Sélectionnez votre véhicule
            </label>
            <select
              id="vehiculeId"
              name="vehiculeId"
              value={voyageForm.vehiculeId}
              onChange={e => setVoyageForm({ ...voyageForm, vehiculeId: e.target.value })}
              className="select select-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            >
              <option value="">Choisir un véhicule</option>
              {vehicules.map(vehicule => (
                <option key={vehicule.voiture_id} value={vehicule.voiture_id}>
                  {`${vehicule.marque?.libelle ?? ''} ${vehicule.modele} - ${vehicule.couleur} (${vehicule.nb_place} places)`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="font-medium mb-2 block text-gray-700" htmlFor="nb_place">
              Nombre de places disponibles (optionnel)
            </label>
            <input
              id="nb_place"
              name="nb_place"
              type="number"
              min="1"
              max={
                voyageForm.vehiculeId
                  ? (() => {
                      const v = vehicules.find(
                        v => String(v.voiture_id) === String(voyageForm.vehiculeId)
                      );
                      return v?.nb_place || 0;
                    })()
                  : undefined
              }
              value={voyageForm.nb_place}
              onChange={e => setVoyageForm({ ...voyageForm, nb_place: e.target.value })}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="Laissez vide pour utiliser le maximum disponible"
            />
            <div className="text-xs text-green-600 mt-1">
              {voyageForm.vehiculeId
                ? (() => {
                    const v = vehicules.find(
                      v => String(v.voiture_id) === String(voyageForm.vehiculeId)
                    );
                    if (!v) return null;
                    const places = Math.max(0, (v.nb_place || 0) - 1);
                    return voyageForm.nb_place
                      ? `Le nombre saisi sera utilisé tel quel (max ${v.nb_place} places)`
                      : `Par défaut : ${places} place${places > 1 ? 's' : ''} disponible${places > 1 ? 's' : ''} (capacité du véhicule moins le conducteur)`;
                  })()
                : 'Sélectionnez un véhicule pour voir le nombre de places par défaut'}
            </div>
          </div>
        </div>

        {/* Section Trajet */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Trajet
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="depart">
                Ville de départ
              </label>
              <input
                id="depart"
                name="depart"
                type="text"
                value={voyageForm.depart}
                onChange={e => handleVilleChange('depart', e.target.value)}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="Ville de départ"
                required
              />
              {villeError.depart && (
                <div className="text-xs text-red-600 mt-1">{villeError.depart}</div>
              )}
            </div>
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="arrivee">
                Ville d&apos;arrivée
              </label>
              <input
                id="arrivee"
                name="arrivee"
                type="text"
                value={voyageForm.arrivee}
                onChange={e => handleVilleChange('arrivee', e.target.value)}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="Ville d'arrivée"
                required
              />
              {villeError.arrivee && (
                <div className="text-xs text-red-600 mt-1">{villeError.arrivee}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section Date et Heure */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Date et Heure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="dateDepart">
                Date de départ
              </label>
              <input
                id="dateDepart"
                name="dateDepart"
                type="date"
                value={voyageForm.dateDepart}
                onChange={e => setVoyageForm({ ...voyageForm, dateDepart: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="heureDepart">
                Heure de départ
              </label>
              <input
                id="heureDepart"
                name="heureDepart"
                type="time"
                value={voyageForm.heureDepart}
                onChange={e => setVoyageForm({ ...voyageForm, heureDepart: e.target.value })}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="dateArrivee">
                Date d&apos;arrivée
              </label>
              <input
                id="dateArrivee"
                name="dateArrivee"
                type="date"
                value={voyageForm.dateArrivee}
                onChange={e => setVoyageForm({ ...voyageForm, dateArrivee: e.target.value })}
                min={voyageForm.dateDepart || new Date().toISOString().split('T')[0]}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="heureArrivee">
                Heure d&apos;arrivée
              </label>
              <input
                id="heureArrivee"
                name="heureArrivee"
                type="time"
                value={voyageForm.heureArrivee}
                onChange={e => setVoyageForm({ ...voyageForm, heureArrivee: e.target.value })}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                required
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            La date d&apos;arrivée doit être postérieure à la date de départ
          </div>
        </div>

        {/* Section Prix */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            Prix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium mb-2 block text-gray-700" htmlFor="prix">
                Prix par passager (€)
              </label>
              <input
                id="prix"
                name="prix"
                type="number"
                min="3"
                step="1"
                value={voyageForm.prix}
                onChange={e => setVoyageForm({ ...voyageForm, prix: e.target.value })}
                className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="3"
                required
              />
              <div className="text-xs text-green-600 mt-1">
                2 crédits seront prélevés par la plateforme sur chaque réservation.
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-4">
          <SecondaryButton onClick={() => {}}>Annuler</SecondaryButton>
          <PrimaryButton type="submit" loading={voyageLoading}>
            Créer le covoiturage
          </PrimaryButton>
        </div>

        {/* Messages d'alerte */}
        {voyageError && <AlertMessage message={voyageError} type="error" />}
        {voyageMessage && <AlertMessage message={voyageMessage} type="success" />}
      </form>
    </div>
  );
}
