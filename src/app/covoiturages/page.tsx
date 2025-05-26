'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import CovoiturageFiltres from './CovoiturageFiltres';

// Exemple de type pour un covoiturage

type Covoiturage = {
  chauffeur: {
    pseudo: string;
    photo: string;
    note: number;
  };
  nb_place: number;
  prix_personne: number;
  date_depart: string;
  heure_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  ecologique: boolean;
};

// Exemple de données mockées pour l'affichage initial
const MOCK_COVOITURAGES: Covoiturage[] = [];

export default function CovoituragesPage() {
  const searchParams = useSearchParams();
  const [depart, setDepart] = useState(searchParams.get('depart') || '');
  const [arrivee, setArrivee] = useState(searchParams.get('arrivee') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [results, setResults] = useState<Covoiturage[]>(MOCK_COVOITURAGES);
  const [submitted, setSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState<Covoiturage | null>(null);
  // Filtres US4
  const [filtreEco, setFiltreEco] = useState(false);
  const [filtrePrix, setFiltrePrix] = useState('');
  const [filtreDuree, setFiltreDuree] = useState('');
  const [filtreNote, setFiltreNote] = useState('');
  const [showFiltres, setShowFiltres] = useState(false);

  // Recherche automatique si paramètres dans l'URL
  useEffect(() => {
    if (searchParams.get('depart') && searchParams.get('arrivee') && searchParams.get('date')) {
      setDepart(searchParams.get('depart') || '');
      setArrivee(searchParams.get('arrivee') || '');
      setDate(searchParams.get('date') || '');
      // Simule la soumission du formulaire
      (async () => {
        setSubmitted(true);
        try {
          const params = new URLSearchParams({
            depart: searchParams.get('depart')!,
            arrivee: searchParams.get('arrivee')!,
            date: searchParams.get('date')!,
          });
          const res = await fetch(`/api/covoiturages?${params.toString()}`);
          if (!res.ok) throw new Error('Erreur lors de la recherche');
          const data = await res.json();
          setResults(data.results || []);
          setSuggestion(data.suggestion || null);
        } catch {
          setResults([]);
          setSuggestion(null);
        }
      })();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const params = new URLSearchParams({ depart, arrivee, date });
      const res = await fetch(`/api/covoiturages?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur lors de la recherche');
      const data = await res.json();
      setResults(data.results || []);
      setSuggestion(data.suggestion || null);
    } catch {
      setResults([]);
      setSuggestion(null);
    }
  };

  // Calcul simple de la durée en utilisant uniquement l'heure de départ et d'arrivée
  function getDureeHeuresSimple(covoit: Covoiturage) {
    function toMinutes(heure: string) {
      if (!heure) return NaN;
      const [h, m] = heure.split(':');
      return parseInt(h, 10) * 60 + parseInt(m, 10);
    }
    if (!covoit.heure_depart || !covoit.heure_arrivee) return null;
    const dep = toMinutes(covoit.heure_depart);
    const arr = toMinutes(covoit.heure_arrivee);
    if (isNaN(dep) || isNaN(arr) || arr < dep) return null;
    const diff = arr - dep;
    return { h: Math.floor(diff / 60), m: diff % 60 };
  }

  // Application des filtres côté client
  const filteredResults = results.filter(covoit => {
    if (filtreEco && !covoit.ecologique) return false;
    if (filtrePrix && covoit.prix_personne > parseFloat(filtrePrix)) return false;
    if (
      filtreNote &&
      (covoit.chauffeur.note === null || covoit.chauffeur.note < parseInt(filtreNote, 10))
    )
      return false;
    if (filtreDuree) {
      const duree = getDureeHeuresSimple(covoit);
      if (duree === null || duree.h > parseFloat(filtreDuree)) return false;
    }
    return true;
  });

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Rechercher un covoiturage
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
      >
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

      {/* Résultats de recherche */}
      {submitted && results.length === 0 && !suggestion && (
        <div className="text-center text-gray-600 mt-8">
          <p>Aucun covoiturage trouvé pour votre recherche.</p>
          <p className="mt-2">Essayez de modifier la date ou la ville de départ/arrivée.</p>
        </div>
      )}
      {submitted && results.length === 0 && suggestion && (
        <div className="text-center text-gray-600 mt-8">
          <p>Aucun covoiturage trouvé à cette date,</p>
          <p className="mt-2">
            mais un trajet est disponible le <b>{suggestion.date_depart}</b> à{' '}
            <b>{suggestion.heure_depart?.slice(0, 5)}</b> :
          </p>
          <div className="flex flex-col gap-6 items-center mt-4">
            {/* Affichage de la carte suggestion */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center gap-4 border border-primary-light max-w-xl mx-auto">
              <Image
                src={suggestion.chauffeur.photo}
                alt={suggestion.chauffeur.pseudo}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-primary">{suggestion.chauffeur.pseudo}</span>
                  <span className="text-yellow-500">★ {suggestion.chauffeur.note}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  {suggestion.nb_place} place(s) restante(s) &bull; {suggestion.prix_personne} € /
                  pers
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  Départ : {suggestion.date_depart} à {suggestion.heure_depart?.slice(0, 5)} &bull;
                  Arrivée : {suggestion.date_arrivee} à {suggestion.heure_arrivee?.slice(0, 5)}
                </div>
                {suggestion.ecologique ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Trajet écologique
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Trajet standard
                  </span>
                )}
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="btn btn-success px-4 py-2 rounded border border-green-600 text-white bg-green-600 hover:bg-green-700 transition">
                    Réserver
                  </button>
                  <button className="btn btn-outline-primary px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition">
                    Détail
                  </button>
                </div>
              </div>
            </div>
            {/* Affichage durée suggestion */}
            <div className="text-sm text-gray-700 mb-1">
              Durée :{' '}
              {(() => {
                const duree = getDureeHeuresSimple(suggestion);
                return duree ? `${duree.h}h${String(duree.m).padStart(2, '0')}` : 'NC';
              })()}
            </div>
          </div>
        </div>
      )}
      {/* Filtres US4 */}
      {submitted && results.length > 0 && (
        <CovoiturageFiltres
          filtreEco={filtreEco}
          setFiltreEco={setFiltreEco}
          filtrePrix={filtrePrix}
          setFiltrePrix={setFiltrePrix}
          filtreDuree={filtreDuree}
          setFiltreDuree={setFiltreDuree}
          filtreNote={filtreNote}
          setFiltreNote={setFiltreNote}
          showFiltres={showFiltres}
          setShowFiltres={setShowFiltres}
        />
      )}
      {filteredResults.length > 0 && (
        <div className="flex flex-col gap-6">
          {filteredResults.map((covoit, idx) => {
            // Formatage des dates/heures pour affichage lisible
            const dateDep = covoit.date_depart ? new Date(covoit.date_depart) : null;
            const dateArr = covoit.date_arrivee ? new Date(covoit.date_arrivee) : null;
            // Correction affichage heure : on affiche HH:mm si c'est une chaîne
            const heureDep =
              covoit.heure_depart && covoit.heure_depart.length >= 5
                ? covoit.heure_depart.slice(0, 5)
                : covoit.heure_depart;
            const heureArr =
              covoit.heure_arrivee && covoit.heure_arrivee.length >= 5
                ? covoit.heure_arrivee.slice(0, 5)
                : covoit.heure_arrivee;
            // Calcul de la durée pour affichage
            const duree = getDureeHeuresSimple(covoit);
            const dureeAffichee = duree ? `${duree.h}h${String(duree.m).padStart(2, '0')}` : 'NC';
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center gap-4 border border-primary-light"
              >
                {/* Photo chauffeur */}
                <Image
                  src={covoit.chauffeur.photo}
                  alt={covoit.chauffeur.pseudo}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-primary">{covoit.chauffeur.pseudo}</span>
                    <span className="text-yellow-500">★ {covoit.chauffeur.note}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {covoit.nb_place} place(s) restante(s) &bull; {covoit.prix_personne} € / pers
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    Départ : {dateDep ? dateDep.toLocaleDateString('fr-FR') : ''} à {heureDep}{' '}
                    &bull; Arrivée : {dateArr ? dateArr.toLocaleDateString('fr-FR') : ''} à{' '}
                    {heureArr}
                    &bull; Durée : {dureeAffichee}
                  </div>
                  {covoit.ecologique ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Trajet écologique
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Trajet standard
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="btn btn-success px-4 py-2 rounded border border-green-600 text-white bg-green-600 hover:bg-green-700 transition">
                    Réserver
                  </button>
                  <button className="btn btn-outline-primary px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition">
                    Détail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
