import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const covoiturageId = params.id;
  if (!covoiturageId) {
    return new Response(JSON.stringify({ error: 'ID manquant' }), { status: 400 });
  }

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Mets ton mot de passe MySQL ici
    database: 'ecoride',
  });

  // Récupérer les infos principales + voiture + marque + conducteur
  const [rows] = await connection.execute(
    `SELECT c.*, u.pseudo, u.photo, u.civilite, u.nom, u.prenom,
            v.modele, v.energie, m.libelle as marque,
            (SELECT AVG(CAST(note AS DECIMAL(2,1))) FROM avis WHERE utilisateur_id = u.utilisateur_id) as note
     FROM covoiturage c
     JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
     JOIN voiture v ON c.voiture_id = v.voiture_id
     JOIN marque m ON v.marque_id = m.marque_id
     WHERE c.covoiturage_id = ?
     LIMIT 1`,
    [covoiturageId]
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    await connection.end();
    return new Response(JSON.stringify({ error: 'Covoiturage non trouvé' }), { status: 404 });
  }
  const row = rows[0] as RowDataPacket;

  // Récupérer les avis du conducteur
  const [avisRows] = await connection.execute(
    `SELECT commentaire, note, statut FROM avis WHERE utilisateur_id = ? AND statut = 'valide'`,
    [row.utilisateur_id]
  );

  // Préférences du conducteur (exemple : fumeur, animaux, musique, girl only)
  // À adapter selon ta base, ici on simule des préférences
  const preferences = {
    fumeur: row.fumeur ?? false,
    animaux: row.animaux ?? false,
    musique: row.musique ?? true,
    girl_only: row.girl_only ?? false,
  };

  await connection.end();

  return new Response(
    JSON.stringify({
      covoiturage: {
        id: row.covoiturage_id,
        chauffeur: {
          pseudo: row.pseudo,
          photo: row.photo ? `/uploads/${row.photo}` : '/default-user.png',
          note: row.note ? Number(row.note) : null,
          civilite: row.civilite,
          nom: row.nom,
          prenom: row.prenom,
        },
        nb_place: row.nb_place,
        prix_personne: row.prix_personne,
        date_depart: row.date_depart,
        heure_depart: row.heure_depart,
        date_arrivee: row.date_arrivee,
        heure_arrivee: row.heure_arrivee,
        ecologique: row.energie && row.energie.toLowerCase() === 'electrique',
        lieu_depart: row.lieu_depart,
        lieu_arrivee: row.lieu_arrivee,
        statut: row.statut,
        voiture: {
          modele: row.modele,
          marque: row.marque,
          energie: row.energie,
        },
        avis: Array.isArray(avisRows)
          ? (avisRows as RowDataPacket[]).map(a => ({
              commentaire: a.commentaire,
              note: a.note,
              statut: a.statut,
            }))
          : [],
        preferences,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
