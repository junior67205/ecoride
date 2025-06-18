import React from 'react';
import type { VehiculeForm, Marque, Profil } from '../typesMonEspace';
import PrimaryButton from './PrimaryButton';

type VehiculeFormProps = {
  vehiculeForm: VehiculeForm;
  marques: Marque[];
  profil: Profil;
  handleVehiculeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleVehiculeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleAddPreference: () => void;
  handleRemovePreference: (pref: string) => void;
  vehiculeError: string;
  vehiculeMessage: string;
};

export default function VehiculeForm({
  vehiculeForm,
  marques,
  profil,
  handleVehiculeChange,
  handleVehiculeSubmit,
  handleAddPreference,
  handleRemovePreference,
  vehiculeError,
  vehiculeMessage,
}: VehiculeFormProps) {
  return (
    <form
      onSubmit={handleVehiculeSubmit}
      className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6 space-y-8"
    >
      <h2 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 13.5V6a1 1 0 011-1h16a1 1 0 011 1v7.5M16 17.5a4 4 0 01-8 0"
          />
        </svg>
        Mon véhicule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Immatriculation */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="immatriculation">
            Immatriculation
          </label>
          <input
            id="immatriculation"
            name="immatriculation"
            placeholder="ex : 26-HEH-67"
            value={vehiculeForm.immatriculation}
            onChange={handleVehiculeChange}
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>
        {/* Date de première immatriculation */}
        <div>
          <label
            className="font-medium mb-2 block text-gray-700"
            htmlFor="date_premiere_immatriculation"
          >
            Date de première immatriculation
          </label>
          <input
            type="date"
            id="date_premiere_immatriculation"
            name="date_premiere_immatriculation"
            value={vehiculeForm.date_premiere_immatriculation}
            onChange={handleVehiculeChange}
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>
        {/* Modèle */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="modele">
            Modèle
          </label>
          <input
            id="modele"
            name="modele"
            placeholder="ex : Clio 4"
            value={vehiculeForm.modele}
            onChange={handleVehiculeChange}
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>
        {/* Couleur */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="couleur">
            Couleur
          </label>
          <input
            id="couleur"
            name="couleur"
            placeholder="ex : Grise"
            value={vehiculeForm.couleur}
            onChange={handleVehiculeChange}
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>
        {/* Marque */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="marque_id">
            Marque
          </label>
          <select
            id="marque_id"
            name="marque_id"
            value={vehiculeForm.marque_id ?? ''}
            onChange={handleVehiculeChange}
            className="select select-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          >
            <option value="">Sélectionner une marque</option>
            {marques.map(m => (
              <option key={m.marque_id} value={m.marque_id}>
                {m.libelle}
              </option>
            ))}
          </select>
        </div>
        {/* Nombre de places */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="nb_place">
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
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          />
        </div>
        {/* Energie */}
        <div>
          <label className="font-medium mb-2 block text-gray-700" htmlFor="energie">
            Énergie
          </label>
          <select
            id="energie"
            name="energie"
            value={vehiculeForm.energie || ''}
            onChange={handleVehiculeChange}
            className="select select-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            required
          >
            <option value="">Sélectionner une énergie</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybride">Hybride</option>
            <option value="Electrique">Électrique</option>
          </select>
        </div>
      </div>
      {/* Préférences */}
      <div className="mt-6">
        <div className="flex gap-4 items-center flex-wrap">
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
        <div className="mb-2 mt-4 font-medium text-gray-700">Autres préférences :</div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={vehiculeForm.nouvellePreference}
            onChange={e => handleVehiculeChange(e)}
            placeholder="Ajouter une préférence"
            className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
          />
          <button type="button" onClick={handleAddPreference} className="btn btn-outline">
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {vehiculeForm.preferences.autres.map((pref: string, idx: number) => (
            <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
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
      <PrimaryButton type="submit" className="w-full mt-4">
        Ajouter le véhicule
      </PrimaryButton>
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
      {/* Exemple d'aide */}
      <div className="text-xs text-green-600 mt-1">
        Ajoutez ici les informations de votre véhicule.
      </div>
    </form>
  );
}
