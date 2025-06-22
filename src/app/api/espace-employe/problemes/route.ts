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
    // Récupérer les participations avec validation = false (problèmes signalés)
    const participations = await prisma.participation.findMany({
      where: {
        validation: false, // Problèmes signalés
      },
      select: {
        participation_id: true,
        covoiturage_id: true,
        numero_dossier: true,
        commentaire: true,
        note: true,
        avis: true,
        date_participation: true,
        utilisateur: {
          select: {
            utilisateur_id: true,
            pseudo: true,
            email: true,
          },
        },
        covoiturage: {
          select: {
            lieu_depart: true,
            lieu_arrivee: true,
            date_depart: true,
            heure_depart: true,
            date_arrivee: true,
            heure_arrivee: true,
            utilisateur: {
              select: {
                utilisateur_id: true,
                pseudo: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { date_participation: 'desc' },
    });

    // Transformer les données pour l'affichage
    const problemes = participations.map(participation => ({
      covoiturage_id: participation.covoiturage_id,
      numero_dossier: participation.numero_dossier,
      participant: {
        pseudo: participation.utilisateur.pseudo || 'Anonyme',
        email: participation.utilisateur.email || '',
      },
      chauffeur: {
        pseudo: participation.covoiturage.utilisateur?.pseudo || 'Anonyme',
        email: participation.covoiturage.utilisateur?.email || '',
      },
      trajet: {
        lieu_depart: participation.covoiturage.lieu_depart || '',
        lieu_arrivee: participation.covoiturage.lieu_arrivee || '',
        date_depart: participation.covoiturage.date_depart || '',
        heure_depart: participation.covoiturage.heure_depart || '',
        date_arrivee: participation.covoiturage.date_arrivee || '',
        heure_arrivee: participation.covoiturage.heure_arrivee || '',
      },
      probleme: {
        commentaire: participation.commentaire || '',
        note: participation.note || 0,
        avis: participation.avis || '',
        date_signalement: participation.date_participation,
      },
    }));

    return new Response(JSON.stringify({ problemes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des problèmes:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des problèmes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
