import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    depart,
    arrivee,
    dateDepart,
    heureDepart,
    dateArrivee,
    heureArrivee,
    prix,
    vehiculeId,
    nb_place,
  } = await req.json();

  // Vérifier que tous les champs requis sont présents
  if (
    !depart ||
    !arrivee ||
    !dateDepart ||
    !heureDepart ||
    !dateArrivee ||
    !heureArrivee ||
    !prix ||
    !vehiculeId
  ) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Vérifier que le prix est supérieur à 2 crédits
  if (Number(prix) <= 2) {
    return new Response(JSON.stringify({ error: 'Le prix doit être supérieur à 2 crédits' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Récupérer la voiture
  const voiture = await prisma.voiture.findUnique({
    where: { voiture_id: Number(vehiculeId) },
  });

  if (!voiture) {
    return new Response(JSON.stringify({ error: 'Véhicule non trouvé' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Calculer le nombre de places disponibles par défaut (capacité du véhicule moins le conducteur)
  const nbPlacesParDefaut = Math.max(0, (voiture.nb_place || 0) - 1);

  // Si le nombre de places est spécifié, vérifier qu'il est valide
  if (nb_place) {
    if (Number(nb_place) <= 0) {
      return new Response(
        JSON.stringify({ error: 'Le nombre de places doit être supérieur à 0' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    // Vérifier que le nombre de places ne dépasse pas la capacité totale du véhicule
    if (Number(nb_place) > (voiture.nb_place || 0)) {
      return new Response(
        JSON.stringify({
          error: `Le nombre de places ne peut pas dépasser ${voiture.nb_place} (capacité totale du véhicule)`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Créer le covoiturage
  try {
    const covoiturage = await prisma.covoiturage.create({
      data: {
        lieu_depart: depart,
        lieu_arrivee: arrivee,
        date_depart: new Date(dateDepart),
        heure_depart: heureDepart,
        date_arrivee: new Date(dateArrivee),
        heure_arrivee: heureArrivee,
        prix_personne: Number(prix),
        nb_place: Number(nb_place) || nbPlacesParDefaut,
        statut: 'ouvert',
        voiture: {
          connect: {
            voiture_id: Number(vehiculeId),
          },
        },
        utilisateur: {
          connect: {
            utilisateur_id: Number(session.user.id),
          },
        },
      },
    });

    return new Response(JSON.stringify(covoiturage), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de la création du covoiturage:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la création du covoiturage' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
