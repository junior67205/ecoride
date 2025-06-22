import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createEmploye() {
  try {
    const email = 'employe@test.com';

    // Vérifier si l'employé existe déjà
    const existingEmploye = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingEmploye) {
      console.log('Un employé avec cet email existe déjà:', existingEmploye);
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const employe = await prisma.utilisateur.create({
      data: {
        civilite: 'M',
        nom: 'Employé',
        prenom: 'Test',
        email,
        password: hashedPassword,
        telephone: '0123456789',
        adresse: '123 Rue de Test',
        date_naissance: '1990-01-01',
        pseudo: 'employe_test',
        type_utilisateur: 'employe',
        credit: 0,
      },
    });

    console.log('Employé créé avec succès:', employe);
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createEmploye();
