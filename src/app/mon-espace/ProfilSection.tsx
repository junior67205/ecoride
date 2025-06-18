import React from 'react';
import ProfilForm from './components/ProfilForm';
import PasswordForm from './components/PasswordForm';
import PhotoUpload from './components/PhotoUpload';
import AlertMessage from './components/AlertMessage';
import Loader from './components/Loader';
import { Profil } from './typesMonEspace';

type ProfilSectionProps = {
  profil: Profil;
  profilMessage: string;
  profilError: string;
  profilLoading: boolean;
  handleProfilChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  photoPreview: string;
  photoFile: File | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: () => void;
  handlePhotoDelete: () => void;
  photoError: string;
  showPasswordForm: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  handlePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  passwordError: string;
  passwordMessage: string;
  passwordLoading: boolean;
  avatar: React.ReactNode;
  setOldPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setPhotoFile: (file: File | null) => void;
  setPhotoPreview: (preview: string) => void;
};

export default function ProfilSection({
  profil,
  profilMessage,
  profilError,
  profilLoading,
  handleProfilChange,
  photoPreview,
  photoFile,
  handlePhotoChange,
  handlePhotoUpload,
  handlePhotoDelete,
  photoError,
  showPasswordForm,
  oldPassword,
  newPassword,
  confirmPassword,
  handlePasswordSubmit,
  passwordError,
  passwordMessage,
  passwordLoading,
  avatar,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  setPhotoFile,
  setPhotoPreview,
}: ProfilSectionProps) {
  // Fonction d'annulation de la photo
  function handleCancelPhoto() {
    setPhotoFile(null);
    setPhotoPreview('');
  }

  return (
    <div className="max-w-2xl mx-auto w-full bg-white rounded-lg shadow-lg p-8 border border-green-100 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Mon profil</h2>
      <ProfilForm
        profil={profil}
        profilLoading={profilLoading}
        profilMessage={profilMessage}
        profilError={profilError}
        handleProfilChange={handleProfilChange}
      />
      <PhotoUpload
        photoPreview={photoPreview}
        photoFile={photoFile}
        avatar={avatar}
        handlePhotoChange={handlePhotoChange}
        handlePhotoUpload={handlePhotoUpload}
        handlePhotoDelete={handlePhotoDelete}
        photoError={photoError}
        profilLoading={profilLoading}
        onCancelPhoto={handleCancelPhoto}
      />
      {profilLoading && <Loader />}
      <AlertMessage message={profilError} type="error" />
      <AlertMessage message={profilMessage} type="success" />
      {showPasswordForm && (
        <PasswordForm
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
        />
      )}
    </div>
  );
}
