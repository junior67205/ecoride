import { useState } from 'react';

export function usePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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
      } else {
        setPasswordError(data.error || 'Erreur lors de la modification.');
      }
    } catch {
      setPasswordError('Erreur réseau ou serveur.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return {
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
  };
}
