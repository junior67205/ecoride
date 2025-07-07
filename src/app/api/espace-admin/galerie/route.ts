import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const images = await prisma.galerie_image.findMany({
      orderBy: { ordre: 'asc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.type !== 'admin') {
    return NextResponse.json({ message: 'Accès non autorisé' }, { status: 403 });
  }

  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;
    const titre: string = data.get('titre') as string;
    const description: string = data.get('description') as string;
    const ordre: string = data.get('ordre') as string;

    if (!file) {
      return NextResponse.json({ message: 'Le fichier est manquant' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split('.').pop();
    const newFileName = `${uuidv4()}.${fileExtension}`;
    const path = join(process.cwd(), 'public/uploads', newFileName);

    await writeFile(path, buffer);

    const newImage = await prisma.galerie_image.create({
      data: {
        titre,
        description,
        ordre: parseInt(ordre) || 0,
        nom_fichier: newFileName,
        actif: true,
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image:", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
