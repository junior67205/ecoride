'use client';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import SidebarMonEspace from './SidebarMonEspace';
import ProfilSection from './ProfilSection';
import RoleSection from './RoleSection';
import VehiculesSection from './VehiculesSection';
import VoyagesSection from './VoyagesSection';
import { Vehicule, Marque } from './typesMonEspace';

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
  const [section, setSection] = useState<'profil' | 'role' | 'vehicules' | 'voyages'>('profil');
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
  const [photoError, setPhotoError] = useState('');
  const [showVoyageForm, setShowVoyageForm] = useState(false);
  const [voyageForm, setVoyageForm] = useState({
    depart: '',
    arrivee: '',
    dateDepart: '',
    heureDepart: '',
    dateArrivee: '',
    heureArrivee: '',
    prix: '',
    vehiculeId: '',
  });
  const [voyageMessage, setVoyageMessage] = useState('');
  const [voyageError, setVoyageError] = useState('');
  const [voyageLoading, setVoyageLoading] = useState(false);

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
    }
  };

  const handlePhotoDelete = async () => {
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
      <SidebarMonEspace
        section={section}
        setSection={setSection}
        profil={profil}
        signOut={() => signOut({ callbackUrl: '/' })}
        photoPreview={photoPreview}
        avatar={avatar}
      />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Mon espace</h1>
        {section === 'profil' && (
          <ProfilSection
            profil={profil}
            profilMessage={profilMessage}
            profilError={profilError}
            profilLoading={profilLoading}
            handleProfilChange={handleProfilChange}
            handleProfilSubmit={handleProfilSubmit}
            photoPreview={photoPreview}
            photoFile={photoFile}
            handlePhotoChange={handlePhotoChange}
            handlePhotoUpload={handlePhotoUpload}
            handlePhotoDelete={handlePhotoDelete}
            photoError={photoError}
            showPasswordForm={showPasswordForm}
            setShowPasswordForm={setShowPasswordForm}
            oldPassword={oldPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setOldPassword={setOldPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordSubmit={handlePasswordSubmit}
            passwordError={passwordError}
            passwordMessage={passwordMessage}
            passwordLoading={passwordLoading}
            avatar={avatar}
          />
        )}
        {section === 'role' && (
          <RoleSection
            currentRole={currentRole}
            editRole={editRole}
            setEditRole={setEditRole}
            handleSelect={handleSelect}
            role={role || ''}
            roleError={roleError}
            roleSuccess={roleSuccess}
            error={error}
            message={message}
          />
        )}
        {section === 'vehicules' && (
          <VehiculesSection
            vehicules={vehicules}
            vehiculesLoading={vehiculesLoading}
            vehiculeForm={vehiculeForm}
            marques={marques}
            handleVehiculeChange={handleVehiculeChange}
            handleVehiculeSubmit={handleVehiculeSubmit}
            handleDeleteVehicule={handleDeleteVehicule}
            vehiculeError={vehiculeError}
            vehiculeMessage={vehiculeMessage}
            profil={profil}
            handleAddPreference={handleAddPreference}
            handleRemovePreference={handleRemovePreference}
          />
        )}
        {section === 'voyages' &&
          (profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') && (
            <VoyagesSection
              voyageForm={voyageForm}
              setVoyageForm={setVoyageForm}
              vehicules={vehicules}
              voyageMessage={voyageMessage}
              voyageError={voyageError}
              voyageLoading={voyageLoading}
              setShowVoyageForm={setShowVoyageForm}
              showVoyageForm={showVoyageForm}
              handleVoyageSubmit={async e => {
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
                    });
                  } else {
                    setVoyageError(data.error || 'Erreur lors de la création du voyage.');
                  }
                } catch {
                  setVoyageError('Erreur réseau ou serveur.');
                } finally {
                  setVoyageLoading(false);
                }
              }}
            />
          )}
      </main>
    </div>
  );
}
