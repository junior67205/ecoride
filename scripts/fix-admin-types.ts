import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminTypes() {
  try {
    // Mettre à jour l'administrateur
    await prisma.utilisateur.update({
      where: { email: 'admin@email.com' },
      data: { type_utilisateur: 'admin' },
    });

    // Mettre à jour l'employé
    await prisma.utilisateur.update({
      where: { email: 'employe@email.com' },
      data: { type_utilisateur: 'employe' },
    });

    // Mettre à jour tous les autres utilisateurs
    await prisma.utilisateur.updateMany({
      where: {
        email: { notIn: ['admin@email.com', 'employe@email.com'] },
      },
      data: { type_utilisateur: 'utilisateur' },
    });

    console.log("Types d'utilisateur mis à jour avec succès !");
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminTypes();
