import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icône de maintenance */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Site en maintenance</h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8">
          Nous effectuons actuellement des travaux de maintenance pour améliorer votre expérience.
          <br />
          <br />
          Merci de votre patience. Le site sera bientôt de nouveau disponible.
        </p>

        {/* Informations supplémentaires */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Que se passe-t-il ?</h2>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Mise à jour des fonctionnalités
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Amélioration de la sécurité
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Optimisation des performances
            </li>
          </ul>
        </div>

        {/* Logo EcoRide */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-2xl font-extrabold text-primary">
            EcoRide
          </Link>
          <p className="text-sm text-gray-500 mt-2">Votre plateforme de covoiturage écologique</p>
        </div>
      </div>
    </div>
  );
}
