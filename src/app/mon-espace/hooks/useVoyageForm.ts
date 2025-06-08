import { useState } from 'react';

type UseVoyageFormReturn = {
  showVoyageForm: boolean;
  setShowVoyageForm: (show: boolean) => void;
  toggleVoyageForm: () => void;
};

export function useVoyageForm(initialState = false): UseVoyageFormReturn {
  const [showVoyageForm, setShowVoyageForm] = useState(initialState);

  const toggleVoyageForm = () => {
    setShowVoyageForm(prev => !prev);
  };

  return {
    showVoyageForm,
    setShowVoyageForm,
    toggleVoyageForm,
  };
}
