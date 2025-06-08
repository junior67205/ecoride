import { useState } from 'react';

type UsePasswordFormReturn = {
  showPasswordForm: boolean;
  setShowPasswordForm: (show: boolean) => void;
  togglePasswordForm: () => void;
};

export function usePasswordForm(initialState = false): UsePasswordFormReturn {
  const [showPasswordForm, setShowPasswordForm] = useState(initialState);

  const togglePasswordForm = () => {
    setShowPasswordForm(prev => !prev);
  };

  return {
    showPasswordForm,
    setShowPasswordForm,
    togglePasswordForm,
  };
}
