'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depart || !arrivee || !date) return;
    router.push(
      `/covoiturages?depart=${encodeURIComponent(depart)}&arrivee=${encodeURIComponent(arrivee)}&date=${date}`
    );
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ville de départ"
        value={depart}
        onChange={e => setDepart(e.target.value)}
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
        required
      />
      <input
        type="text"
        placeholder="Ville d'arrivée"
        value={arrivee}
        onChange={e => setArrivee(e.target.value)}
        className="input input-bordered px-4 py-2 rounded border text-gray-900"
        required
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="input input-bordered px-4 py-2 rounded border text-gray-900 [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
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
