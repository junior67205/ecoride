import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const data = await req.json();
  const { depart, arrivee, prix, vehiculeId } = data;

  if (!depart || !arrivee || !prix || !vehiculeId) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires.' }), {
      status: 400,
    });
  }
  if (Number(prix) <= 2) {
    return new Response(JSON.stringify({ error: 'Le prix doit être supérieur à 2 crédits.' }), {
      status: 400,
    });
  }

  // Vérifier que le véhicule appartient à l'utilisateur
  const voiture = await prisma.voiture.findFirst({
    where: {
      voiture_id: Number(vehiculeId),
      utilisateur_id: Number(session.user.id),
    },
  });
  if (!voiture) {
    return new Response(JSON.stringify({ error: 'Véhicule non trouvé ou non autorisé.' }), {
      status: 403,
    });
  }

  // Créer le covoiturage
  try {
    const covoiturage = await prisma.covoiturage.create({
      data: {
        lieu_depart: depart,
        lieu_arrivee: arrivee,
        prix_personne: Number(prix),
        nb_place: voiture.nb_place || 1,
        voiture: { connect: { voiture_id: voiture.voiture_id } },
        utilisateur: { connect: { utilisateur_id: Number(session.user.id) } },
        statut: 'ouvert',
      },
    });
    return new Response(JSON.stringify({ message: 'Voyage créé', covoiturage }), { status: 201 });
  } catch (error) {
    console.error('Erreur création voyage:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la création du voyage.' }), {
      status: 500,
    });
  }
}
