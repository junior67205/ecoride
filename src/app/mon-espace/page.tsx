'use client';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaUserEdit, FaCarSide } from 'react-icons/fa';
import { Prisma } from '@prisma/client';
import { signOut } from 'next-auth/react';

type Vehicule = Prisma.voitureGetPayload<{
  include: { marque: true };
}>;

type Marque = Prisma.marqueGetPayload<object>;

export default function MonEspace() {
  const [role, setRole] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
  const [section, setSection] = useState<'profil' | 'role' | 'vehicules'>('profil');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [editRole, setEditRole] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
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
  const [roleError, setRoleError] = useState('');
  const [roleSuccess, setRoleSuccess] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

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
          if (data.type_utilisateur) setCurrentRole(data.type_utilisateur);
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    setPasswordLoading(true);
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      setPasswordLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.'
      );
      setPasswordLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/mon-espace/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage(data.message || 'Mot de passe modifié avec succès.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
      } else {
        setPasswordError(data.error || 'Erreur lors de la modification.');
      }
    } catch {
      setPasswordError('Erreur réseau ou serveur.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSelect = async (selectedRole: string) => {
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
      const data = await res.json();
      if (res.ok) {
        setRoleSuccess(data.message || 'Rôle enregistré avec succès.');
        const profilRes = await fetch('/api/mon-espace/profil');
        const profilData = await profilRes.json();
        if (!profilData.error) {
          setProfil(profilData);
          setCurrentRole(profilData.type_utilisateur);
          if (profilData.type_utilisateur === 'passager') {
            setVehicules([]);
          } else {
            fetchVehicules();
          }
        }
        setEditRole(false);
        if (
          (selectedRole === 'chauffeur' || selectedRole === 'les deux') &&
          vehicules.length === 0
        ) {
          setSection('vehicules');
        }
      } else {
        setRoleError(data.error || 'Erreur lors de la sauvegarde.');
      }
    } catch {
      setRoleError('Erreur réseau ou serveur.');
    }
  };

  const fetchProfil = async () => {
    const res = await fetch('/api/mon-espace/profil');
    const data = await res.json();
    if (!data.error) setProfil(data);
  };

  const fetchVehicules = async () => {
    setVehiculesLoading(true);
    const res = await fetch('/api/mon-espace/vehicules');
    const data = await res.json();
    if (!data.error) setVehicules(data);
    setVehiculesLoading(false);
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  useEffect(() => {
    if (profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') {
      fetchVehicules();
    }
  }, [profil.type_utilisateur]);

  // Charger les marques pour le select
  useEffect(() => {
    fetch('/api/marque')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMarques(data);
      });
  }, []);

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
    } catch {
      setVehiculeError('Erreur réseau ou serveur.');
    }
  };

  // Fonction pour supprimer un véhicule
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

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setPhotoLoading(true);
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
        setProfil(prev => ({ ...prev, photo: data.photo }));
        setPhotoFile(null);
        setPhotoPreview('');
      } else {
        setPhotoError(data.error || 'Erreur lors du téléchargement');
      }
    } catch {
      setPhotoError('Erreur réseau ou serveur');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setPhotoLoading(true);
    setPhotoError('');

    try {
      const res = await fetch('/api/mon-espace/photo', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setProfil(prev => ({ ...prev, photo: '' }));
        setPhotoPreview('');
      } else {
        setPhotoError(data.error || 'Erreur lors de la suppression');
      }
    } catch {
      setPhotoError('Erreur réseau ou serveur');
    } finally {
      setPhotoLoading(false);
    }
  };

  // Avatar (photo, initiale du pseudo ou icône)
  const avatar = profil.photo ? (
    <img
      src={`/uploads/${profil.photo}`}
      alt={profil.pseudo}
      className="w-16 h-16 rounded-full object-cover"
    />
  ) : profil.pseudo ? (
    <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl">
      {profil.pseudo[0].toUpperCase()}
    </div>
  ) : (
    <FaUserCircle size={48} className="text-green-600" />
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shadow-sm flex flex-col py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-2">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Aperçu"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              avatar
            )}
          </div>
          <div className="font-bold text-lg">{profil.pseudo || 'Utilisateur'}</div>
          <div className="text-gray-500 text-sm">{profil.email}</div>
          <div className="text-green-700 text-sm font-semibold mt-1">
            {profil.credit ?? 0} crédit{(profil.credit ?? 0) > 1 ? 's' : ''}
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'profil' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setSection('profil')}
          >
            <FaUserEdit /> Profil
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'role' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
            onClick={() => setSection('role')}
          >
            <FaCarSide /> Rôle
          </button>
          {(profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') && (
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded transition text-left ${section === 'vehicules' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
              onClick={() => setSection('vehicules')}
            >
              🚗 Véhicules
            </button>
          )}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded transition text-left mt-8 bg-red-100 text-red-700 hover:bg-red-200"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Se déconnecter
          </button>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Mon espace</h1>
        {section === 'profil' && (
          <section className="max-w-xl mx-auto mb-10">
            <h2 className="text-xl font-semibold mb-4">Mes informations personnelles</h2>
            <form
              onSubmit={handleProfilSubmit}
              className="flex flex-col gap-3 bg-white rounded shadow p-6"
            >
              <div className="flex flex-col items-center gap-4 mb-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Aperçu"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  avatar
                )}
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Choisir une photo
                  </label>
                  {photoFile && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePhotoUpload}
                        disabled={photoLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {photoLoading ? 'Téléchargement...' : 'Télécharger'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview('');
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                  {profil.photo && !photoFile && (
                    <button
                      type="button"
                      onClick={handlePhotoDelete}
                      disabled={photoLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {photoLoading ? 'Suppression...' : 'Supprimer la photo'}
                    </button>
                  )}
                  {photoError && <div className="text-red-600 text-sm">{photoError}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium mb-1 block" htmlFor="civilite">
                    Civilité
                  </label>
                  <select
                    id="civilite"
                    name="civilite"
                    value={profil.civilite}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Monsieur">Monsieur</option>
                    <option value="Madame">Madame</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="pseudo">
                    Pseudo
                  </label>
                  <input
                    id="pseudo"
                    name="pseudo"
                    type="text"
                    value={profil.pseudo}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={profil.nom}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    placeholder="ex : Dupont"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="prenom">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={profil.prenom}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    pattern="[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*"
                    placeholder="ex: Jean ou Jean-Pierre"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Format : lettres uniquement, tiret (-) optionnel pour les prénoms composés
                  </div>
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profil.email}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border break-all"
                    style={{ wordBreak: 'break-all' }}
                    required
                  />
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="telephone">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={profil.telephone}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    pattern="\d{10}"
                    maxLength={10}
                    placeholder="ex: 0612345678"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Format : 10 chiffres (ex: 0612345678)
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-medium mb-1 block" htmlFor="adresse">
                    Adresse
                  </label>
                  <input
                    id="adresse"
                    name="adresse"
                    type="text"
                    value={profil.adresse}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    pattern="[A-Za-zÀ-ÿ0-9-\s]+"
                    placeholder="ex: 123 rue de la Paix"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Format : lettres, chiffres et tiret (-) uniquement
                  </div>
                </div>

                <div>
                  <label className="font-medium mb-1 block" htmlFor="date_naissance">
                    Date de naissance
                  </label>
                  <input
                    id="date_naissance"
                    name="date_naissance"
                    type="date"
                    value={profil.date_naissance}
                    onChange={handleProfilChange}
                    className="input input-bordered w-full px-3 py-2 rounded border"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profilLoading}
                className="btn btn-primary bg-green-600 text-white rounded py-2 mt-4 w-full"
              >
                {profilLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>

              {profilError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
                  {profilError}
                </div>
              )}
              {profilMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
                  {profilMessage}
                </div>
              )}
            </form>
            <div className="mt-8">
              <button
                className="text-blue-600 underline"
                onClick={() => setShowPasswordForm(v => !v)}
              >
                {showPasswordForm ? 'Annuler' : 'Modifier mon mot de passe'}
              </button>
              {showPasswordForm && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="flex flex-col gap-3 bg-gray-50 rounded shadow p-6 mt-4"
                >
                  <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="input input-bordered px-3 py-2 rounded border"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="input input-bordered px-3 py-2 rounded border"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input input-bordered px-3 py-2 rounded border"
                    required
                  />
                  <div className="text-xs text-gray-500 mb-2">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule et un
                    chiffre.
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary bg-green-600 text-white rounded py-2 mt-2"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Changement...' : 'Valider le changement'}
                  </button>
                  {passwordError && (
                    <div className="text-red-600 text-center text-sm">{passwordError}</div>
                  )}
                  {passwordMessage && (
                    <div className="text-green-600 text-center text-sm">{passwordMessage}</div>
                  )}
                </form>
              )}
            </div>
          </section>
        )}
        {section === 'role' && (
          <section className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Mon rôle</h2>
            {roleError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
                {roleError}
              </div>
            )}
            {roleSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
                {roleSuccess}
              </div>
            )}
            {currentRole && !editRole && (
              <div className="mb-6 flex items-center gap-2">
                <span className="font-medium">Votre rôle actuel :</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold capitalize">
                  {currentRole}
                </span>
                <button
                  className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  onClick={() => {
                    setEditRole(true);
                    setRoleError('');
                    setRoleSuccess('');
                  }}
                >
                  Modifier mon rôle
                </button>
              </div>
            )}
            {(!currentRole || editRole) && (
              <>
                <p className="mb-6">Sélectionnez votre rôle :</p>
                <div className="flex flex-col gap-4 items-center">
                  <button
                    className={`px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition ${role === 'chauffeur' ? 'ring-2 ring-green-700' : ''}`}
                    onClick={() => handleSelect('chauffeur')}
                  >
                    Chauffeur
                  </button>
                  <button
                    className={`px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${role === 'passager' ? 'ring-2 ring-blue-700' : ''}`}
                    onClick={() => handleSelect('passager')}
                  >
                    Passager
                  </button>
                  <button
                    className={`px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition ${role === 'les deux' ? 'ring-2 ring-purple-700' : ''}`}
                    onClick={() => handleSelect('les deux')}
                  >
                    Les deux
                  </button>
                  <button
                    className="mt-2 text-sm text-gray-500 underline"
                    onClick={() => {
                      setEditRole(false);
                      setRoleError('');
                      setRoleSuccess('');
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
            {error && <div className="mt-6 text-red-600 text-center">{error}</div>}
            {message && <div className="mt-6 text-green-700 text-center">{message}</div>}
          </section>
        )}
        {section === 'vehicules' && (
          <section className="max-w-xl mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Mes véhicules</h2>
            {vehiculesLoading ? (
              <div>Chargement des véhicules...</div>
            ) : (
              <ul className="mb-4">
                {vehicules.length === 0 ? (
                  <li className="text-red-600">
                    Aucun véhicule enregistré. Merci d&apos;en ajouter au moins un pour valider
                    votre rôle.
                  </li>
                ) : (
                  vehicules.map(v => (
                    <li
                      key={v.voiture_id}
                      className="mb-2 p-2 border rounded bg-white flex flex-col gap-1"
                    >
                      <span>
                        <b>Immatriculation :</b> {v.immatriculation}
                      </span>
                      <span>
                        <b>Modèle :</b> {v.modele}
                      </span>
                      <span>
                        <b>Couleur :</b> {v.couleur}
                      </span>
                      <span>
                        <b>Marque :</b> {v.marque?.libelle}
                      </span>
                      <span>
                        <b>Date 1ère immatriculation :</b> {v.date_premiere_immatriculation}
                      </span>
                      <span>
                        <b>Nombre de places :</b> {v.nb_place}
                      </span>
                      <span>
                        <b>Préférences :</b>{' '}
                        {v.preferences
                          ? (() => {
                              const prefs = JSON.parse(v.preferences);
                              const fumeur = prefs.fumeur ? 'Oui' : 'Non';
                              const animal = prefs.animal ? 'Oui' : 'Non';
                              const girlOnly = prefs.girl_only ? 'Oui' : 'Non';
                              const autres =
                                prefs.autres && prefs.autres.length > 0
                                  ? prefs.autres.join(', ')
                                  : 'Aucune';
                              return `Fumeur : ${fumeur}, Animaux acceptés : ${animal}, Girl only : ${girlOnly}, Autres : ${autres}`;
                            })()
                          : 'Aucune'}
                      </span>
                      <button
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 w-max"
                        onClick={() => handleDeleteVehicule(v.voiture_id)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
            <form
              onSubmit={handleVehiculeSubmit}
              className="flex flex-col gap-3 bg-white rounded shadow p-6 mt-4"
            >
              <label className="font-medium mb-1" htmlFor="immatriculation">
                Immatriculation
              </label>
              <input
                id="immatriculation"
                name="immatriculation"
                placeholder="ex : 26-HEH-67"
                value={vehiculeForm.immatriculation}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              />
              <label className="font-medium mb-1" htmlFor="date_premiere_immatriculation">
                Date de première immatriculation
              </label>
              <input
                type="date"
                id="date_premiere_immatriculation"
                name="date_premiere_immatriculation"
                value={vehiculeForm.date_premiere_immatriculation}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              />
              <label className="font-medium mb-1" htmlFor="modele">
                Modèle
              </label>
              <input
                id="modele"
                name="modele"
                placeholder="ex : Clio 4"
                value={vehiculeForm.modele}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              />
              <label className="font-medium mb-1" htmlFor="couleur">
                Couleur
              </label>
              <input
                id="couleur"
                name="couleur"
                placeholder="ex : Grise"
                value={vehiculeForm.couleur}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              />
              <label className="font-medium mb-1" htmlFor="marque_id">
                Marque
              </label>
              <select
                id="marque_id"
                name="marque_id"
                value={vehiculeForm.marque_id}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              >
                <option value="">Sélectionner une marque</option>
                {marques.map(m => (
                  <option key={m.marque_id} value={m.marque_id}>
                    {m.libelle}
                  </option>
                ))}
              </select>
              <label className="font-medium mb-1" htmlFor="nb_place">
                Nombre de places
              </label>
              <input
                id="nb_place"
                name="nb_place"
                type="number"
                min="1"
                max="9"
                placeholder="ex : 5"
                value={vehiculeForm.nb_place}
                onChange={handleVehiculeChange}
                className="input input-bordered px-3 py-2 rounded border"
                required
              />
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="fumeur"
                    checked={vehiculeForm.preferences.fumeur}
                    onChange={handleVehiculeChange}
                  />{' '}
                  Fumeur accepté
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="animal"
                    checked={vehiculeForm.preferences.animal}
                    onChange={handleVehiculeChange}
                  />{' '}
                  Animaux acceptés
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="girl_only"
                    checked={vehiculeForm.preferences.girl_only}
                    onChange={handleVehiculeChange}
                    disabled={profil.civilite === 'Monsieur'}
                  />{' '}
                  Girl only
                  {profil.civilite === 'Monsieur' && (
                    <span className="text-xs text-gray-400 ml-1">(réservé aux dames)</span>
                  )}
                </label>
              </div>
              <div>
                <div className="mb-2">Autres préférences :</div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={vehiculeForm.nouvellePreference}
                    onChange={e =>
                      setVehiculeForm({ ...vehiculeForm, nouvellePreference: e.target.value })
                    }
                    placeholder="Ajouter une préférence"
                    className="input input-bordered px-3 py-2 rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehiculeForm.preferences.autres.map((pref, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {pref}{' '}
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(pref)}
                        className="text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2"
              >
                Ajouter le véhicule
              </button>
              {vehiculeError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold text-center">
                  {vehiculeError}
                </div>
              )}
              {vehiculeMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold text-center">
                  {vehiculeMessage}
                </div>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
