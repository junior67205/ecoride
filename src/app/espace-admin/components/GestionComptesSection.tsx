'use client';

import { useState, useEffect } from 'react';

interface Compte {
  utilisateur_id: number;
  nom: string;
  prenom: string;
  email: string;
  pseudo: string;
  type_utilisateur: string;
  credit: number;
  suspendu: boolean;
}

export default function GestionComptesSection() {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchComptes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/espace-admin/comptes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des comptes');
      }
      const data = await response.json();
      setComptes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  const handleToggleSuspension = async (compte: Compte) => {
    setUpdating(compte.utilisateur_id);

    try {
      const response = await fetch('/api/espace-admin/comptes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: compte.utilisateur_id,
          suspendu: !compte.suspendu,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du statut');
      }

      const updatedCompte = await response.json();
      setComptes(prev =>
        prev.map(c => (c.utilisateur_id === compte.utilisateur_id ? updatedCompte : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (compte: Compte) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${compte.prenom} ${compte.nom} ?`)
    ) {
      return;
    }

    setUpdating(compte.utilisateur_id);

    try {
      const response = await fetch(`/api/espace-admin/comptes/${compte.utilisateur_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du compte');
      }

      setComptes(prev => prev.filter(c => c.utilisateur_id !== compte.utilisateur_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Gestion des Comptes</h2>
        <p>Chargement des comptes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Gestion des Comptes</h2>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestion des Comptes Utilisateurs</h2>
      <p className="text-gray-600 mb-6">
        Gérez les comptes des utilisateurs de la plateforme. Les employés sont gérés dans la section
        &quot;Gestion des Employés&quot;.
      </p>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom complet
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pseudo
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Crédits
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {comptes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              comptes.map(compte => (
                <tr key={compte.utilisateur_id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {compte.prenom} {compte.nom}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{compte.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{compte.pseudo}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {Number(compte.credit).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        compte.suspendu ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {compte.suspendu ? 'Suspendu' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleSuspension(compte)}
                        disabled={updating === compte.utilisateur_id}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          compte.suspendu
                            ? 'bg-primary hover:bg-primary-light text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        } disabled:opacity-50`}
                      >
                        {updating === compte.utilisateur_id
                          ? '...'
                          : compte.suspendu
                            ? 'Réactiver'
                            : 'Suspendre'}
                      </button>
                      {compte.suspendu && (
                        <button
                          onClick={() => handleDelete(compte)}
                          disabled={updating === compte.utilisateur_id}
                          className="px-3 py-1 rounded text-xs font-semibold bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
