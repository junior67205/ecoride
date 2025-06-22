'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import SidebarEspaceEmploye from './components/SidebarEspaceEmploye';
import AvisSection from './components/AvisSection';
import ProblemesSection from './components/ProblemesSection';

export default function EspaceEmploye() {
  const { data: session, status } = useSession();
  const [section, setSection] = useState<'avis' | 'problemes'>('avis');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <p className="mt-2">Merci de vous connecter.</p>
        </div>
      </div>
    );
  }

  // Vérifier que l'utilisateur est un employé
  if (session.user?.type !== 'employe' && session.user?.type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Accès non autorisé.</p>
          <p className="mt-2">Vous devez être employé pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SidebarEspaceEmploye
        section={section}
        setSection={setSection}
        signOut={() => signOut({ callbackUrl: '/' })}
        user={session.user}
      />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Espace Employé</h1>

        {section === 'avis' && <AvisSection />}
        {section === 'problemes' && <ProblemesSection />}
      </main>
    </div>
  );
}
