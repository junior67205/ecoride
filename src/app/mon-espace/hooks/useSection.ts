import { useState } from 'react';

type Section = 'profil' | 'role' | 'vehicules' | 'voyages' | 'historique';

type UseSectionReturn = {
  section: Section;
  setSection: (section: Section) => void;
  navigateToVehicules: () => void;
};

export function useSection(initialSection: Section = 'profil'): UseSectionReturn {
  const [section, setSection] = useState<Section>(initialSection);

  const navigateToVehicules = () => {
    setSection('vehicules');
  };

  return {
    section,
    setSection,
    navigateToVehicules,
  };
}
