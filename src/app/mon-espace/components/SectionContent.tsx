import { memo } from 'react';
import type { Profil, Vehicule, Marque, VehiculeForm, VoyageForm } from '../typesMonEspace';
import ProfilSection from '../ProfilSection';
import RoleSection from '../RoleSection';
import VehiculesSection from '../VehiculesSection';
import VoyagesSection from '../VoyagesSection';
import HistoriqueSection from '../HistoriqueSection';
import Avatar from './Avatar';

type SectionContentProps = {
  section: 'profil' | 'role' | 'vehicules' | 'voyages' | 'historique';
  profil: Profil;
  vehicules: Vehicule[];
  marques: Marque[];
  // Profil section props
  profilMessage: string;
  profilError: string;
  profilLoading: boolean;
  handleProfilChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleProfilSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  // Photo props
  photoPreview: string;
  photoFile: File | null;
  photoError: string;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: () => void;
  handlePhotoDelete: () => void;
  // Password props
  showPasswordForm: boolean;
  setShowPasswordForm: (show: boolean) => void;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  setOldPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  handlePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  passwordError: string;
  passwordMessage: string;
  passwordLoading: boolean;
  // Role section props
  currentRole: string;
  editRole: boolean;
  setEditRole: (edit: boolean) => void;
  handleRoleSelect: (role: string) => void;
  role: string;
  roleError: string;
  roleSuccess: string;
  error: string;
  message: string;
  // Vehicules section props
  vehiculesLoading: boolean;
  vehiculeForm: VehiculeForm;
  vehiculeMessage: string;
  vehiculeError: string;
  handleVehiculeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleVehiculeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteVehicule: (id: number) => void;
  handleAddPreference: () => void;
  handleRemovePreference: (pref: string) => void;
  // Voyages section props
  voyageForm: VoyageForm;
  setVoyageForm: (form: VoyageForm) => void;
  voyageMessage: string;
  voyageError: string;
  voyageLoading: boolean;
  handleVoyageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const SectionContent = memo(function SectionContent({
  section,
  profil,
  vehicules,
  marques,
  // Profil section props
  profilMessage,
  profilError,
  profilLoading,
  handleProfilChange,
  handleProfilSubmit,
  // Photo props
  photoPreview,
  photoFile,
  photoError,
  handlePhotoChange,
  handlePhotoUpload,
  handlePhotoDelete,
  // Password props
  showPasswordForm,
  setShowPasswordForm,
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  handlePasswordSubmit,
  passwordError,
  passwordMessage,
  passwordLoading,
  // Role section props
  currentRole,
  editRole,
  setEditRole,
  handleRoleSelect,
  role,
  roleError,
  roleSuccess,
  error,
  message,
  // Vehicules section props
  vehiculesLoading,
  vehiculeForm,
  vehiculeMessage,
  vehiculeError,
  handleVehiculeChange,
  handleVehiculeSubmit,
  handleDeleteVehicule,
  handleAddPreference,
  handleRemovePreference,
  // Voyages section props
  voyageForm,
  setVoyageForm,
  voyageMessage,
  voyageError,
  voyageLoading,
  handleVoyageSubmit,
}: SectionContentProps) {
  switch (section) {
    case 'profil':
      return (
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
          avatar={<Avatar profil={profil} />}
        />
      );
    case 'role':
      return (
        <RoleSection
          currentRole={currentRole}
          editRole={editRole}
          setEditRole={setEditRole}
          handleSelect={handleRoleSelect}
          role={role}
          roleError={roleError}
          roleSuccess={roleSuccess}
          error={error}
          message={message}
        />
      );
    case 'vehicules':
      return (
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
      );
    case 'voyages':
      return (
        <VoyagesSection
          voyageForm={voyageForm}
          setVoyageForm={setVoyageForm}
          vehicules={vehicules}
          voyageMessage={voyageMessage}
          voyageError={voyageError}
          voyageLoading={voyageLoading}
          handleVoyageSubmit={handleVoyageSubmit}
          typeUtilisateur={profil.type_utilisateur}
        />
      );
    case 'historique':
      return <HistoriqueSection />;
    default:
      return null;
  }
});

export default SectionContent;
