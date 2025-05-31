'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InscriptionPage() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!pseudo || !email || !password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création du compte.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/connexion'), 2000);
      }
    } catch {
      setError('Erreur réseau ou serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
          className="input input-bordered px-4 py-2 rounded border text-gray-900"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input input-bordered px-4 py-2 rounded border text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input input-bordered px-4 py-2 rounded border text-gray-900"
          required
        />
        <div className="text-xs text-gray-500 mb-2">
          Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.
        </div>
        <button
          type="submit"
          className="btn btn-primary px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Création en cours...' : 'Créer mon compte'}
        </button>
        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-center text-sm">
            Compte créé avec succès ! Redirection...
          </div>
        )}
      </form>
    </main>
  );
}
