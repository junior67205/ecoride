import { Profil } from './typesMonEspace';
import { FaUserEdit, FaCarSide } from 'react-icons/fa';
import React from 'react';

type SidebarMonEspaceProps = {
  section: 'profil' | 'role' | 'vehicules' | 'voyages';
  setSection: (s: 'profil' | 'role' | 'vehicules' | 'voyages') => void;
  profil: Profil;
  signOut: () => void;
  photoPreview: string;
  avatar: React.ReactNode;
};

export default function SidebarMonEspace({
  section,
  setSection,
  profil,
  signOut,
  photoPreview,
  avatar,
}: SidebarMonEspaceProps) {
  return (
    <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2">
          {photoPreview ? (
            <img src={photoPreview} alt="Aperçu" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            avatar
          )}
        </div>
        <div className="font-bold text-lg">{profil.pseudo || 'Utilisateur'}</div>
        <div className="text-gray-500 text-sm">{profil.email}</div>
        <div className="text-green-700 text-sm font-semibold mt-1">
          {profil.credit ?? 0} crédit{(profil.credit ?? 0) > 1 ? 's' : ''}
        </div>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'profil' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('profil')}
        >
          <FaUserEdit /> Profil
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'role' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('role')}
        >
          <FaCarSide /> Rôle
        </button>
        {(profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') && (
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'voyages' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setSection('voyages')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.447 2.105a2 2 0 0 1 1.106 0l5 1.429A2 2 0 0 1 17 5.429v10.285a2 2 0 0 1-1.447 1.895l-5 1.429a2 2 0 0 1-1.106 0l-5-1.429A2 2 0 0 1 3 15.714V5.429a2 2 0 0 1 1.447-1.895l5-1.429zM11 4.13V16.13l4-1.143V2.987l-4 1.143zm-2 0l-4 1.143v12l4-1.143V4.13z" />
            </svg>
            Voyages
          </button>
        )}
        {(profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') && (
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'vehicules' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setSection('vehicules')}
          >
            🚗 Véhicules
          </button>
        )}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded transition text-left mt-8 bg-red-100 text-red-700 hover:bg-red-200"
          onClick={signOut}
        >
          Se déconnecter
        </button>
      </nav>
    </aside>
  );
}
