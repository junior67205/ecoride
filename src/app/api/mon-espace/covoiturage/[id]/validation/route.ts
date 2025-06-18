import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const { validation, commentaire, note, avis } = await req.json();
  const { id } = params;
  const userId = Number(session.user.id);

  try {
    // Vérifier que l'utilisateur participe à ce covoiturage
    const participation = await prisma.participation.findUnique({
      where: {
        utilisateur_id_covoiturage_id: {
          utilisateur_id: userId,
          covoiturage_id: Number(id),
        },
      },
      include: {
        covoiturage: {
          include: {
            utilisateur: true, // Le chauffeur
          },
        },
        utilisateur: true, // Le participant
      },
    });

    if (!participation) {
      return new Response(JSON.stringify({ error: 'Vous ne participez pas à ce covoiturage.' }), {
        status: 400,
      });
    }

    // Vérifier que l'utilisateur n'est pas le chauffeur
    if (participation.covoiturage.utilisateur_id === userId) {
      return new Response(
        JSON.stringify({ error: 'Le chauffeur ne peut pas valider son propre covoiturage.' }),
        { status: 400 }
      );
    }

    // Vérifier que le covoiturage est terminé
    if (participation.covoiturage.statut !== 'termine') {
      return new Response(
        JSON.stringify({ error: 'Vous ne pouvez valider que les covoiturages terminés.' }),
        { status: 400 }
      );
    }

    // Vérifier que la validation n'a pas déjà été effectuée
    if (participation.validation !== null) {
      return new Response(JSON.stringify({ error: 'Vous avez déjà validé ce covoiturage.' }), {
        status: 400,
      });
    }

    // Mettre à jour la participation
    await prisma.participation.update({
      where: {
        utilisateur_id_covoiturage_id: {
          utilisateur_id: userId,
          covoiturage_id: Number(id),
        },
      },
      data: {
        validation,
        commentaire: commentaire || null,
        note: note || null,
        avis: avis || null,
      },
    });

    // Si validation positive, vérifier si tous les participants ont validé
    if (validation) {
      const allParticipations = await prisma.participation.findMany({
        where: { covoiturage_id: Number(id) },
        include: { utilisateur: true },
      });

      const toutesValidees = allParticipations.every(p => p.validation === true);

      if (toutesValidees && participation.covoiturage.prix_personne) {
        // Créditer le chauffeur
        const nbParticipants = allParticipations.length;
        const montantTotal = participation.covoiturage.prix_personne * nbParticipants;

        await prisma.utilisateur.update({
          where: { utilisateur_id: participation.covoiturage.utilisateur_id! },
          data: { credit: { increment: montantTotal } },
        });

        // Envoyer un email de confirmation au chauffeur
        if (participation.covoiturage.utilisateur?.email) {
          await sendEmail({
            to: participation.covoiturage.utilisateur.email,
            subject: 'Tous les participants ont validé votre trajet',
            html: `
              <p>Bonjour ${participation.covoiturage.utilisateur.pseudo},</p>
              <p>Tous les participants ont validé votre trajet. Vos ${montantTotal} crédits ont été ajoutés à votre compte.</p>
              <p>Cordialement,<br>L'équipe EcoRide</p>
            `,
          });
        }
      }
    } else {
      // Si problème signalé, envoyer un email à l'admin
      const admin = await prisma.utilisateur.findFirst({
        where: { type_utilisateur: 'admin' },
        select: { email: true, pseudo: true },
      });

      if (admin?.email) {
        await sendEmail({
          to: admin.email,
          subject: 'Problème signalé sur un covoiturage',
          html: `
            <p>Bonjour ${admin.pseudo},</p>
            <p>Un problème a été signalé sur le covoiturage ${id} par ${participation.utilisateur.pseudo}.</p>
            <p><strong>Commentaire :</strong> ${commentaire || 'Aucun commentaire'}</p>
            <p><strong>Note :</strong> ${note || 'Aucune note'}</p>
            <p><strong>Avis :</strong> ${avis || 'Aucun avis'}</p>
            <p>Veuillez contacter le chauffeur pour résoudre la situation.</p>
            <p>Cordialement,<br>L'équipe EcoRide</p>
          `,
        });
      }

      // Envoyer un email au chauffeur pour l'informer du problème
      if (participation.covoiturage.utilisateur?.email) {
        await sendEmail({
          to: participation.covoiturage.utilisateur.email,
          subject: 'Problème signalé sur votre covoiturage',
          html: `
            <p>Bonjour ${participation.covoiturage.utilisateur.pseudo},</p>
            <p>Un participant a signalé un problème sur votre covoiturage ${id}.</p>
            <p><strong>Commentaire :</strong> ${commentaire || 'Aucun commentaire'}</p>
            <p>Un employé va vous contacter pour résoudre la situation.</p>
            <p>Cordialement,<br>L'équipe EcoRide</p>
          `,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de la validation.' }),
      { status: 500 }
    );
  }
}
