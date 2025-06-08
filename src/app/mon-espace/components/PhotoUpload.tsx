import React from 'react';
import PhotoCancelButton from './PhotoCancelButton';

type PhotoUploadProps = {
  photoPreview: string;
  photoFile: File | null;
  avatar: React.ReactNode;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotoUpload: () => void;
  handlePhotoDelete: () => void;
  photoError: string;
  profilLoading: boolean;
  onCancelPhoto?: () => void;
};

export default function PhotoUpload({
  photoPreview,
  photoFile,
  avatar,
  handlePhotoChange,
  handlePhotoUpload,
  handlePhotoDelete,
  photoError,
  profilLoading,
  onCancelPhoto,
}: PhotoUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      {photoPreview ? (
        <img src={photoPreview} alt="Aperçu" className="w-16 h-16 rounded-full object-cover" />
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
              disabled={profilLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {profilLoading ? 'Téléchargement...' : 'Télécharger'}
            </button>
            <PhotoCancelButton onCancel={onCancelPhoto || (() => {})} />
          </div>
        )}
        {!photoFile && (
          <button
            type="button"
            onClick={handlePhotoDelete}
            disabled={profilLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {profilLoading ? 'Suppression...' : 'Supprimer la photo'}
          </button>
        )}
        {photoError && <div className="text-red-600 text-sm">{photoError}</div>}
      </div>
    </div>
  );
}
