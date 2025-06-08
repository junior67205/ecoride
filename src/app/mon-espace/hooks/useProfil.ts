import { useState, useEffect } from 'react';

export function useProfil() {
  const [profil, setProfil] = useState({
    civilite: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    date_naissance: '',
    pseudo: '',
    type_utilisateur: '',
    photo: '',
    credit: 0,
  });
  const [profilMessage, setProfilMessage] = useState('');
  const [profilError, setProfilError] = useState('');
  const [profilLoading, setProfilLoading] = useState(false);

  useEffect(() => {
    fetch('/api/mon-espace/profil')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProfil({
            civilite: data.civilite || '',
            nom: data.nom || '',
            prenom: data.prenom || '',
            email: data.email || '',
            telephone: data.telephone || '',
            adresse: data.adresse || '',
            date_naissance: data.date_naissance || '',
            pseudo: data.pseudo || '',
            type_utilisateur: data.type_utilisateur || '',
            photo: data.photo || '',
            credit: data.credit ?? 0,
          });
        }
      });
  }, []);

  const handleProfilChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handleProfilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilMessage('');
    setProfilError('');

    // Validation du nom (lettres et tiret uniquement)
    const nameRegex = /^[A-Za-zÀ-ÿ-]+$/;
    if (!nameRegex.test(profil.nom)) {
      setProfilError('Le nom ne doit contenir que des lettres et le tiret (-).');
      return;
    }

    // Validation du prénom (lettres uniquement, tiret optionnel)
    const prenomRegex = /^[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*$/;
    if (!prenomRegex.test(profil.prenom)) {
      setProfilError(
        'Le prénom ne doit contenir que des lettres. Le tiret (-) est optionnel pour les prénoms composés.'
      );
      return;
    }

    // Validation du téléphone (10 chiffres uniquement)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(profil.telephone)) {
      setProfilError('Le numéro de téléphone doit contenir exactement 10 chiffres.');
      return;
    }

    // Validation de l'adresse (lettres, chiffres et tiret uniquement)
    const addressRegex = /^[A-Za-zÀ-ÿ0-9-\s]+$/;
    if (!addressRegex.test(profil.adresse)) {
      setProfilError("L'adresse ne doit contenir que des lettres, des chiffres et le tiret (-).");
      return;
    }

    setProfilLoading(true);
    try {
      const res = await fetch('/api/mon-espace/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profil),
      });
      const data = await res.json();
      if (res.ok) {
        setProfilMessage(data.message || 'Profil mis à jour avec succès.');
      } else {
        setProfilError(data.error || 'Erreur lors de la mise à jour.');
      }
    } catch {
      setProfilError('Erreur réseau ou serveur.');
    } finally {
      setProfilLoading(false);
    }
  };

  return {
    profil,
    setProfil,
    profilMessage,
    setProfilMessage,
    profilError,
    setProfilError,
    profilLoading,
    setProfilLoading,
    handleProfilChange,
    handleProfilSubmit,
  };
}
