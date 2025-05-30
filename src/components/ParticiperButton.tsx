'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ParticiperButtonProps {
  covoiturageId: number;
  nbPlaces: number;
  prixPersonne: number;
}

export default function ParticiperButton({
  covoiturageId,
  nbPlaces,
  prixPersonne,
}: ParticiperButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (status === 'unauthenticated') {
      router.push('/connexion?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }
    if (nbPlaces <= 0) {
      setError('Désolé, il ne reste plus de places disponibles');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    setShowConfirm(false);
    try {
      const response = await fetch(`/api/covoiturages/${covoiturageId}/participer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/connexion?callbackUrl=' + encodeURIComponent(window.location.href));
          return;
        }
        throw new Error(data.error || 'Une erreur est survenue');
      }
      router.refresh();
      router.push('/mon-compte?message=participation_success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className="w-full btn btn-disabled px-6 py-3 rounded-lg bg-gray-300 text-gray-500 font-semibold text-lg flex items-center justify-center gap-2"
      >
        <svg
          className="animate-spin h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Chargement...
      </button>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={isLoading || nbPlaces <= 0}
        className={`w-full btn ${
          nbPlaces <= 0
            ? 'btn-disabled bg-gray-300 text-gray-500'
            : 'btn-success bg-green-600 text-white hover:bg-green-700'
        } px-6 py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Participation en cours...
          </>
        ) : nbPlaces <= 0 ? (
          'Plus de places disponibles'
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Participer à ce covoiturage ({prixPersonne} €)
          </>
        )}
      </button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center">Confirmation</h2>
            <p className="mb-4 text-center">
              Ce trajet coûte <span className="font-semibold">{prixPersonne} crédits</span>.<br />
              Voulez-vous vraiment participer et déduire ces crédits de votre solde ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="btn btn-success px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={isLoading}
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-outline px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}
    </div>
  );
}
