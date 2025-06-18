import React from 'react';

type PasswordFormProps = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  setOldPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  handlePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  passwordError: string;
  passwordMessage: string;
  passwordLoading: boolean;
};

export default function PasswordForm({
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
}: PasswordFormProps) {
  return (
    <form
      onSubmit={handlePasswordSubmit}
      className="flex flex-col gap-3 bg-gray-50 rounded shadow p-6 mt-4"
    >
      <input
        type="password"
        name="oldPassword"
        id="oldPassword"
        placeholder="Ancien mot de passe"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        className="input input-bordered px-3 py-2 rounded border"
        required
      />
      <input
        type="password"
        name="newPassword"
        id="newPassword"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="input input-bordered px-3 py-2 rounded border"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="input input-bordered px-3 py-2 rounded border"
        required
      />
      <div className="text-xs text-gray-500 mb-2">
        Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.
      </div>
      <button
        type="submit"
        className="btn btn-primary bg-green-600 text-white rounded py-2 mt-2"
        disabled={passwordLoading}
      >
        {passwordLoading ? 'Changement...' : 'Valider le changement'}
      </button>
      {passwordError && <div className="text-red-600 text-center text-sm">{passwordError}</div>}
      {passwordMessage && (
        <div className="text-green-600 text-center text-sm">{passwordMessage}</div>
      )}
    </form>
  );
}
