'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Employe {
  utilisateur_id: number;
  nom: string;
  prenom: string;
  email: string;
  pseudo: string;
  suspendu: boolean;
}

function AddEmployeForm({ onEmployeAdded }: { onEmployeAdded: (newEmploye: Employe) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/espace-admin/employes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom, prenom }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'employé");
      }

      const newEmploye = await response.json();
      onEmployeAdded(newEmploye);
      // Reset form
      setEmail('');
      setPassword('');
      setNom('');
      setPrenom('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-6 bg-gray-50 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Ajouter un employé</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
          placeholder="Prénom"
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={nom}
          onChange={e => setNom(e.target.value)}
          placeholder="Nom"
          required
          className="p-2 border rounded"
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default function GestionEmployesSection() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchEmployes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/espace-admin/employes');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des employés');
      }
      const data = await response.json();
      setEmployes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployes();
  }, []);

  const handleEmployeAdded = (newEmploye: Employe) => {
    setEmployes(prev => [newEmploye, ...prev]);
    setShowAddForm(false);
  };

  const handleToggleSuspension = async (employe: Employe) => {
    setUpdating(employe.utilisateur_id);

    try {
      const response = await fetch('/api/espace-admin/employes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: employe.utilisateur_id,
          suspendu: !employe.suspendu,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du statut');
      }

      const updatedEmploye = await response.json();
      setEmployes(prev =>
        prev.map(e => (e.utilisateur_id === employe.utilisateur_id ? updatedEmploye : e))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (employe: Employe) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employe.prenom} ${employe.nom} ?`)
    ) {
      return;
    }

    setUpdating(employe.utilisateur_id);

    try {
      const response = await fetch(`/api/espace-admin/employes/${employe.utilisateur_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'employé");
      }

      setEmployes(prev => prev.filter(e => e.utilisateur_id !== employe.utilisateur_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setUpdating(null);
    }
  };

  if (loading && employes.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Gestion des Employés</h2>
        <p>Chargement des employés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Gestion des Employés</h2>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gestion des Employés</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded"
        >
          {showAddForm ? 'Annuler' : 'Ajouter un employé'}
        </button>
      </div>

      {showAddForm && <AddEmployeForm onEmployeAdded={handleEmployeAdded} />}

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
                Statut
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employes.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  Aucun employé trouvé.
                </td>
              </tr>
            ) : (
              employes.map(employe => (
                <tr key={employe.utilisateur_id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {employe.prenom} {employe.nom}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{employe.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{employe.pseudo}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        employe.suspendu ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {employe.suspendu ? 'Suspendu' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleSuspension(employe)}
                        disabled={updating === employe.utilisateur_id}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          employe.suspendu
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        } disabled:opacity-50`}
                      >
                        {updating === employe.utilisateur_id
                          ? '...'
                          : employe.suspendu
                            ? 'Réactiver'
                            : 'Suspendre'}
                      </button>
                      {employe.suspendu && (
                        <button
                          onClick={() => handleDelete(employe)}
                          disabled={updating === employe.utilisateur_id}
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
