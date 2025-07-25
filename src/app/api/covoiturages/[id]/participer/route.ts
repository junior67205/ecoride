import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const session = await getServerSession(authOptions);

  // Vérifier si l'utilisateur est connecté
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: 'Vous devez être connecté pour participer à un covoiturage' }),
      { status: 401 }
    );
  }

  const covoiturageId = params.id;
  if (!covoiturageId) {
    return new Response(JSON.stringify({ error: 'ID manquant' }), { status: 400 });
  }

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecoride',
  });

  try {
    // Vérifier si le covoiturage existe et récupérer les informations nécessaires
    const [rows] = await connection.execute(
      `SELECT c.*, u.credit 
       FROM covoiturage c
       JOIN utilisateur u ON c.utilisateur_id = u.utilisateur_id
       WHERE c.covoiturage_id = ? AND c.statut = 'ouvert'`,
      [covoiturageId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Covoiturage non trouvé ou non disponible' }), {
        status: 404,
      });
    }

    const covoiturage = rows[0] as {
      utilisateur_id: number;
      nb_place: number;
      prix_personne: number;
    };

    // Vérifier si l'utilisateur n'est pas déjà le conducteur
    if (covoiturage.utilisateur_id === Number(session.user.id)) {
      return new Response(
        JSON.stringify({ error: 'Vous ne pouvez pas participer à votre propre covoiturage' }),
        { status: 400 }
      );
    }

    // Vérifier s'il reste des places
    if (covoiturage.nb_place <= 0) {
      return new Response(
        JSON.stringify({ error: 'Désolé, il ne reste plus de places disponibles' }),
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a assez de crédit
    const [userRows] = await connection.execute(
      'SELECT credit FROM utilisateur WHERE utilisateur_id = ?',
      [session.user.id]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
    }

    const userCredit = (userRows[0] as { credit: number }).credit;
    if (userCredit < covoiturage.prix_personne) {
      return new Response(
        JSON.stringify({
          error: 'Crédit insuffisant',
          required: covoiturage.prix_personne,
          available: userCredit,
        }),
        { status: 400 }
      );
    }

    // Démarrer une transaction
    await connection.beginTransaction();

    try {
      // Calculer la répartition des crédits
      const prixTotal = covoiturage.prix_personne;
      const creditPlateforme = 2; // La plateforme reçoit toujours 2 crédits
      const creditChauffeur = prixTotal - creditPlateforme; // Le reste va au chauffeur

      // Mettre à jour le nombre de places
      await connection.execute(
        'UPDATE covoiturage SET nb_place = nb_place - 1 WHERE covoiturage_id = ?',
        [covoiturageId]
      );

      // Déduire le crédit de l'utilisateur
      await connection.execute(
        'UPDATE utilisateur SET credit = credit - ? WHERE utilisateur_id = ?',
        [prixTotal, session.user.id]
      );

      // Ajouter le crédit au conducteur (prix total - 2 crédits)
      await connection.execute(
        'UPDATE utilisateur SET credit = credit + ? WHERE utilisateur_id = ?',
        [creditChauffeur, covoiturage.utilisateur_id]
      );

      // Ajouter le crédit à la plateforme (toujours 2 crédits)
      // Récupérer l'ID de l'admin
      const [adminRows] = await connection.execute(
        'SELECT utilisateur_id FROM utilisateur WHERE type_utilisateur = "admin" LIMIT 1'
      );
      const adminId = (adminRows as RowDataPacket[])[0]?.utilisateur_id;
      if (adminId) {
        await connection.execute(
          'UPDATE utilisateur SET credit = credit + ? WHERE utilisateur_id = ?',
          [creditPlateforme, adminId]
        );
      }

      // Enregistrer la participation du passager
      await connection.execute(
        'INSERT INTO participation (utilisateur_id, covoiturage_id) VALUES (?, ?)',
        [session.user.id, covoiturageId]
      );

      // Valider la transaction
      await connection.commit();

      return new Response(
        JSON.stringify({
          message: 'Participation réussie',
          newCredit: userCredit - prixTotal,
          creditChauffeur,
          creditPlateforme,
        }),
        { status: 200 }
      );
    } catch (error) {
      // En cas d'erreur, annuler la transaction
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la participation:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la participation' }),
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}
