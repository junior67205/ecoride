import React from 'react';
import type { Vehicule } from '../typesMonEspace';

type VoyageSelectVehiculeProps = {
  vehicules: Vehicule[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
};

export default function VoyageSelectVehicule({
  vehicules,
  value,
  onChange,
  required = false,
  className = '',
}: VoyageSelectVehiculeProps) {
  return (
    <select
      id="vehiculeId"
      name="vehiculeId"
      value={value}
      onChange={onChange}
      className={`input input-bordered px-3 py-2 rounded border w-full md:w-auto ${className}`}
      required={required}
    >
      <option value="">Sélectionner un véhicule</option>
      {vehicules.map(v => (
        <option key={v.voiture_id} value={v.voiture_id}>
          {v.marque?.libelle} {v.modele} ({v.immatriculation})
        </option>
      ))}
    </select>
  );
}
