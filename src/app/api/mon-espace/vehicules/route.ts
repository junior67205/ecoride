import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const vehicules = await prisma.voiture.findMany({
    where: { utilisateur_id: Number(session.user.id) },
    include: { marque: true },
  });
  return new Response(JSON.stringify(vehicules), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const data = await req.json();
  if (
    !data.immatriculation ||
    !data.date_premiere_immatriculation ||
    !data.modele ||
    !data.couleur ||
    !data.marque_id ||
    !data.nb_place
  ) {
    return new Response(
      JSON.stringify({ error: 'Tous les champs obligatoires doivent être remplis.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  const voiture = await prisma.voiture.create({
    data: {
      immatriculation: data.immatriculation,
      date_premiere_immatriculation: data.date_premiere_immatriculation,
      modele: data.modele,
      couleur: data.couleur,
      energie: data.energie,
      marque: {
        connect: {
          marque_id: data.marque_id,
        },
      },
      utilisateur: {
        connect: {
          utilisateur_id: Number(session.user.id),
        },
      },
      nb_place: data.nb_place,
      preferences: JSON.stringify(data.preferences || {}),
    } satisfies Prisma.voitureCreateInput,
  });
  return new Response(JSON.stringify(voiture), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { id, force } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID manquant' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Si force est vrai, supprimer tous les covoiturages liés avant de supprimer le véhicule
  if (force) {
    await prisma.covoiturage.deleteMany({ where: { voiture_id: Number(id) } });
  } else {
    // Vérifier s'il existe des covoiturages liés à ce véhicule
    const covoituragesCount = await prisma.covoiturage.count({
      where: { voiture_id: Number(id) },
    });
    if (covoituragesCount > 0) {
      return new Response(
        JSON.stringify({
          error:
            "Impossible de supprimer ce véhicule car il est encore référencé dans l'historique des covoiturages. Utilisez la suppression forcée si vous souhaitez tout effacer.",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  await prisma.voiture.delete({
    where: { voiture_id: Number(id), utilisateur_id: Number(session.user.id) },
  });
  return new Response(JSON.stringify({ message: 'Véhicule supprimé.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
