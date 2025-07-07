import {
  UserIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface User {
  pseudo?: string;
  email?: string;
  type?: string;
}

interface SidebarEspaceAdminProps {
  section:
    | 'profil'
    | 'gestion-employes'
    | 'statistiques'
    | 'gestion-comptes'
    | 'avis'
    | 'problemes'
    | 'configuration'
    | 'galerie';
  setSection: (
    section:
      | 'profil'
      | 'gestion-employes'
      | 'statistiques'
      | 'gestion-comptes'
      | 'avis'
      | 'problemes'
      | 'configuration'
      | 'galerie'
  ) => void;
  signOut: () => void;
  user: User;
}

export default function SidebarEspaceAdmin({
  section,
  setSection,
  signOut,
  user,
}: SidebarEspaceAdminProps) {
  return (
    <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2">
          <UserIcon className="h-8 w-8" />
        </div>
        <div className="font-bold text-lg">{user?.pseudo || 'Admin'}</div>
        <div className="text-gray-500 text-sm">{user?.email}</div>
        <div className="text-blue-700 text-sm font-semibold mt-1">Espace Administrateur</div>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'profil' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('profil')}
        >
          <Cog6ToothIcon className="h-5 w-5" />
          Mon Profil
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'gestion-employes'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('gestion-employes')}
        >
          <UsersIcon className="h-5 w-5" />
          Gestion des employés
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'statistiques'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('statistiques')}
        >
          <ChartBarIcon className="h-5 w-5" />
          Statistiques
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'gestion-comptes'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('gestion-comptes')}
        >
          <CurrencyDollarIcon className="h-5 w-5" />
          Gestion des comptes
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'avis' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('avis')}
        >
          <DocumentTextIcon className="h-5 w-5" />
          Validation des Avis
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'problemes' ? 'bg-red-100 text-red-700 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('problemes')}
        >
          <ExclamationTriangleIcon className="h-5 w-5" />
          Covoiturages Problématiques
        </button>

        <hr className="my-2" />

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'configuration'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('configuration')}
        >
          <WrenchScrewdriverIcon className="h-5 w-5" />
          Configuration
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${
            section === 'galerie' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSection('galerie')}
        >
          <PhotoIcon className="h-5 w-5" />
          Galerie
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
