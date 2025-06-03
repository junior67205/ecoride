import React from 'react';
import { Profil } from './typesMonEspace';

type ProfilSectionProps = {
  profil: Profil;
  profilMessage: string;
  profilError: string;
  profilLoading: boolean;
  handleProfilChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleProfilSubmit: (e: React.FormEvent) => void;
  photoPreview: string;
  photoFile: File | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: () => void;
  handlePhotoDelete: () => void;
  photoError: string;
  showPasswordForm: boolean;
  setShowPasswordForm: (show: boolean) => void;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  handlePasswordSubmit: (e: React.FormEvent) => void;
  passwordError: string;
  passwordMessage: string;
  passwordLoading: boolean;
  avatar: React.ReactNode;
  setOldPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
};

export default function ProfilSection({
  profil,
  profilMessage,
  profilError,
  profilLoading,
  handleProfilChange,
  handleProfilSubmit,
  photoPreview,
  photoFile,
  handlePhotoChange,
  handlePhotoUpload,
  handlePhotoDelete,
  photoError,
  showPasswordForm,
  setShowPasswordForm,
  oldPassword,
  newPassword,
  confirmPassword,
  handlePasswordSubmit,
  passwordError,
  passwordMessage,
  passwordLoading,
  avatar,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
}: ProfilSectionProps) {
  return (
    <section className="max-w-xl mx-auto mb-10">
      <h2 className="text-xl font-semibold mb-4">Mes informations personnelles</h2>
      <form
        onSubmit={handleProfilSubmit}
        className="flex flex-col gap-3 bg-white rounded shadow p-6"
      >
        <div className="flex flex-col items-center gap-4 mb-4">
          {photoPreview ? (
            <img src={photoPreview} alt="Aperçu" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            avatar
          )}
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Choisir une photo
            </label>
            {photoFile && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  disabled={profilLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {profilLoading ? 'Téléchargement...' : 'Télécharger'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    /* annuler la photo */
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Annuler
                </button>
              </div>
            )}
            {profil.photo && !photoFile && (
              <button
                type="button"
                onClick={handlePhotoDelete}
                disabled={profilLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {profilLoading ? 'Suppression...' : 'Supprimer la photo'}
              </button>
            )}
            {photoError && <div className="text-red-600 text-sm">{photoError}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium mb-1 block" htmlFor="civilite">
              Civilité
            </label>
            <select
              id="civilite"
              name="civilite"
              value={profil.civilite}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              required
            >
              <option value="">Sélectionner</option>
              <option value="Monsieur">Monsieur</option>
              <option value="Madame">Madame</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="pseudo">
              Pseudo
            </label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              value={profil.pseudo}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              required
            />
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="nom">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={profil.nom}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              placeholder="ex : Dupont"
              required
            />
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="prenom">
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              value={profil.prenom}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              pattern="[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*"
              placeholder="ex: Jean ou Jean-Pierre"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Format : lettres uniquement, tiret (-) optionnel pour les prénoms composés
            </div>
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profil.email}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border break-all"
              style={{ wordBreak: 'break-all' }}
              required
            />
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              value={profil.telephone}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              pattern="\d{10}"
              maxLength={10}
              placeholder="ex: 0612345678"
              required
            />
            <div className="text-xs text-gray-500 mt-1">Format : 10 chiffres (ex: 0612345678)</div>
          </div>
          <div className="md:col-span-2">
            <label className="font-medium mb-1 block" htmlFor="adresse">
              Adresse
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              value={profil.adresse}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              pattern="[A-Za-zÀ-ÿ0-9-\s]+"
              placeholder="ex: 123 rue de la Paix"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Format : lettres, chiffres et tiret (-) uniquement
            </div>
          </div>
          <div>
            <label className="font-medium mb-1 block" htmlFor="date_naissance">
              Date de naissance
            </label>
            <input
              id="date_naissance"
              name="date_naissance"
              type="date"
              value={profil.date_naissance}
              onChange={handleProfilChange}
              className="input input-bordered w-full px-3 py-2 rounded border"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={profilLoading}
          className="btn btn-primary bg-green-600 text-white rounded py-2 mt-4 w-full"
        >
          {profilLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
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
      </form>
      <div className="mt-8">
        <button
          className="text-blue-600 underline"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? 'Annuler' : 'Modifier mon mot de passe'}
        </button>
        {showPasswordForm && (
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col gap-3 bg-gray-50 rounded shadow p-6 mt-4"
          >
            <input
              type="password"
              placeholder="Ancien mot de passe"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="input input-bordered px-3 py-2 rounded border"
              required
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="input input-bordered px-3 py-2 rounded border"
              required
            />
            <input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="input input-bordered px-3 py-2 rounded border"
              required
            />
            <div className="text-xs text-gray-500 mb-2">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.
            </div>
            <button
              type="submit"
              className="btn btn-primary bg-green-600 text-white rounded py-2 mt-2"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Changement...' : 'Valider le changement'}
            </button>
            {passwordError && (
              <div className="text-red-600 text-center text-sm">{passwordError}</div>
            )}
            {passwordMessage && (
              <div className="text-green-600 text-center text-sm">{passwordMessage}</div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
