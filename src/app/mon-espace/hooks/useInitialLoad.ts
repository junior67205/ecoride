import { useEffect, useState } from 'react';
import type { Profil } from '../typesMonEspace';

type UseInitialLoadReturn = {
  isLoading: boolean;
  error: string | null;
};

export function useInitialLoad(
  fetchProfil: (setProfil: (profil: Profil) => void) => Promise<void>,
  setProfil: (profil: Profil) => void,
  fetchVehicules: () => void,
  typeUtilisateur: string
): UseInitialLoadReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await fetchProfil(setProfil);
        if (typeUtilisateur !== 'passager') {
          await fetchVehicules();
        }
      } catch (err) {
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          setError('Impossible de contacter le serveur. Vérifiez votre connexion ou votre session.');
        } else {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [typeUtilisateur]);

  return { isLoading, error };
}
