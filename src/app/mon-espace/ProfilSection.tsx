import React from 'react';
import ProfilForm from './components/ProfilForm';
import PasswordForm from './components/PasswordForm';
import PhotoUpload from './components/PhotoUpload';
import ProfilSectionHeader from './components/ProfilSectionHeader';
import AlertMessage from './components/AlertMessage';
import Loader from './components/Loader';
import SectionCard from './components/SectionCard';
import { Profil } from './typesMonEspace';

type ProfilSectionProps = {
  profil: Profil;
  profilMessage: string;
  profilError: string;
  profilLoading: boolean;
  handleProfilChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleProfilSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  photoPreview: string;
  photoFile: File | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: () => void;
  handlePhotoDelete: () => void;
  photoError: string;
  showPasswordForm: boolean;
  setShowPasswordForm: (show: boolean) => void;
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
  handleProfilSubmit,
  photoPreview,
  photoFile,
  handlePhotoChange,
  handlePhotoUpload,
  handlePhotoDelete,
  photoError,
  showPasswordForm,
  setShowPasswordForm,
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
    <section className="max-w-xl mx-auto mb-10">
      <ProfilSectionHeader
        showPasswordForm={showPasswordForm}
        setShowPasswordForm={setShowPasswordForm}
      />
      <SectionCard>
        <form onSubmit={handleProfilSubmit} className="flex flex-col gap-3">
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
          <ProfilForm
            profil={profil}
            profilLoading={profilLoading}
            profilMessage={profilMessage}
            profilError={profilError}
            handleProfilChange={handleProfilChange}
            handleProfilSubmit={handleProfilSubmit}
          />
          {profilLoading && <Loader />}
          <AlertMessage message={profilError} type="error" />
          <AlertMessage message={profilMessage} type="success" />
        </form>
      </SectionCard>
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
    </section>
  );
}
