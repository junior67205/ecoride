import { useState } from 'react';
import type { Profil, Vehicule } from '../typesMonEspace';

type UseFetchProfilReturn = {
  role: string | null;
  setRole: (role: string | null) => void;
  message: string;
  setMessage: (message: string) => void;
  error: string;
  setError: (error: string) => void;
  roleError: string;
  setRoleError: (error: string) => void;
  roleSuccess: string;
  setRoleSuccess: (message: string) => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
  editRole: boolean;
  setEditRole: (edit: boolean) => void;
  handleSelect: (
    selectedRole: string,
    setProfil: (profil: Profil) => void,
    fetchVehicules: () => void,
    vehicules: Vehicule[]
  ) => Promise<void>;
  fetchProfil: (setProfil: (profil: Profil) => void) => Promise<void>;
};

export function useFetchProfil(): UseFetchProfilReturn {
  const [role, setRole] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [roleSuccess, setRoleSuccess] = useState('');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [editRole, setEditRole] = useState(false);

  const handleSelect = async (
    selectedRole: string,
    setProfil: (profil: Profil) => void,
    fetchVehicules: () => void,
    vehicules: Vehicule[]
  ) => {
    setRole(selectedRole);
    setMessage('');
    setError('');
    setRoleError('');
    setRoleSuccess('');
    try {
      const res = await fetch('/api/mon-espace/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type_utilisateur: selectedRole }),
      });
      if (res.status === 401) {
        const contentType = res.headers.get('content-type');
        if (
          !contentType ||
          (!contentType.includes('application/json') && !contentType.includes('text/plain'))
        ) {
          throw new Error('Réponse du serveur invalide (pas du JSON)');
        }
        await res.json();
        window.location.href = '/connexion?callbackUrl=' + encodeURIComponent(window.location.href);
        return;
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Réponse du serveur invalide (pas du JSON)');
      }
      const data = await res.json();
      if (res.ok) {
        setRoleSuccess(data.message || 'Rôle enregistré avec succès.');
        const profilRes = await fetch('/api/mon-espace/profil');
        if (profilRes.status === 401) {
          const profilContentType = profilRes.headers.get('content-type');
          if (
            !profilContentType ||
            (!profilContentType.includes('application/json') &&
              !profilContentType.includes('text/plain'))
          ) {
            throw new Error('Réponse du serveur invalide (pas du JSON)');
          }
          await profilRes.json();
          window.location.href =
            '/connexion?callbackUrl=' + encodeURIComponent(window.location.href);
          return;
        }
        const profilContentType = profilRes.headers.get('content-type');
        if (!profilContentType || !profilContentType.includes('application/json')) {
          throw new Error('Réponse du serveur invalide (pas du JSON)');
        }
        const profilData = await profilRes.json();
        if (!profilData.error) {
          setProfil(profilData);
          setCurrentRole(profilData.type_utilisateur);
          if (profilData.type_utilisateur !== 'passager') {
            fetchVehicules();
          }
        }
        setEditRole(false);
        if (
          (selectedRole === 'chauffeur' || selectedRole === 'les deux') &&
          vehicules.length === 0
        ) {
          // Note: La redirection vers la section véhicules devra être gérée dans le composant parent
        }
      } else {
        setRoleError(data.error || 'Erreur lors de la sauvegarde.');
      }
    } catch (err) {
      console.error('Erreur lors du changement de rôle:', err);
      setRoleError(err instanceof Error ? err.message : 'Erreur réseau ou serveur.');
    }
  };

  const fetchProfil = async (setProfil: (profil: Profil) => void) => {
    const res = await fetch('/api/mon-espace/profil');
    if (res.status === 401) {
      const contentType = res.headers.get('content-type');
      if (
        !contentType ||
        (!contentType.includes('application/json') && !contentType.includes('text/plain'))
      ) {
        throw new Error('Réponse du serveur invalide (pas du JSON)');
      }
      await res.json();
      window.location.href = '/connexion?callbackUrl=' + encodeURIComponent(window.location.href);
      return;
    }
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Réponse du serveur invalide (pas du JSON)');
    }
    const data = await res.json();
    if (!data.error) setProfil(data);
  };

  return {
    role,
    setRole,
    message,
    setMessage,
    error,
    setError,
    roleError,
    setRoleError,
    roleSuccess,
    setRoleSuccess,
    currentRole,
    setCurrentRole,
    editRole,
    setEditRole,
    handleSelect,
    fetchProfil,
  };
}
