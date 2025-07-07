'use client';

import { useState, useEffect } from 'react';

interface Parametre {
  parametre_id: number;
  propriete: string;
  valeur: string;
}

export default function ConfigurationSection() {
  const [parametres, setParametres] = useState<Parametre[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchParametres();
  }, []);

  const fetchParametres = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/espace-admin/configuration');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la configuration');
      }
      const data = await response.json();
      setParametres(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setParametres(prev =>
      prev.map(p =>
        p.propriete === name ? { ...p, valeur: type === 'checkbox' ? String(checked) : value } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const body = parametres.reduce(
        (acc, p) => {
          acc[p.propriete] = p.valeur;
          return acc;
        },
        {} as { [key: string]: string }
      );

      const response = await fetch('/api/espace-admin/configuration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la configuration');
      }

      setSuccess('Configuration mise à jour avec succès !');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    } finally {
      setSaving(false);
    }
  };

  // Générer un label lisible à partir du nom du paramètre
  const getLabel = (propriete: string) => {
    return propriete.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Déterminer le type de champ à afficher
  const getInputType = (valeur: string, propriete: string) => {
    if (valeur === 'true' || valeur === 'false') return 'checkbox';
    if (!isNaN(Number(valeur)) && propriete !== 'telephone') return 'number';
    return 'text';
  };

  // Liste des paramètres à afficher
  const allowedParams = ['mode_maintenance', 'afficher_galerie_homepage'];

  if (loading) {
    return <p>Chargement de la configuration...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Configuration du site</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {parametres
          .filter(param => allowedParams.includes(param.propriete))
          .map(param => (
            <div
              key={param.parametre_id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <label className="text-gray-700 font-medium w-1/2" htmlFor={param.propriete}>
                {getLabel(param.propriete)}
                {param.propriete === 'activer_paiement_en_ligne' && (
                  <span className="ml-2 text-xs text-gray-500">(option à venir)</span>
                )}
                {param.propriete === 'tentatives_connexion_max' && (
                  <span className="ml-2 text-xs text-gray-500">(option à venir)</span>
                )}
                {param.propriete === 'mot_de_passe_longueur_min' && (
                  <span className="ml-2 text-xs text-gray-500">(option à venir)</span>
                )}
                {param.propriete === 'delai_annulation' && (
                  <span className="ml-2 text-xs text-gray-500">(option à venir)</span>
                )}
              </label>
              {getInputType(param.valeur, param.propriete) === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={param.propriete}
                  id={param.propriete}
                  checked={param.valeur === 'true'}
                  onChange={handleInputChange}
                  className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={getInputType(param.valeur, param.propriete)}
                  name={param.propriete}
                  id={param.propriete}
                  value={param.valeur}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          ))}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded disabled:bg-primary-light"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
}
