'use client';
import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SectionCard from './SectionCard';

interface Probleme {
  covoiturage_id: number;
  numero_dossier: string;
  participant: {
    pseudo: string;
    email: string;
  };
  chauffeur: {
    pseudo: string;
    email: string;
  };
  trajet: {
    lieu_depart: string;
    lieu_arrivee: string;
    date_depart: string;
    heure_depart: string;
    date_arrivee: string;
    heure_arrivee: string;
  };
  probleme: {
    commentaire: string;
    note: number;
    avis: string;
    date_signalement: string;
  };
}

export default function ProblemesSection() {
  const [problemes, setProblemes] = useState<Probleme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProblemes();
  }, []);

  const fetchProblemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/espace-employe/problemes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des problèmes');
      }
      const data = await response.json();
      setProblemes(data.problemes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <SectionCard>
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold mb-2">Erreur</h3>
          <p>{error}</p>
        </div>
      </SectionCard>
    );
  }

  if (problemes.length === 0) {
    return (
      <SectionCard>
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun covoiturage problématique signalé</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Covoiturages Problématiques</h2>
          <p className="text-sm text-gray-500">
            {problemes.length} covoiturage(s) avec problème(s) signalé(s)
          </p>
        </div>

        <div className="space-y-6">
          {problemes.map(probleme => (
            <div key={probleme.covoiturage_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* En-tête avec numéro de covoiturage */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Problème signalé
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      Covoiturage #{probleme.covoiturage_id}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
                      {probleme.numero_dossier}
                    </span>
                  </div>

                  {/* Informations du trajet */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Trajet : {probleme.trajet.lieu_depart} → {probleme.trajet.lieu_arrivee}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-500 mb-1">Date de départ</p>
                        <p className="text-sm text-gray-900">
                          {new Date(probleme.trajet.date_depart).toLocaleDateString('fr-FR')} à{' '}
                          {probleme.trajet.heure_depart}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500 mb-1">Date d&apos;arrivée</p>
                        <p className="text-sm text-gray-900">
                          {new Date(probleme.trajet.date_arrivee).toLocaleDateString('fr-FR')} à{' '}
                          {probleme.trajet.heure_arrivee}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations des utilisateurs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 mb-2">Participant</h4>
                      <p className="text-sm font-medium text-blue-800">
                        {probleme.participant.pseudo}
                      </p>
                      <p className="text-xs text-blue-600">{probleme.participant.email}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 mb-2">Chauffeur</h4>
                      <p className="text-sm font-medium text-green-800">
                        {probleme.chauffeur.pseudo}
                      </p>
                      <p className="text-xs text-green-600">{probleme.chauffeur.email}</p>
                    </div>
                  </div>

                  {/* Détails du problème */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-3">Détails du problème</h4>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-red-800 mb-2">Note donnée</p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= probleme.probleme.note ? 'text-red-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-red-600">
                          ({probleme.probleme.note}/5)
                        </span>
                      </div>
                    </div>

                    {probleme.probleme.commentaire && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-800 mb-2">Commentaire</p>
                        <p className="text-sm text-red-700 bg-white p-3 rounded-md border border-red-200">
                          {probleme.probleme.commentaire}
                        </p>
                      </div>
                    )}

                    {probleme.probleme.avis && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-800 mb-2">Avis</p>
                        <p className="text-sm text-red-700 bg-white p-3 rounded-md border border-red-200">
                          {probleme.probleme.avis}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-red-600">
                      Signalé le{' '}
                      {new Date(probleme.probleme.date_signalement).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
