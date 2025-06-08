'use client';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import SidebarMonEspace from './SidebarMonEspace';
import SectionContent from './components/SectionContent';
import Avatar from './components/Avatar';
import { usePassword } from './hooks/usePassword';
import { useVehicules } from './hooks/useVehicules';
import { useVoyages } from './hooks/useVoyages';
import { usePhoto } from './hooks/usePhoto';
import { useFetchProfil } from './hooks/useFetchProfil';
import { useSection } from './hooks/useSection';
import { usePasswordForm } from './hooks/usePasswordForm';
import { useInitialLoad } from './hooks/useInitialLoad';
import { useUser } from '@/app/context/UserContext';
import { useProfil } from './hooks/useProfil';

export default function MonEspace() {
  const { section, setSection, navigateToVehicules } = useSection();
  const { showPasswordForm, setShowPasswordForm } = usePasswordForm();
  const {
    profil,
    setProfil,
    profilMessage,
    profilError,
    profilLoading,
    handleProfilChange,
    handleProfilSubmit,
  } = useProfil();
  const { refreshProfil } = useUser();

  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMessage,
    passwordError,
    passwordLoading,
    handlePasswordSubmit,
  } = usePassword();

  const {
    vehicules,
    vehiculesLoading,
    vehiculeForm,
    vehiculeMessage,
    vehiculeError,
    marques,
    fetchVehicules,
    handleVehiculeChange,
    handleVehiculeSubmit,
    handleDeleteVehicule,
    handleAddPreference,
    handleRemovePreference,
  } = useVehicules(profil.type_utilisateur);

  const {
    voyageForm,
    setVoyageForm,
    voyageMessage,
    voyageError,
    voyageLoading,
    handleVoyageSubmit,
  } = useVoyages();

  const {
    photoFile,
    photoPreview,
    photoError,
    handlePhotoChange,
    handlePhotoUpload,
    handlePhotoDelete,
  } = usePhoto();

  const {
    role,
    setRole,
    message,
    error,
    roleError,
    roleSuccess,
    currentRole,
    editRole,
    setEditRole,
    handleSelect,
  } = useFetchProfil();

  const { isLoading, error: loadError } = useInitialLoad(
    refreshProfil,
    setProfil,
    fetchVehicules,
    profil.type_utilisateur
  );

  const { data: session, status } = useSession();

  useEffect(() => {
    if (profil.type_utilisateur === 'chauffeur' || profil.type_utilisateur === 'les deux') {
      fetchVehicules();
    }
  }, [profil.type_utilisateur]);

  useEffect(() => {
    if (section === 'role' && profil.type_utilisateur) {
      setRole(profil.type_utilisateur);
    }
  }, [section, profil.type_utilisateur]);

  const handleRoleSelect = async (selectedRole: string) => {
    await handleSelect(selectedRole, setProfil, fetchVehicules, vehicules);
    if ((selectedRole === 'chauffeur' || selectedRole === 'les deux') && vehicules.length === 0) {
      navigateToVehicules();
    }
    await refreshProfil();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <p className="mt-2">Merci de vous connecter.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Une erreur est survenue</p>
          <p className="mt-2">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SidebarMonEspace
        section={section}
        setSection={setSection}
        profil={profil}
        signOut={() => signOut({ callbackUrl: '/' })}
        photoPreview={photoPreview}
        avatar={<Avatar profil={profil} />}
      />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Mon espace</h1>
        <SectionContent
          section={section}
          profil={profil}
          vehicules={vehicules}
          marques={marques}
          profilMessage={profilMessage}
          profilError={profilError}
          profilLoading={profilLoading}
          handleProfilChange={handleProfilChange}
          handleProfilSubmit={handleProfilSubmit}
          // Photo props
          photoPreview={photoPreview}
          photoFile={photoFile}
          photoError={photoError}
          handlePhotoChange={handlePhotoChange}
          handlePhotoUpload={() => handlePhotoUpload(setProfil)}
          handlePhotoDelete={() => handlePhotoDelete(setProfil)}
          // Password props
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
          // Role section props
          currentRole={currentRole}
          editRole={editRole}
          setEditRole={setEditRole}
          handleRoleSelect={handleRoleSelect}
          role={role || ''}
          roleError={roleError}
          roleSuccess={roleSuccess}
          error={error}
          message={message}
          // Vehicules section props
          vehiculesLoading={vehiculesLoading}
          vehiculeForm={vehiculeForm}
          vehiculeMessage={vehiculeMessage}
          vehiculeError={vehiculeError}
          handleVehiculeChange={handleVehiculeChange}
          handleVehiculeSubmit={handleVehiculeSubmit}
          handleDeleteVehicule={handleDeleteVehicule}
          handleAddPreference={handleAddPreference}
          handleRemovePreference={handleRemovePreference}
          // Voyages section props
          voyageForm={voyageForm}
          setVoyageForm={setVoyageForm}
          voyageMessage={voyageMessage}
          voyageError={voyageError}
          voyageLoading={voyageLoading}
          handleVoyageSubmit={handleVoyageSubmit}
        />
      </main>
    </div>
  );
}
