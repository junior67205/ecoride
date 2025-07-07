import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

// Mettre à jour les détails d'une image
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id);
    const { titre, description, ordre, actif } = await req.json();

    const updatedImage = await prisma.galerie_image.update({
      where: { galerie_id: id },
      data: {
        titre,
        description,
        ordre: ordre !== undefined ? parseInt(ordre) : undefined,
        actif,
      },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Supprimer une image
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id);

    // Trouver l'image pour obtenir le nom du fichier
    const image = await prisma.galerie_image.findUnique({
      where: { galerie_id: id },
    });

    if (!image) {
      return NextResponse.json({ message: 'Image non trouvée' }, { status: 404 });
    }

    // Supprimer le fichier physique
    const path = join(process.cwd(), 'public/uploads', image.nom_fichier);
    try {
      await unlink(path);
    } catch (fileError) {
      console.error('Erreur lors de la suppression du fichier:', fileError);
      // On continue même si le fichier n'existe pas
    }

    // Supprimer l'enregistrement de la base de données
    await prisma.galerie_image.delete({
      where: { galerie_id: id },
    });

    return NextResponse.json({ message: 'Image supprimée avec succès' }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
