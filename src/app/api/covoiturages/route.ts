import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

type Suggestion = {
  id: number;
  chauffeur: {
    pseudo: string;
    photo: string;
    note: number | null;
  };
  nb_place: number;
  prix_personne: number;
  date_depart: string;
  heure_depart: string;
  date_arrivee: string;
  heure_arrivee: string;
  ecologique: boolean;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const depart = searchParams.get('depart');
  const arrivee = searchParams.get('arrivee');
  const date = searchParams.get('date');

  console.log({ depart, arrivee, date }); // Debug

  if (!depart || !arrivee || !date) {
    return new Response(JSON.stringify({ error: 'Paramètres manquants' }), { status: 400 });
  }

  // Connexion à la base MySQL (adapter les infos de connexion)
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Mets ton mot de passe MySQL ici
    database: 'ecoride',
  });

  // Requête SQL pour trouver les covoiturages correspondants
  const [rows] = await connection.execute(
    `SELECT c.*, u.pseudo, u.photo, 
            (SELECT AVG(CAST(note AS DECIMAL(2,1))) FROM avis WHERE utilisateur_id = c.utilisateur_id) as note,
            v.energie
     FROM covoiturage c
     JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
     JOIN voiture v ON c.voiture_id = v.voiture_id
     WHERE TRIM(LOWER(c.lieu_depart)) = TRIM(LOWER(?))
       AND TRIM(LOWER(c.lieu_arrivee)) = TRIM(LOWER(?))
       AND c.date_depart = ?
       AND c.nb_place > 0`,
    [depart, arrivee, date]
  );

  // Correction du typage pour rows
  const covoiturages = Array.isArray(rows)
    ? (rows as RowDataPacket[]).map(row => ({
        id: row.covoiturage_id,
        chauffeur: {
          pseudo: row.pseudo,
          photo: row.photo ? `/uploads/${row.photo}` : '/default-user.png',
          note: row.note ? Number(row.note) : null,
        },
        nb_place: row.nb_place,
        prix_personne: row.prix_personne,
        date_depart: row.date_depart,
        heure_depart: row.heure_depart,
        date_arrivee: row.date_arrivee,
        heure_arrivee: row.heure_arrivee,
        ecologique: row.energie && ['electrique', 'hybride'].includes(row.energie.toLowerCase()),
      }))
    : [];

  // Si aucun covoiturage trouvé, chercher les prochains disponibles
  let suggestions: Suggestion[] = [];
  if (covoiturages.length === 0) {
    const [nextRows] = await connection.execute(
      `SELECT c.*, u.pseudo, u.photo, 
              (SELECT AVG(CAST(note AS DECIMAL(2,1))) FROM avis WHERE utilisateur_id = c.utilisateur_id) as note,
              v.energie
       FROM covoiturage c
       JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
       JOIN voiture v ON c.voiture_id = v.voiture_id
       WHERE TRIM(LOWER(c.lieu_depart)) = TRIM(LOWER(?))
         AND TRIM(LOWER(c.lieu_arrivee)) = TRIM(LOWER(?))
         AND c.date_depart > ?
         AND c.nb_place > 0
       ORDER BY c.date_depart ASC, c.heure_depart ASC
       LIMIT 3`, // On propose jusqu'à 3 suggestions
      [depart, arrivee, date]
    );
    if (Array.isArray(nextRows) && nextRows.length > 0) {
      const rowsArray = nextRows as RowDataPacket[];
      suggestions = rowsArray.map(row => ({
        id: row.covoiturage_id,
        chauffeur: {
          pseudo: row.pseudo,
          photo: row.photo ? `/uploads/${row.photo}` : '/default-user.png',
          note: row.note ? Number(row.note) : null,
        },
        nb_place: row.nb_place,
        prix_personne: row.prix_personne,
        date_depart: row.date_depart,
        heure_depart: row.heure_depart,
        date_arrivee: row.date_arrivee,
        heure_arrivee: row.heure_arrivee,
        ecologique: row.energie && ['electrique', 'hybride'].includes(row.energie.toLowerCase()),
      }));
    }
  }

  await connection.end();

  return new Response(JSON.stringify({ results: covoiturages, suggestions }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
