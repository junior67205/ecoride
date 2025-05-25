'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [date, setDate] = useState('');

  return (
    <form className="flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Ville de départ"
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
      />
      <input
        type="text"
        placeholder="Ville d'arrivée"
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="input input-bordered px-4 py-2 rounded border text-gray-900 [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
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
