import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pseudo, email, password } = body;

  // Vérification des champs
  if (!pseudo || !email || !password) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires.' }), {
      status: 400,
    });
  }

  // Vérification sécurité du mot de passe
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return new Response(
      JSON.stringify({
        error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.',
      }),
      { status: 400 }
    );
  }

  // Vérifier unicité de l'email
  const existing = await prisma.utilisateur.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Cet email est déjà utilisé.' }), { status: 400 });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création de l'utilisateur
  await prisma.utilisateur.create({
    data: {
      pseudo,
      email,
      password: hashedPassword,
      role_id: 1, // Utilisateur
      credit: 20,
    },
  });

  return new Response(JSON.stringify({ message: 'Compte créé avec succès.' }), { status: 201 });
}
