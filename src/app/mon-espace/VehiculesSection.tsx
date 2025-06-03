import React from 'react';
import { Vehicule, Marque, VehiculeForm, Profil } from './typesMonEspace';

type VehiculesSectionProps = {
  vehicules: Vehicule[];
  vehiculesLoading: boolean;
  vehiculeForm: VehiculeForm;
  marques: Marque[];
  handleVehiculeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleVehiculeSubmit: (e: React.FormEvent) => void;
  handleDeleteVehicule: (id: number) => void;
  vehiculeError: string;
  vehiculeMessage: string;
  profil: Profil;
  handleAddPreference: () => void;
  handleRemovePreference: (pref: string) => void;
};

export default function VehiculesSection({
  vehicules,
  vehiculesLoading,
  vehiculeForm,
  marques,
  handleVehiculeChange,
  handleVehiculeSubmit,
  handleDeleteVehicule,
  vehiculeError,
  vehiculeMessage,
  profil,
  handleAddPreference,
  handleRemovePreference,
}: VehiculesSectionProps) {
  return (
    <section className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Mes véhicules</h2>
      {vehiculesLoading ? (
        <div>Chargement des véhicules...</div>
      ) : (
        <ul className="mb-4">
          {vehicules.length === 0 ? (
            <li className="text-red-600">
              Aucun véhicule enregistré. Merci d&apos;en ajouter au moins un pour valider votre
              rôle.
            </li>
          ) : (
            vehicules.map(v => (
              <li
                key={v.voiture_id}
                className="mb-2 p-2 border rounded bg-white flex flex-col gap-1"
              >
                <span>
                  <b>Immatriculation :</b> {v.immatriculation}
                </span>
                <span>
                  <b>Modèle :</b> {v.modele}
                </span>
                <span>
                  <b>Couleur :</b> {v.couleur}
                </span>
                <span>
                  <b>Marque :</b> {v.marque?.libelle}
                </span>
                <span>
                  <b>Date 1ère immatriculation :</b> {v.date_premiere_immatriculation}
                </span>
                <span>
                  <b>Nombre de places :</b> {v.nb_place}
                </span>
                <span>
                  <b>Préférences :</b>{' '}
                  {v.preferences
                    ? (() => {
                        const prefs = JSON.parse(v.preferences);
                        const fumeur = prefs.fumeur ? 'Oui' : 'Non';
                        const animal = prefs.animal ? 'Oui' : 'Non';
                        const girlOnly = prefs.girl_only ? 'Oui' : 'Non';
                        const autres =
                          prefs.autres && prefs.autres.length > 0
                            ? prefs.autres.join(', ')
                            : 'Aucune';
                        return `Fumeur : ${fumeur}, Animaux acceptés : ${animal}, Girl only : ${girlOnly}, Autres : ${autres}`;
                      })()
                    : 'Aucune'}
                </span>
                <button
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 w-max"
                  onClick={() => handleDeleteVehicule(v.voiture_id)}
                >
                  Supprimer
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      <form
        onSubmit={handleVehiculeSubmit}
        className="flex flex-col gap-3 bg-white rounded shadow p-6 mt-4"
      >
        <label className="font-medium mb-1" htmlFor="immatriculation">
          Immatriculation
        </label>
        <input
          id="immatriculation"
          name="immatriculation"
          placeholder="ex : 26-HEH-67"
          value={vehiculeForm.immatriculation}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        />
        <label className="font-medium mb-1" htmlFor="date_premiere_immatriculation">
          Date de première immatriculation
        </label>
        <input
          type="date"
          id="date_premiere_immatriculation"
          name="date_premiere_immatriculation"
          value={vehiculeForm.date_premiere_immatriculation}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        />
        <label className="font-medium mb-1" htmlFor="modele">
          Modèle
        </label>
        <input
          id="modele"
          name="modele"
          placeholder="ex : Clio 4"
          value={vehiculeForm.modele}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        />
        <label className="font-medium mb-1" htmlFor="couleur">
          Couleur
        </label>
        <input
          id="couleur"
          name="couleur"
          placeholder="ex : Grise"
          value={vehiculeForm.couleur}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        />
        <label className="font-medium mb-1" htmlFor="marque_id">
          Marque
        </label>
        <select
          id="marque_id"
          name="marque_id"
          value={vehiculeForm.marque_id}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        >
          <option value="">Sélectionner une marque</option>
          {marques.map(m => (
            <option key={m.marque_id} value={m.marque_id}>
              {m.libelle}
            </option>
          ))}
        </select>
        <label className="font-medium mb-1" htmlFor="nb_place">
          Nombre de places
        </label>
        <input
          id="nb_place"
          name="nb_place"
          type="number"
          min="1"
          max="9"
          placeholder="ex : 5"
          value={vehiculeForm.nb_place}
          onChange={handleVehiculeChange}
          className="input input-bordered px-3 py-2 rounded border"
          required
        />
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="fumeur"
              checked={vehiculeForm.preferences.fumeur}
              onChange={handleVehiculeChange}
            />{' '}
            Fumeur accepté
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="animal"
              checked={vehiculeForm.preferences.animal}
              onChange={handleVehiculeChange}
            />{' '}
            Animaux acceptés
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="girl_only"
              checked={vehiculeForm.preferences.girl_only}
              onChange={handleVehiculeChange}
              disabled={profil.civilite === 'Monsieur'}
            />{' '}
            Girl only
            {profil.civilite === 'Monsieur' && (
              <span className="text-xs text-gray-400 ml-1">(réservé aux dames)</span>
            )}
          </label>
        </div>
        <div>
          <div className="mb-2">Autres préférences :</div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={vehiculeForm.nouvellePreference}
              onChange={e => handleVehiculeChange(e)}
              placeholder="Ajouter une préférence"
              className="input input-bordered px-3 py-2 rounded border"
            />
            <button
              type="button"
              onClick={handleAddPreference}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {vehiculeForm.preferences.autres.map((pref: string, idx: number) => (
              <span
                key={idx}
                className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
              >
                {pref}{' '}
                <button
                  type="button"
                  onClick={() => handleRemovePreference(pref)}
                  className="text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2"
        >
          Ajouter le véhicule
        </button>
        {vehiculeError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
            {vehiculeError}
          </div>
        )}
        {vehiculeMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
            {vehiculeMessage}
          </div>
        )}
      </form>
    </section>
  );
}
