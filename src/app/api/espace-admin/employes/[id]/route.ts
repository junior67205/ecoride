import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const utilisateur_id = parseInt(params.id);

    if (isNaN(utilisateur_id)) {
      return NextResponse.json({ message: 'ID employé invalide' }, { status: 400 });
    }

    // Vérifier que l'employé existe et est suspendu
    const employe = await prisma.utilisateur.findUnique({
      where: { utilisateur_id },
      select: { suspendu: true, type_utilisateur: true },
    });

    if (!employe) {
      return NextResponse.json({ message: 'Employé non trouvé' }, { status: 404 });
    }

    if (employe.type_utilisateur !== 'employe') {
      return NextResponse.json(
        { message: "Cet utilisateur n'est pas un employé" },
        { status: 400 }
      );
    }

    if (!employe.suspendu) {
      return NextResponse.json(
        { message: 'Seuls les employés suspendus peuvent être supprimés' },
        { status: 400 }
      );
    }

    // Supprimer l'employé
    await prisma.utilisateur.delete({
      where: { utilisateur_id },
    });

    return NextResponse.json({ message: 'Employé supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
