import { useState } from 'react';
import type { Profil } from '../typesMonEspace';

type UsePhotoReturn = {
  photoFile: File | null;
  photoPreview: string;
  photoError: string;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: (setProfil: (profil: (prev: Profil) => Profil) => void) => Promise<void>;
  handlePhotoDelete: (setProfil: (profil: (prev: Profil) => Profil) => void) => Promise<void>;
};

export function usePhoto(): UsePhotoReturn {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setPhotoError('Le fichier doit être une image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("L'image ne doit pas dépasser 5MB");
        return;
      }
      setPhotoFile(file);
      setPhotoError('');
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async (setProfil: (profil: (prev: Profil) => Profil) => void) => {
    if (!photoFile) return;

    setPhotoError('');

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const res = await fetch('/api/mon-espace/photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfil((prev: Profil) => ({ ...prev, photo: data.photo }));
        setPhotoFile(null);
        setPhotoPreview('');
      } else {
        setPhotoError(data.error || 'Erreur lors du téléchargement');
      }
    } catch (err) {
      console.error("Erreur lors de l'upload photo:", err);
      setPhotoError(err instanceof Error ? err.message : 'Erreur réseau ou serveur');
    }
  };

  const handlePhotoDelete = async (setProfil: (profil: (prev: Profil) => Profil) => void) => {
    setPhotoError('');

    try {
      const res = await fetch('/api/mon-espace/photo', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setProfil((prev: Profil) => ({ ...prev, photo: '' }));
        setPhotoPreview('');
      } else {
        setPhotoError(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression photo:', err);
      setPhotoError(err instanceof Error ? err.message : 'Erreur réseau ou serveur');
    }
  };

  return {
    photoFile,
    photoPreview,
    photoError,
    handlePhotoChange,
    handlePhotoUpload,
    handlePhotoDelete,
  };
}
