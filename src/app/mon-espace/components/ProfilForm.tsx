import React from 'react';
import type { Profil } from '../typesMonEspace';
import PrimaryButton from './PrimaryButton';

type ProfilFormProps = {
  profil: Profil;
  profilLoading: boolean;
  profilMessage: string;
  profilError: string;
  handleProfilChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function ProfilForm({
  profil,
  profilLoading,
  profilMessage,
  profilError,
  handleProfilChange,
}: ProfilFormProps) {
  return (
    <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6 space-y-8">
      <h2 className="text-xl font-semibold mb-6 text-green-700">Informations personnelles</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="civilite">
              Civilité
            </label>
            <select
              id="civilite"
              name="civilite"
              value={profil.civilite ?? ''}
              onChange={handleProfilChange}
              className="select select-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            >
              <option value="">Sélectionner</option>
              <option value="Monsieur">Monsieur</option>
              <option value="Madame">Madame</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="pseudo">
              Pseudo
            </label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              value={profil.pseudo}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="nom">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={profil.nom}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              placeholder="ex : Dupont"
              required
            />
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="prenom">
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              value={profil.prenom}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              pattern="[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*"
              placeholder="ex: Jean ou Jean-Pierre"
              required
            />
            <div className="text-xs text-green-600 mt-1">
              Format : lettres uniquement, tiret (-) optionnel pour les prénoms composés
            </div>
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profil.email}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 break-all"
              style={{ wordBreak: 'break-all' }}
              required
            />
            <div className="text-xs text-green-600 mt-1">
              Votre adresse email ne sera pas affichée publiquement.
            </div>
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              value={profil.telephone}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              pattern="\d{10}"
              maxLength={10}
              placeholder="ex: 0612345678"
              required
            />
            <div className="text-xs text-green-600 mt-1">Format : 10 chiffres (ex: 0612345678)</div>
          </div>
          <div className="md:col-span-2">
            <label className="font-medium mb-2 block text-gray-700" htmlFor="adresse">
              Adresse
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              value={profil.adresse}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              pattern="[A-Za-zÀ-ÿ0-9-\s]+"
              placeholder="ex: 123 rue de la Paix"
              required
            />
            <div className="text-xs text-green-600 mt-1">
              Format : lettres, chiffres et tiret (-) uniquement
            </div>
          </div>
          <div>
            <label className="font-medium mb-2 block text-gray-700" htmlFor="date_naissance">
              Date de naissance
            </label>
            <input
              id="date_naissance"
              name="date_naissance"
              type="date"
              value={profil.date_naissance}
              onChange={handleProfilChange}
              className="input input-bordered w-full bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              required
            />
          </div>
        </div>
        <PrimaryButton type="submit" loading={profilLoading} className="w-full mt-4">
          Enregistrer les modifications
        </PrimaryButton>
        {profilError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
            {profilError}
          </div>
        )}
        {profilMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
            {profilMessage}
          </div>
        )}
      </div>
    </div>
  );
}
