import { Profil } from './typesMonEspace';
import React from 'react';
import { useUser } from '@/app/context/UserContext';

type SidebarMonEspaceProps = {
  section: 'profil' | 'role' | 'vehicules' | 'voyages' | 'historique';
  setSection: (s: 'profil' | 'role' | 'vehicules' | 'voyages' | 'historique') => void;
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
  const { credit } = useUser();

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
          {credit} crédit{credit > 1 ? 's' : ''}
        </div>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'profil' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('profil')}
        >
          Profil
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'role' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('role')}
        >
          Rôle
        </button>
        {(profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') && (
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'vehicules' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setSection('vehicules')}
          >
            Véhicules
          </button>
        )}
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'voyages' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('voyages')}
        >
          Voyages
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'historique' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          onClick={() => setSection('historique')}
        >
          Historique
        </button>
      </nav>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded transition text-left mt-8 bg-red-100 text-red-700 hover:bg-red-200"
        onClick={signOut}
      >
        Se déconnecter
      </button>
    </aside>
  );
}
