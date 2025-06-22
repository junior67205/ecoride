import { UserIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface User {
  pseudo?: string;
  email?: string;
  type?: string;
}

interface SidebarEspaceEmployeProps {
  section: 'avis' | 'problemes';
  setSection: (section: 'avis' | 'problemes') => void;
  signOut: () => void;
  user: User;
}

export default function SidebarEspaceEmploye({
  section,
  setSection,
  signOut,
  user,
}: SidebarEspaceEmployeProps) {
  return (
    <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2">
          <UserIcon className="h-8 w-8" />
        </div>
        <div className="font-bold text-lg">{user?.pseudo || 'Employé'}</div>
        <div className="text-gray-500 text-sm">{user?.email}</div>
        <div className="text-green-700 text-sm font-semibold mt-1">Espace Employé</div>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
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
