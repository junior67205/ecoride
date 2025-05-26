import React from 'react';

interface CovoiturageFiltresProps {
  filtreEco: boolean;
  setFiltreEco: (v: boolean) => void;
  filtrePrix: string;
  setFiltrePrix: (v: string) => void;
  filtreDuree: string;
  setFiltreDuree: (v: string) => void;
  filtreNote: string;
  setFiltreNote: (v: string) => void;
  showFiltres: boolean;
  setShowFiltres: (v: boolean) => void;
}

const CovoiturageFiltres: React.FC<CovoiturageFiltresProps> = ({
  filtreEco,
  setFiltreEco,
  filtrePrix,
  setFiltrePrix,
  filtreDuree,
  setFiltreDuree,
  filtreNote,
  setFiltreNote,
  showFiltres,
  setShowFiltres,
}) => (
  <div className="mb-6">
    <button
      className="mb-2 px-4 py-2 rounded border border-primary bg-primary-light text-primary font-semibold shadow-sm hover:bg-primary hover:text-white transition"
      onClick={e => {
        e.preventDefault();
        setShowFiltres(!showFiltres);
      }}
    >
      {showFiltres ? 'Masquer les filtres' : 'Afficher les filtres'}
    </button>
    {showFiltres && (
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filtreEco}
            onChange={e => setFiltreEco(e.target.checked)}
          />
          <span>Voyages écologiques uniquement</span>
        </label>
        <label className="flex items-center gap-2">
          Prix max&nbsp;:
          <input
            type="number"
            min="0"
            value={filtrePrix}
            onChange={e => setFiltrePrix(e.target.value)}
            className="input input-bordered w-24 px-2 py-1 rounded border text-gray-900"
            placeholder="€"
          />
        </label>
        <label className="flex items-center gap-2">
          Durée max&nbsp;:
          <input
            type="number"
            min="0"
            value={filtreDuree}
            onChange={e => setFiltreDuree(e.target.value)}
            className="input input-bordered w-24 px-2 py-1 rounded border text-gray-900"
            placeholder="heures"
          />
        </label>
        <label className="flex items-center gap-2">
          Note min&nbsp;:
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            value={filtreNote}
            onChange={e => setFiltreNote(e.target.value)}
            className="input input-bordered w-20 px-2 py-1 rounded border text-gray-900"
            placeholder="★"
          />
        </label>
      </div>
    )}
  </div>
);

export default CovoiturageFiltres;
