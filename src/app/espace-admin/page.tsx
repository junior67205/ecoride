'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import SidebarEspaceAdmin from './components/SidebarEspaceAdmin';
import GestionEmployesSection from './components/GestionEmployesSection';
import StatistiquesSection from './components/StatistiquesSection';
import GestionComptesSection from './components/GestionComptesSection';
import AvisSection from '../espace-employe/components/AvisSection';
import ProblemesSection from '../espace-employe/components/ProblemesSection';
import ProfilSection from '../components/ProfilSection';
import ConfigurationSection from './components/ConfigurationSection';
import GalerieSection from './components/GalerieSection';
import MaintenanceIndicator from './components/MaintenanceIndicator';

export default function EspaceAdmin() {
  const { data: session, status } = useSession();
  const [section, setSection] = useState<
    | 'profil'
    | 'gestion-employes'
    | 'statistiques'
    | 'gestion-comptes'
    | 'avis'
    | 'problemes'
    | 'configuration'
    | 'galerie'
  >('profil');

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

  if (session.user?.type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Accès non autorisé.</p>
          <p className="mt-2">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <MaintenanceIndicator />
      <SidebarEspaceAdmin
        section={section}
        setSection={setSection}
        signOut={() => signOut({ callbackUrl: '/' })}
        user={session.user}
      />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Espace Administrateur</h1>

        {section === 'profil' && <ProfilSection />}
        {section === 'gestion-employes' && <GestionEmployesSection />}
        {section === 'statistiques' && <StatistiquesSection />}
        {section === 'gestion-comptes' && <GestionComptesSection />}
        {section === 'avis' && <AvisSection />}
        {section === 'problemes' && <ProblemesSection />}
        {section === 'configuration' && <ConfigurationSection />}
        {section === 'galerie' && <GalerieSection />}
      </main>
    </div>
  );
}
