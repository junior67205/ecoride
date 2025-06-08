import { useState, useEffect } from 'react';
import { Vehicule, Marque } from '../typesMonEspace';

export function useVehicules(typeUtilisateur: string) {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [vehiculesLoading, setVehiculesLoading] = useState(false);
  const [vehiculeForm, setVehiculeForm] = useState({
    immatriculation: '',
    date_premiere_immatriculation: '',
    modele: '',
    couleur: '',
    marque_id: '',
    nb_place: '',
    preferences: { fumeur: false, animal: false, girl_only: false, autres: [] as string[] },
    nouvellePreference: '',
  });
  const [vehiculeMessage, setVehiculeMessage] = useState('');
  const [vehiculeError, setVehiculeError] = useState('');
  const [marques, setMarques] = useState<Marque[]>([]);

  useEffect(() => {
    if (typeUtilisateur === 'chauffeur' || typeUtilisateur === 'les deux') {
      fetchVehicules();
    }
  }, [typeUtilisateur]);

  useEffect(() => {
    fetch('/api/marque')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMarques(data);
      });
  }, []);

  const fetchVehicules = async () => {
    setVehiculesLoading(true);
    const res = await fetch('/api/mon-espace/vehicules');
    const data = await res.json();
    if (!data.error) setVehicules(data);
    setVehiculesLoading(false);
  };

  const handleVehiculeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    if (name === 'fumeur' || name === 'animal' || name === 'girl_only') {
      setVehiculeForm({
        ...vehiculeForm,
        preferences: { ...vehiculeForm.preferences, [name]: checked },
      });
    } else if (name === 'marque_id') {
      setVehiculeForm({ ...vehiculeForm, marque_id: value });
    } else {
      setVehiculeForm({ ...vehiculeForm, [name]: value });
    }
  };

  const handleAddPreference = () => {
    if (vehiculeForm.nouvellePreference.trim()) {
      setVehiculeForm({
        ...vehiculeForm,
        preferences: {
          ...vehiculeForm.preferences,
          autres: [...vehiculeForm.preferences.autres, vehiculeForm.nouvellePreference.trim()],
        },
        nouvellePreference: '',
      });
    }
  };

  const handleRemovePreference = (pref: string) => {
    setVehiculeForm({
      ...vehiculeForm,
      preferences: {
        ...vehiculeForm.preferences,
        autres: vehiculeForm.preferences.autres.filter(p => p !== pref),
      },
    });
  };

  const handleVehiculeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehiculeMessage('');
    setVehiculeError('');
    // Validation du format d'immatriculation
    const immatRegex = /^\d{2}-[A-Z]{3}-\d{2}$/;
    if (!immatRegex.test(vehiculeForm.immatriculation)) {
      setVehiculeError(
        "Le format de l'immatriculation doit être 00-XXX-00 (2 chiffres, 3 lettres majuscules, 2 chiffres)."
      );
      return;
    }
    // Validation du format de la couleur (lettres uniquement)
    const couleurRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!couleurRegex.test(vehiculeForm.couleur)) {
      setVehiculeError('La couleur ne doit contenir que des lettres.');
      return;
    }
    // Validation du format du modèle (lettres et/ou chiffres uniquement)
    const modeleRegex = /^[A-Za-z0-9À-ÿ\s-]+$/;
    if (!modeleRegex.test(vehiculeForm.modele)) {
      setVehiculeError('Le modèle ne doit contenir que des lettres et/ou des chiffres.');
      return;
    }
    if (
      !vehiculeForm.immatriculation ||
      !vehiculeForm.date_premiere_immatriculation ||
      !vehiculeForm.modele ||
      !vehiculeForm.couleur ||
      !vehiculeForm.marque_id ||
      !vehiculeForm.nb_place
    ) {
      setVehiculeError('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    try {
      const res = await fetch('/api/mon-espace/vehicules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vehiculeForm,
          nb_place: Number(vehiculeForm.nb_place),
          marque_id: Number(vehiculeForm.marque_id),
          preferences: vehiculeForm.preferences,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVehiculeMessage('Véhicule ajouté avec succès.');
        setVehiculeForm({
          immatriculation: '',
          date_premiere_immatriculation: '',
          modele: '',
          couleur: '',
          marque_id: '',
          nb_place: '',
          preferences: { fumeur: false, animal: false, girl_only: false, autres: [] },
          nouvellePreference: '',
        });
        fetchVehicules();
      } else {
        setVehiculeError(data.error || "Erreur lors de l'ajout.");
      }
    } catch (err) {
      console.error('Erreur lors de la gestion véhicule:', err);
      setVehiculeError(err instanceof Error ? err.message : 'Erreur réseau ou serveur.');
    }
  };

  const handleDeleteVehicule = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
    setVehiculeError('');
    setVehiculeMessage('');
    try {
      const res = await fetch('/api/mon-espace/vehicules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setVehiculeMessage(data.message || 'Véhicule supprimé.');
        fetchVehicules();
      } else {
        setVehiculeError(data.error || 'Erreur lors de la suppression.');
      }
    } catch {
      setVehiculeError('Erreur réseau ou serveur.');
    }
  };

  return {
    vehicules,
    setVehicules,
    vehiculesLoading,
    vehiculeForm,
    setVehiculeForm,
    vehiculeMessage,
    setVehiculeMessage,
    vehiculeError,
    setVehiculeError,
    marques,
    fetchVehicules,
    handleVehiculeChange,
    handleVehiculeSubmit,
    handleDeleteVehicule,
    handleAddPreference,
    handleRemovePreference,
  };
}
