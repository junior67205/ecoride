import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const employes = await prisma.utilisateur.findMany({
      where: {
        type_utilisateur: 'employe',
      },
      select: {
        utilisateur_id: true,
        nom: true,
        prenom: true,
        email: true,
        pseudo: true,
        credit: true,
        suspendu: true,
      },
      orderBy: {
        utilisateur_id: 'desc',
      },
    });
    return NextResponse.json(employes, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const { email, password, nom, prenom } = await req.json();

    if (!email || !password || !nom || !prenom) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un pseudo automatiquement basé sur le prénom et le nom
    const pseudo = `${prenom.toLowerCase()}${nom.toLowerCase()}`;

    const newEmploye = await prisma.utilisateur.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        pseudo,
        type_utilisateur: 'employe',
        civilite: 'M.', // Valeur par défaut
        role_id: 3, // 3 = Employé, à vérifier dans la BDD
      },
    });

    return NextResponse.json(newEmploye, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const { utilisateur_id, suspendu } = await req.json();

    if (utilisateur_id === undefined || suspendu === undefined) {
      return NextResponse.json({ message: 'Données manquantes' }, { status: 400 });
    }

    const employe = await prisma.utilisateur.update({
      where: { utilisateur_id: parseInt(utilisateur_id) },
      data: { suspendu: suspendu },
      select: {
        utilisateur_id: true,
        nom: true,
        prenom: true,
        email: true,
        pseudo: true,
        credit: true,
        suspendu: true,
      },
    });

    return NextResponse.json(employe, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suspension/réactivation de l'employé:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
