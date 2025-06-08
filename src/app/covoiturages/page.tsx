'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CovoiturageFiltres from './CovoiturageFiltres';
import SuggestionsList from './components/SuggestionsList';
import SearchForm from './components/SearchForm';
import CovoiturageResults from './components/CovoiturageResults';
import AucunResultatMessage from './components/AucunResultatMessage';
import { Covoiturage } from './types';
import { normalizeDate } from './utils/dateUtils';
import { filterCovoiturages } from './utils/filtreUtils';

// Exemple de données mockées pour l'affichage initial
const MOCK_COVOITURAGES: Covoiturage[] = [];

export default function CovoituragesPage() {
  const searchParams = useSearchParams();

  const [depart, setDepart] = useState(searchParams.get('depart') || '');
  const [arrivee, setArrivee] = useState(searchParams.get('arrivee') || '');
  const [date, setDate] = useState(normalizeDate(searchParams.get('date')));
  const [results, setResults] = useState<Covoiturage[]>(MOCK_COVOITURAGES);
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<Covoiturage[]>([]);
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
      setDate(normalizeDate(searchParams.get('date')));
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
          setSuggestions(data.suggestions || []);
        } catch {
          setResults([]);
          setSuggestions([]);
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
      setSuggestions(data.suggestions || []);
    } catch {
      setResults([]);
      setSuggestions([]);
    }
  };

  // Application des filtres côté client (factorisée)
  const filteredResults = filterCovoiturages(results, {
    filtreEco,
    filtrePrix,
    filtreDuree,
    filtreNote,
  });

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Rechercher un covoiturage
      </h1>
      <SearchForm
        depart={depart}
        arrivee={arrivee}
        date={date}
        onDepartChange={e => setDepart(e.target.value)}
        onArriveeChange={e => setArrivee(e.target.value)}
        onDateChange={e => setDate(normalizeDate(e.target.value))}
        onSubmit={handleSubmit}
      />

      {/* Résultats de recherche */}
      {submitted && results.length === 0 && !suggestions.length && <AucunResultatMessage />}
      {submitted && results.length === 0 && suggestions.length > 0 && (
        <SuggestionsList suggestions={suggestions} />
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
      <CovoiturageResults results={filteredResults} />
    </main>
  );
}
