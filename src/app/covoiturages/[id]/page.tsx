import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function CovoiturageDetailPage({ params }: { params: { id: string } }) {
  // Utilise la variable d'environnement pour l'URL de base
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/covoiturages/${params.id}`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const data = await res.json();
  const covoit = data.covoiturage;

  // Formatage date/heure comme dans la liste
  function formatDateFr(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('fr-FR');
    // Si ce n'est pas un format ISO, on retourne tel quel
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d2] = dateStr.split('-');
      return `${d2}/${m}/${y}`;
    }
    return dateStr;
  }
  function formatHeure(heure: string) {
    if (!heure) return '';
    // Si format ISO, extraire l'heure
    if (heure.length > 5 && heure.includes('T')) {
      const d = new Date(heure);
      if (!isNaN(d.getTime()))
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    // Si format HH:mm:ss ou HH:mm
    return heure.slice(0, 5);
  }
  // Calcul de la durée simple
  function getDureeHeuresSimple(heure_depart: string, heure_arrivee: string) {
    function toMinutes(heure: string) {
      if (!heure) return NaN;
      const [h, m] = heure.split(':');
      return parseInt(h, 10) * 60 + parseInt(m, 10);
    }
    if (!heure_depart || !heure_arrivee) return null;
    const dep = toMinutes(heure_depart);
    const arr = toMinutes(heure_arrivee);
    if (isNaN(dep) || isNaN(arr) || arr < dep) return null;
    const diff = arr - dep;
    return { h: Math.floor(diff / 60), m: diff % 60 };
  }
  const duree = getDureeHeuresSimple(covoit.heure_depart, covoit.heure_arrivee);
  const dureeAffichee = duree ? `${duree.h}h${String(duree.m).padStart(2, '0')}` : 'NC';

  // Badge écologique cohérent
  const isEco =
    covoit.voiture.energie &&
    ['electrique', 'hybride'].includes(covoit.voiture.energie.toLowerCase());

  // Formatage date pour l'URL (yyyy-mm-dd)
  function formatDateForUrl(dateStr: string) {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('/');
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  }
  const dateUrl = formatDateForUrl(covoit.date_depart);

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Détail du covoiturage</h1>
      {/* Infos principales */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Informations principales</h2>
        <div className="flex items-center gap-4 mb-2">
          <Image
            src={covoit.chauffeur.photo}
            alt={covoit.chauffeur.pseudo}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <div className="font-bold text-primary text-lg">
              {covoit.chauffeur.pseudo}{' '}
              <span className="text-yellow-500">★ {covoit.chauffeur.note}</span>
            </div>
            <div className="text-sm text-gray-700">
              {covoit.chauffeur.civilite} {covoit.chauffeur.prenom} {covoit.chauffeur.nom}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          {covoit.nb_place} place(s) restante(s) &bull; {covoit.prix_personne} € / pers
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Départ : {formatDateFr(covoit.date_depart)} à {formatHeure(covoit.heure_depart)} &bull;
          Arrivée : {formatDateFr(covoit.date_arrivee)} à {formatHeure(covoit.heure_arrivee)} &bull;
          Durée : {dureeAffichee}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          De {covoit.lieu_depart} à {covoit.lieu_arrivee}
        </div>
        {isEco ? (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Trajet écologique
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Trajet standard
          </span>
        )}
      </section>
      {/* Véhicule */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Véhicule</h2>
        <div className="text-sm text-gray-700 mb-1">Modèle : {covoit.voiture.modele}</div>
        <div className="text-sm text-gray-700 mb-1">Marque : {covoit.voiture.marque}</div>
        <div className="text-sm text-gray-700 mb-1">Énergie : {covoit.voiture.energie}</div>
      </section>
      {/* Avis conducteur */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Avis du conducteur</h2>
        {covoit.avis.length === 0 ? (
          <div className="text-gray-500">Aucun avis pour ce conducteur.</div>
        ) : (
          <ul className="space-y-2">
            {covoit.avis.map((a: { note: number; commentaire: string }, idx: number) => (
              <li key={idx} className="bg-gray-50 rounded p-2 border border-gray-200">
                <span className="font-semibold text-yellow-600">★ {a.note}</span> - {a.commentaire}
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Préférences conducteur */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Préférences du conducteur</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Fumeur : {covoit.preferences.fumeur ? 'Oui' : 'Non'}</li>
          <li>Animaux acceptés : {covoit.preferences.animaux ? 'Oui' : 'Non'}</li>
          <li>Musique : {covoit.preferences.musique ? 'Oui' : 'Non'}</li>
          <li>Girl only : {covoit.preferences.girl_only ? 'Oui' : 'Non'}</li>
        </ul>
      </section>
      <a
        href={`/covoiturages?depart=${encodeURIComponent(covoit.lieu_depart)}&arrivee=${encodeURIComponent(covoit.lieu_arrivee)}&date=${dateUrl}`}
        className="text-primary underline"
      >
        &larr; Retour à la liste
      </a>
    </main>
  );
}
