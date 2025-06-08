import { useState } from 'react';

export function useVoyages() {
  const [voyageForm, setVoyageForm] = useState({
    depart: '',
    arrivee: '',
    dateDepart: '',
    heureDepart: '',
    dateArrivee: '',
    heureArrivee: '',
    prix: '',
    vehiculeId: '',
    nb_place: '',
  });
  const [voyageMessage, setVoyageMessage] = useState('');
  const [voyageError, setVoyageError] = useState('');
  const [voyageLoading, setVoyageLoading] = useState(false);
  const [showVoyageForm, setShowVoyageForm] = useState(false);

  const handleVoyageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVoyageMessage('');
    setVoyageError('');
    if (
      !voyageForm.depart ||
      !voyageForm.arrivee ||
      !voyageForm.dateDepart ||
      !voyageForm.heureDepart ||
      !voyageForm.dateArrivee ||
      !voyageForm.heureArrivee ||
      !voyageForm.prix ||
      !voyageForm.vehiculeId
    ) {
      setVoyageError('Tous les champs sont obligatoires.');
      return;
    }
    if (Number(voyageForm.prix) <= 2) {
      setVoyageError('Le prix doit être supérieur à 2 crédits.');
      return;
    }
    if (voyageForm.nb_place && Number(voyageForm.nb_place) <= 0) {
      setVoyageError('Le nombre de places doit être supérieur à 0.');
      return;
    }
    setVoyageLoading(true);
    try {
      const res = await fetch('/api/mon-espace/voyages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depart: voyageForm.depart,
          arrivee: voyageForm.arrivee,
          dateDepart: voyageForm.dateDepart,
          heureDepart: voyageForm.heureDepart,
          dateArrivee: voyageForm.dateArrivee,
          heureArrivee: voyageForm.heureArrivee,
          prix: Number(voyageForm.prix),
          vehiculeId: voyageForm.vehiculeId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoyageMessage('Voyage créé avec succès !');
        setShowVoyageForm(false);
        setVoyageForm({
          depart: '',
          arrivee: '',
          dateDepart: '',
          heureDepart: '',
          dateArrivee: '',
          heureArrivee: '',
          prix: '',
          vehiculeId: '',
          nb_place: '',
        });
      } else {
        setVoyageError(data.error || 'Erreur lors de la création du voyage.');
      }
    } catch (err) {
      console.error('Erreur lors de la création du voyage:', err);
      setVoyageError(err instanceof Error ? err.message : 'Erreur réseau ou serveur.');
    } finally {
      setVoyageLoading(false);
    }
  };

  return {
    voyageForm,
    setVoyageForm,
    voyageMessage,
    setVoyageMessage,
    voyageError,
    setVoyageError,
    voyageLoading,
    setVoyageLoading,
    showVoyageForm,
    setShowVoyageForm,
    handleVoyageSubmit,
  };
}
