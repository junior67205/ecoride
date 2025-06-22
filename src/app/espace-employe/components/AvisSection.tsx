'use client';
import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SectionCard from './SectionCard';

interface Avis {
  id: number;
  covoiturage_id: number;
  numero_dossier?: string;
  participant: {
    pseudo: string;
    email: string;
  };
  chauffeur: {
    pseudo: string;
    email: string;
  };
  commentaire: string;
  note: number;
  avis: string;
  date_creation: string;
  statut: 'en_attente' | 'approuve' | 'refuse';
  trajet: {
    lieu_depart: string;
    lieu_arrivee: string;
    date_depart: string;
    heure_depart: string;
  };
}

export default function AvisSection() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/espace-employe/avis');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avis');
      }
      const data = await response.json();
      setAvis(data.avis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (avisId: number, action: 'approuver' | 'refuser') => {
    try {
      const response = await fetch(`/api/espace-employe/avis/${avisId}/validation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la validation');
      }

      toast.success(`Avis ${action === 'approuver' ? 'approuvé' : 'refusé'} avec succès`);
      fetchAvis(); // Rafraîchir la liste
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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

  if (avis.length === 0) {
    return (
      <SectionCard>
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun avis en attente de validation</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Avis en attente de validation
          </h2>
          <p className="text-sm text-gray-500">
            {avis.filter(a => a.statut === 'en_attente').length} avis en attente
          </p>
        </div>

        <div className="space-y-6">
          {avis.map(avisItem => (
            <div key={avisItem.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        avisItem.statut === 'en_attente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : avisItem.statut === 'approuve'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {avisItem.statut === 'en_attente'
                        ? 'En attente'
                        : avisItem.statut === 'approuve'
                          ? 'Approuvé'
                          : 'Refusé'}
                    </span>
                    {avisItem.statut === 'refuse' && avisItem.numero_dossier && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
                        {avisItem.numero_dossier}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Trajet : {avisItem.trajet.lieu_depart} → {avisItem.trajet.lieu_arrivee}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">Participant</p>
                      <p className="text-sm text-blue-800">{avisItem.participant.pseudo}</p>
                      <p className="text-xs text-blue-600">{avisItem.participant.email}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900 mb-1">Chauffeur</p>
                      <p className="text-sm text-green-800">{avisItem.chauffeur.pseudo}</p>
                      <p className="text-xs text-green-600">{avisItem.chauffeur.email}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Date du trajet</p>
                    <p className="text-sm text-gray-900">
                      {new Date(avisItem.trajet.date_depart).toLocaleDateString('fr-FR')} à{' '}
                      {avisItem.trajet.heure_depart}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Note</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star <= avisItem.note ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({avisItem.note}/5)</span>
                    </div>
                  </div>

                  {avisItem.commentaire && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Commentaire</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {avisItem.commentaire}
                      </p>
                    </div>
                  )}

                  {avisItem.avis && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Avis</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {avisItem.avis}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Déposé le {new Date(avisItem.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {avisItem.statut === 'en_attente' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleValidation(avisItem.id, 'approuver')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleValidation(avisItem.id, 'refuser')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
