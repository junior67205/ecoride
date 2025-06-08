import React from 'react';

interface SearchFormProps {
  depart: string;
  arrivee: string;
  date: string;
  onDepartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onArriveeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchForm({
  depart,
  arrivee,
  date,
  onDepartChange,
  onArriveeChange,
  onDateChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
    >
      <input
        type="text"
        placeholder="Ville de départ"
        value={depart}
        onChange={onDepartChange}
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
        required
      />
      <input
        type="text"
        placeholder="Ville d'arrivée"
        value={arrivee}
        onChange={onArriveeChange}
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
        required
      />
      <input
        type="date"
        value={date}
        onChange={onDateChange}
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
        required
      />
      <button
        type="submit"
        className="btn btn-primary px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
      >
        Rechercher
      </button>
    </form>
  );
}
