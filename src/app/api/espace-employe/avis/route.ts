import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  // Vérifier que l'utilisateur est un employé
  const user = await prisma.utilisateur.findUnique({
    where: { utilisateur_id: Number(session.user.id) },
    select: { type_utilisateur: true },
  });

  if (!user || (user.type_utilisateur !== 'employe' && user.type_utilisateur !== 'admin')) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé' }), { status: 403 });
  }

  try {
    // Récupérer toutes les participations avec avis (commentaire, note, avis non null)
    const participations = await prisma.$queryRaw`
      SELECT 
        p.participation_id,
        p.covoiturage_id,
        p.numero_dossier,
        p.commentaire,
        p.note,
        p.avis,
        p.validation,
        p.date_participation,
        u.pseudo as participant_pseudo,
        u.email as participant_email,
        c.lieu_depart,
        c.lieu_arrivee,
        c.date_depart,
        c.heure_depart,
        cu.pseudo as chauffeur_pseudo,
        cu.email as chauffeur_email
      FROM participation p
      JOIN utilisateur u ON p.utilisateur_id = u.utilisateur_id
      JOIN covoiturage c ON p.covoiturage_id = c.covoiturage_id
      JOIN utilisateur cu ON c.utilisateur_id = cu.utilisateur_id
      WHERE p.commentaire IS NOT NULL OR p.note IS NOT NULL OR p.avis IS NOT NULL
      ORDER BY p.date_participation DESC
    `;

    // Transformer les données pour l'affichage
    const avis = (
      participations as Array<{
        participation_id: number;
        covoiturage_id: number;
        numero_dossier: string | null;
        commentaire: string | null;
        note: number | null;
        avis: string | null;
        validation: boolean | null;
        date_participation: Date;
        participant_pseudo: string | null;
        participant_email: string | null;
        lieu_depart: string | null;
        lieu_arrivee: string | null;
        date_depart: Date | null;
        heure_depart: string | null;
        chauffeur_pseudo: string | null;
        chauffeur_email: string | null;
      }>
    ).map(participation => ({
      id: participation.participation_id,
      covoiturage_id: participation.covoiturage_id,
      numero_dossier: participation.numero_dossier,
      participant: {
        pseudo: participation.participant_pseudo || 'Anonyme',
        email: participation.participant_email || '',
      },
      chauffeur: {
        pseudo: participation.chauffeur_pseudo || 'Anonyme',
        email: participation.chauffeur_email || '',
      },
      commentaire: participation.commentaire || '',
      note: participation.note || 0,
      avis: participation.avis || '',
      date_creation: participation.date_participation,
      statut:
        participation.validation === true
          ? 'approuve'
          : participation.validation === false
            ? 'refuse'
            : 'en_attente',
      trajet: {
        lieu_depart: participation.lieu_depart || '',
        lieu_arrivee: participation.lieu_arrivee || '',
        date_depart: participation.date_depart || '',
        heure_depart: participation.heure_depart || '',
      },
    }));

    return new Response(JSON.stringify({ avis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des avis' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
