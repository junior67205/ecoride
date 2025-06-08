import { useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/app/context/UserContext';
import SectionCard from './components/SectionCard';
import AlertMessage from './components/AlertMessage';

export default function HistoriqueSection() {
  const {
    historique,
    historiqueLoading: loading,
    historiqueError: error,
    refreshHistorique,
    handleAnnulation,
  } = useUser();

  useEffect(() => {
    refreshHistorique();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuitterCovoiturage = async (id: number) => {
    try {
      const res = await fetch(`/api/mon-espace/covoiturage/${id}/quitter`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la demande de quitter le covoiturage.');
      }
      // Rafraîchir l'historique après avoir quitté
      refreshHistorique();
    } catch (err) {
      console.error('Erreur lors de la demande de quitter le covoiturage:', err);
      // (Optionnel : afficher une alerte ou un message d'erreur)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (historique.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun covoiturage dans votre historique</p>
      </div>
    );
  }

  return (
    <SectionCard>
      <div className="space-y-6">
        {historique.map(covoiturage => (
          <div key={covoiturage.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        covoiturage.role === 'chauffeur'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {covoiturage.role === 'chauffeur' ? 'Chauffeur' : 'Passager'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        covoiturage.statut === 'annule'
                          ? 'bg-red-100 text-red-800'
                          : covoiturage.statut === 'termine'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {covoiturage.statut === 'annule'
                        ? 'Annulé'
                        : covoiturage.statut === 'termine'
                          ? 'Terminé'
                          : 'En cours'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    {covoiturage.lieu_depart} → {covoiturage.lieu_arrivee}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {format(new Date(covoiturage.date_depart), 'EEEE d MMMM yyyy', { locale: fr })}
                    {' à '}
                    {covoiturage.heure_depart &&
                    /^\d{2}:\d{2}(:\d{2})?$/.test(covoiturage.heure_depart)
                      ? format(new Date(`2000-01-01T${covoiturage.heure_depart}`), 'HH:mm')
                      : '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {covoiturage.prix_personne} crédits
                  </p>
                  <p className="text-sm text-gray-500">
                    {covoiturage.participants.length} participant
                    {covoiturage.participants.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {covoiturage.voiture && (
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Véhicule : {covoiturage.voiture.marque} {covoiturage.voiture.modele}
                    {' - '}
                    {covoiturage.voiture.immatriculation}
                  </p>
                </div>
              )}

              {covoiturage.participants.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Participants :</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {covoiturage.participants.map(participant => (
                      <li key={participant.id} className="py-2 flex items-center justify-between">
                        <div className="flex items-center">
                          {participant.photo ? (
                            <img
                              src={participant.photo}
                              alt={participant.pseudo}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-500">
                                {participant.pseudo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {participant.pseudo}
                            </p>
                            <p className="text-xs text-gray-500">
                              Inscrit le{' '}
                              {format(new Date(participant.date_participation), 'dd/MM/yyyy', {
                                locale: fr,
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {covoiturage.role === 'chauffeur' && covoiturage.statut !== 'annule' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      handleAnnulation(covoiturage.id);
                      toast.success('Covoiturage annulé avec succès');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Annuler le covoiturage
                  </button>
                </div>
              )}

              {covoiturage.role === 'passager' && covoiturage.statut !== 'annule' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleQuitterCovoiturage(covoiturage.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Quitter le covoiturage
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <AlertMessage message={error} type="error" />}
    </SectionCard>
  );
}
