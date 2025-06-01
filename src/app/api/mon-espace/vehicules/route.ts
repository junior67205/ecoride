import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }
  const vehicules = await prisma.voiture.findMany({
    where: { utilisateur_id: Number(session.user.id) },
    include: { marque: true },
  });
  return new Response(JSON.stringify(vehicules), { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
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
      { status: 400 }
    );
  }
  const voiture = await prisma.voiture.create({
    data: {
      immatriculation: data.immatriculation,
      date_premiere_immatriculation: data.date_premiere_immatriculation,
      modele: data.modele,
      couleur: data.couleur,
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
  return new Response(JSON.stringify(voiture), { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID manquant' }), { status: 400 });
  }
  await prisma.voiture.delete({
    where: { voiture_id: Number(id), utilisateur_id: Number(session.user.id) },
  });
  return new Response(JSON.stringify({ message: 'Véhicule supprimé.' }), { status: 200 });
}
