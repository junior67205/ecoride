import React from 'react';
import type { Vehicule, VoyageForm as VoyageFormType } from './typesMonEspace';
import VoyageForm from './components/VoyageForm';

type VoyagesSectionProps = {
  voyageForm: VoyageFormType;
  setVoyageForm: (form: VoyageFormType) => void;
  vehicules: Vehicule[];
  voyageMessage: string;
  voyageError: string;
  voyageLoading: boolean;
  handleVoyageSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  typeUtilisateur: string;
};

export default function VoyagesSection({
  voyageForm,
  setVoyageForm,
  vehicules,
  voyageMessage,
  voyageError,
  voyageLoading,
  handleVoyageSubmit,
  typeUtilisateur,
}: VoyagesSectionProps) {
  return (
    <div className="space-y-8">
      {/* Formulaire de création de voyage : visible seulement pour chauffeur ou les deux */}
      {(typeUtilisateur === 'chauffeur' || typeUtilisateur === 'les deux') && (
        <section className="max-w-xl mx-auto mt-10">
          <VoyageForm
            voyageForm={voyageForm}
            setVoyageForm={setVoyageForm}
            vehicules={vehicules}
            voyageMessage={voyageMessage}
            voyageError={voyageError}
            voyageLoading={voyageLoading}
            handleVoyageSubmit={handleVoyageSubmit}
          />
        </section>
      )}
    </div>
  );
}
