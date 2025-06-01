import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }
  const { type_utilisateur } = await req.json();
  if (!type_utilisateur || !['chauffeur', 'passager', 'les deux'].includes(type_utilisateur)) {
    return new Response(JSON.stringify({ error: 'Type utilisateur invalide' }), { status: 400 });
  }
  try {
    await prisma.utilisateur.update({
      where: { utilisateur_id: Number(session.user.id) },
      data: { type_utilisateur },
    });
    return new Response(JSON.stringify({ message: 'Rôle enregistré avec succès.' }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour.' }), {
      status: 500,
    });
  }
}
