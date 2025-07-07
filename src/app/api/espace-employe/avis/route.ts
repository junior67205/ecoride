import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour convertir les BigInt en nombres
function convertBigInts(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  }
  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      converted[key] = convertBigInts(value);
    }
    return converted;
  }
  return obj;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  // Vérifier que l'utilisateur est un employé
  const user = await prisma.utilisateur.findUnique({
    where: { utilisateur_id: Number(session.user.id) },
    select: { type_utilisateur: true },
  });

  if (!user || (user.type_utilisateur !== 'employe' && user.type_utilisateur !== 'admin')) {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const participations = await prisma.participation.findMany({
      where: {
        OR: [{ commentaire: { not: null } }, { note: { not: null } }, { avis: { not: null } }],
      },
      include: {
        utilisateur: {
          select: {
            pseudo: true,
            email: true,
          },
        },
        covoiturage: {
          include: {
            utilisateur: {
              select: {
                pseudo: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_participation: 'desc',
      },
    });

    const avis = participations.map(participation => ({
      id: participation.participation_id,
      covoiturage_id: participation.covoiturage_id,
      numero_dossier: participation.numero_dossier,
      participant: {
        pseudo: participation.utilisateur?.pseudo || 'Anonyme',
        email: participation.utilisateur?.email || '',
      },
      chauffeur: {
        pseudo: participation.covoiturage.utilisateur?.pseudo || 'Anonyme',
        email: participation.covoiturage.utilisateur?.email || '',
      },
      commentaire: participation.commentaire || '',
      note: participation.note || 0,
      avis: participation.avis || '',
      date_creation: participation.date_participation.toISOString(),
      statut:
        participation.validation === true
          ? 'approuve'
          : participation.validation === false
            ? 'refuse'
            : 'en_attente',
      trajet: {
        lieu_depart: participation.covoiturage.lieu_depart || '',
        lieu_arrivee: participation.covoiturage.lieu_arrivee || '',
        date_depart: participation.covoiturage.date_depart?.toISOString() || '',
        heure_depart: participation.covoiturage.heure_depart || '',
      },
    }));

    return NextResponse.json({ avis: convertBigInts(avis) });
  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    );
  }
}
