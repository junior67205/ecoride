import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { oldPassword, newPassword, confirmPassword } = await req.json();
  if (!oldPassword || !newPassword || !confirmPassword) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (newPassword !== confirmPassword) {
    return new Response(JSON.stringify({ error: 'Les mots de passe ne correspondent pas.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Vérification force du mot de passe
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return new Response(
      JSON.stringify({
        error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // Vérifier l'ancien mot de passe
  const user = await prisma.utilisateur.findUnique({
    where: { utilisateur_id: Number(session.user.id) },
    select: { password: true },
  });
  if (!user || !user.password) {
    return new Response(JSON.stringify({ error: 'Utilisateur non trouvé.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Ancien mot de passe incorrect.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Mettre à jour le mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.utilisateur.update({
    where: { utilisateur_id: Number(session.user.id) },
    data: { password: hashedPassword },
  });
  return new Response(JSON.stringify({ message: 'Mot de passe modifié avec succès.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
