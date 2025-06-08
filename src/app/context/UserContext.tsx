'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Covoiturage } from '@/app/mon-espace/typesMonEspace';

interface UserContextType {
  credit: number;
  setCredit: (credit: number) => void;
  refreshProfil: () => Promise<void>;
  refreshHistorique: () => Promise<void>;
  historique: Covoiturage[];
  historiqueLoading: boolean;
  historiqueError: string | null;
  handleAnnulation: (covoiturageId: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [credit, setCredit] = useState(0);
  const [historique, setHistorique] = useState<Covoiturage[]>([]);
  const [historiqueLoading, setHistoriqueLoading] = useState(true);
  const [historiqueError, setHistoriqueError] = useState<string | null>(null);

  // Fonction pour rafraîchir le profil (crédits)
  const refreshProfil = async () => {
    try {
      const res = await fetch('/api/mon-espace/profil');
      const data = await res.json();
      if (!data.error) {
        setCredit(data.credit);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
    }
  };

  // Fonction pour rafraîchir l'historique
  const refreshHistorique = async () => {
    setHistoriqueLoading(true);
    setHistoriqueError(null);
    try {
      const response = await fetch('/api/mon-espace/historique');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la récupération de l'historique");
      }
      setHistorique(data.historique);
    } catch (err) {
      setHistoriqueError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setHistoriqueLoading(false);
    }
  };

  const handleAnnulation = async (covoiturageId: number) => {
    if (
      !confirm(
        'Êtes-vous sûr de vouloir annuler ce covoiturage ? Les participants seront remboursés.'
      )
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/mon-espace/covoiturage/${covoiturageId}/annuler`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'annulation du covoiturage");
      }
      await refreshHistorique();
      await refreshProfil();
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        credit,
        setCredit,
        refreshProfil,
        refreshHistorique,
        historique,
        historiqueLoading,
        historiqueError,
        handleAnnulation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser doit être utilisé à l'intérieur d'un UserProvider");
  }
  return context;
}
