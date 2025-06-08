import React from 'react';
import type { Vehicule, Marque, VehiculeForm, Profil } from './typesMonEspace';
import VehiculeList from './components/VehiculeList';
import VehiculeFormComponent from './components/VehiculeForm';
import AlertMessage from './components/AlertMessage';

type VehiculesSectionProps = {
  vehicules: Vehicule[];
  vehiculesLoading: boolean;
  vehiculeForm: VehiculeForm;
  marques: Marque[];
  handleVehiculeChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleVehiculeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteVehicule: (id: number) => void;
  vehiculeError: string;
  vehiculeMessage: string;
  profil: Profil;
  handleAddPreference: () => void;
  handleRemovePreference: (pref: string) => void;
};

export default function VehiculesSection({
  vehicules,
  vehiculesLoading,
  vehiculeForm,
  marques,
  handleVehiculeChange,
  handleVehiculeSubmit,
  handleDeleteVehicule,
  vehiculeError,
  vehiculeMessage,
  profil,
  handleAddPreference,
  handleRemovePreference,
}: VehiculesSectionProps) {
  return (
    <div className="max-w-2xl mx-auto w-full bg-white rounded shadow p-8 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Mes véhicules</h2>
      {vehiculesLoading ? (
        <div className="text-center text-gray-500">Chargement des véhicules...</div>
      ) : (
        <VehiculeList vehicules={vehicules} handleDeleteVehicule={handleDeleteVehicule} />
      )}
      <VehiculeFormComponent
        vehiculeForm={vehiculeForm}
        marques={marques}
        profil={profil}
        handleVehiculeChange={handleVehiculeChange}
        handleVehiculeSubmit={handleVehiculeSubmit}
        handleAddPreference={handleAddPreference}
        handleRemovePreference={handleRemovePreference}
        vehiculeError={vehiculeError}
        vehiculeMessage={vehiculeMessage}
      />
      {vehiculeError && <AlertMessage message={vehiculeError} type="error" />}
      {vehiculeMessage && <AlertMessage message={vehiculeMessage} type="success" />}
    </div>
  );
}
