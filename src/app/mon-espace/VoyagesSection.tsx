import React from 'react';
import { Vehicule } from './typesMonEspace';

export type VoyageForm = {
  depart: string;
  arrivee: string;
  dateDepart: string;
  heureDepart: string;
  dateArrivee: string;
  heureArrivee: string;
  prix: string;
  vehiculeId: string;
};

type VoyagesSectionProps = {
  voyageForm: VoyageForm;
  setVoyageForm: (form: VoyageForm) => void;
  vehicules: Vehicule[];
  voyageMessage: string;
  voyageError: string;
  voyageLoading: boolean;
  setShowVoyageForm: (show: boolean) => void;
  showVoyageForm: boolean;
  handleVoyageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function VoyagesSection({
  voyageForm,
  setVoyageForm,
  vehicules,
  voyageMessage,
  voyageError,
  voyageLoading,
  setShowVoyageForm,
  showVoyageForm,
  handleVoyageSubmit,
}: VoyagesSectionProps) {
  return (
    <section className="max-w-xl mx-auto mt-10">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mb-4"
        onClick={() => setShowVoyageForm(!showVoyageForm)}
      >
        {showVoyageForm ? 'Annuler' : 'Créer un voyage'}
      </button>
      {showVoyageForm && (
        <form
          className="flex flex-col gap-6 bg-white rounded shadow p-8"
          onSubmit={handleVoyageSubmit}
        >
          <div className="mb-2">
            <h3 className="font-semibold text-lg mb-4 text-green-700">Départ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="depart">
                  Adresse de départ
                </label>
                <input
                  id="depart"
                  name="depart"
                  type="text"
                  value={voyageForm.depart}
                  onChange={e => setVoyageForm({ ...voyageForm, depart: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="dateDepart">
                  Date de départ
                </label>
                <input
                  id="dateDepart"
                  name="dateDepart"
                  type="date"
                  value={voyageForm.dateDepart}
                  onChange={e => setVoyageForm({ ...voyageForm, dateDepart: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="heureDepart">
                  Heure de départ
                </label>
                <input
                  id="heureDepart"
                  name="heureDepart"
                  type="time"
                  value={voyageForm.heureDepart}
                  onChange={e => setVoyageForm({ ...voyageForm, heureDepart: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <h3 className="font-semibold text-lg mb-4 text-green-700">Arrivée</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="arrivee">
                  Adresse d&apos;arrivée
                </label>
                <input
                  id="arrivee"
                  name="arrivee"
                  type="text"
                  value={voyageForm.arrivee}
                  onChange={e => setVoyageForm({ ...voyageForm, arrivee: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="dateArrivee">
                  Date d&apos;arrivée
                </label>
                <input
                  id="dateArrivee"
                  name="dateArrivee"
                  type="date"
                  value={voyageForm.dateArrivee}
                  onChange={e => setVoyageForm({ ...voyageForm, dateArrivee: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium mb-1" htmlFor="heureArrivee">
                  Heure d&apos;arrivée
                </label>
                <input
                  id="heureArrivee"
                  name="heureArrivee"
                  type="time"
                  value={voyageForm.heureArrivee}
                  onChange={e => setVoyageForm({ ...voyageForm, heureArrivee: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <label className="font-medium mb-1" htmlFor="prix">
                  Prix (crédits)
                </label>
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min="3"
                  value={voyageForm.prix}
                  onChange={e => setVoyageForm({ ...voyageForm, prix: e.target.value })}
                  className="input input-bordered px-3 py-2 rounded border w-full"
                  required
                />
              </div>
              <div className="md:ml-6 text-xs text-gray-500 mt-2 md:mt-6 whitespace-nowrap">
                2 crédits seront prélevés par la plateforme sur chaque réservation.
              </div>
            </div>
          </div>
          <div className="mb-2 mt-6">
            <label className="font-medium mb-1" htmlFor="vehiculeId">
              Véhicule
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <select
                id="vehiculeId"
                name="vehiculeId"
                value={voyageForm.vehiculeId}
                onChange={e => setVoyageForm({ ...voyageForm, vehiculeId: e.target.value })}
                className="input input-bordered px-3 py-2 rounded border w-full md:w-auto"
                required
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicules.map(v => (
                  <option key={v.voiture_id} value={v.voiture_id}>
                    {v.marque?.libelle} {v.modele} ({v.immatriculation})
                  </option>
                ))}
              </select>
              {/* Le bouton pour ajouter un véhicule doit être géré par le parent via setSection si besoin */}
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-4"
            disabled={voyageLoading}
          >
            {voyageLoading ? 'Création...' : 'Créer le voyage'}
          </button>
          {voyageError && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-center">
              {voyageError}
            </div>
          )}
          {voyageMessage && (
            <div className="mb-2 p-2 bg-green-100 text-green-700 rounded text-center">
              {voyageMessage}
            </div>
          )}
        </form>
      )}
    </section>
  );
}
