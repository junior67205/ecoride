import { useState, useCallback } from 'react';
import type { Covoiturage } from '../typesMonEspace';

export function useHistorique() {
  const [historique, setHistorique] = useState<Covoiturage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorique = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mon-espace/historique');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la récupération de l'historique");
      }
      setHistorique(data.historique);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnnulation = useCallback(
    async (covoiturageId: number) => {
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
        fetchHistorique();
      } catch {
        // Laisse la gestion du toast à l'appelant si besoin
      }
    },
    [fetchHistorique]
  );

  return {
    historique,
    loading,
    error,
    fetchHistorique,
    handleAnnulation,
    setHistorique,
    setError,
    setLoading,
  };
}
