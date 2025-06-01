import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Aucun fichier fourni' }), { status: 400 });
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Le fichier doit être une image' }), {
        status: 400,
      });
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "L'image ne doit pas dépasser 5MB" }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un nom de fichier unique
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    // Sauvegarder le fichier
    await writeFile(filepath, buffer);

    // Mettre à jour le profil utilisateur avec le nom du fichier
    const updateData: Prisma.utilisateurUpdateInput = {
      photo: filename,
    };

    await prisma.utilisateur.update({
      where: { utilisateur_id: Number(session.user.id) },
      data: updateData,
    });

    return new Response(JSON.stringify({ photo: filename }), { status: 200 });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors du téléchargement' }),
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  try {
    // Supprimer la photo du profil
    const updateData: Prisma.utilisateurUpdateInput = {
      photo: null,
    };

    await prisma.utilisateur.update({
      where: { utilisateur_id: Number(session.user.id) },
      data: updateData,
    });

    return new Response(JSON.stringify({ message: 'Photo supprimée avec succès' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la suppression' }),
      { status: 500 }
    );
  }
}
