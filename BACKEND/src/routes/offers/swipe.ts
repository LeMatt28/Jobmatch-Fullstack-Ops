// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { z } from "zod";
import {
  validateIdParam,
  generalLimiter,
} from "../../middlewares/SecurityMiddleware";

const router = Router();

// ============ VALIDATION SCHÉMAS ============
// Schéma pour valider la direction du swipe - Protection injection SQL/XSS
const swipeSchema = z.object({
  direction: z.enum(["LIKE", "DISLIKE"]),
});

// ============ SWIPE ENDPOINT ============
// Endpoint pour swiper une offre - Protection IDOR et injection SQL
router.post(
  "/swipe/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware pour valider que l'ID est un nombre positif
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seuls les candidats peuvent swiper - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "candidate") {
        return res.status(403).json({
          error: "Réservé aux candidats",
          protection: "Role-based access control (RBAC)",
        });
      }
      const candidateId = req.user!.id; // IDOR prevention: utiliser l'ID du token

      // ============ VALIDATION DES PARAMÈTRES ============
      // Valider que l'ID est un entier positif - Protection IDOR et injection
      const offerId = parseInt(req.params.id as string);
      if (isNaN(offerId) || offerId <= 0) {
        return res.status(400).json({
          error: "ID invalide",
          protection: "Parameter validation - IDOR prevention",
        });
      }

      // ============ VALIDATION DES CHAMPS ============
      // Valider que la direction est LIKE ou DISLIKE - Protection injection SQL
      const result = swipeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: result.error.flatten(),
          protection: "Input validation - Zod schema validation",
        });
      }
      const { direction } = result.data;

      // ============ VÉRIFIER L'EXISTENCE DE L'OFFRE ============
      // Vérifier que l'offre existe - Protection contre les références invalides
      // Prisma utilise des requêtes paramétrées - Protection injection SQL
      const offer = await prisma.offer.findUnique({ where: { id: offerId } });
      if (!offer)
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      // ============ VÉRIFIER LES SWIPES DUPLIQUÉS ============
      // Vérifier que le candidat n'a pas déjà swipé cette offre
      // Protection contre les doublons et manipulation de données
      const existingSwipe = await prisma.swipe.findUnique({
        where: { candidateId_offerId: { candidateId, offerId } },
      });
      if (existingSwipe) {
        return res.status(409).json({
          error: "Vous avez déjà swipé cette offre",
          protection: "Duplicate swipe prevention - Unique constraint check",
        });
      }

      // ============ CRÉER LE SWIPE ============
      // Créer le swipe avec les paramètres authentifiés
      // Protection IDOR: candidateId vient du token, pas du body
      await prisma.swipe.create({
        data: { candidateId, offerId, direction },
      });

      // ============ CRÉER LE MATCH SI LIKE ============
      // Si DISLIKE, pas de match
      if (direction === "DISLIKE") {
        return res.status(200).json({
          matched: false,
          protection:
            "IDOR prevention (candidateId from token) + Input validation + Duplicate prevention",
        });
      }

      // Si LIKE, créer un match (les entreprises peuvent ensuite accepter)
      const match = await prisma.match.create({
        data: { candidateId, offerId },
      });

      return res.status(200).json({
        matched: true,
        matchId: match.id,
        protection:
          "IDOR prevention (candidateId from token) + Input validation + Duplicate prevention",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

export default router;
