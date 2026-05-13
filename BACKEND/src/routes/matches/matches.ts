// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import {
  validateOfferIdParam,
  generalLimiter,
} from "../../middlewares/SecurityMiddleware";

const router = Router();

// ============ GET CANDIDATE MATCHES ============
// Obtenir les matches d'un candidat - Protection IDOR et accès non autorisé
router.get(
  "/matches",
  generalLimiter,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seuls les candidats peuvent voir leurs matches - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "candidate") {
        return res.status(403).json({
          error: "Réservé aux candidats",
          protection: "Role-based access control (RBAC)",
        });
      }
      const candidateId = req.user!.id; // IDOR prevention: utiliser l'ID du token

      // ============ RÉCUPÉRER LES MATCHES ============
      // Récupérer les matches du candidat connecté
      // Protection IDOR: filtrer par candidateId authentifié
      const matches = await prisma.match.findMany({
        where: { candidateId }, // IDOR prevention: ne récupérer que les matches du candidat authentifié
        include: {
          offer: {
            include: {
              company: {
                select: { id: true, name: true, scoreReliability: true },
              },
            },
          },
        },
      });

      return res.status(200).json({
        matches,
        protection:
          "IDOR prevention (candidateId from token) + Role-based access control",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

// ============ GET COMPANY MATCHES FOR OFFER ============
// Obtenir les matches d'une offre (côté entreprise) - Protection IDOR
router.get(
  "/matches/:offerId",
  generalLimiter,
  verifyToken,
  validateOfferIdParam, // Middleware pour valider que l'offerId est un nombre positif
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent voir les matches - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const companyId = req.user!.id; // IDOR prevention: utiliser l'ID du token
      const offerId = parseInt(req.params.offerId as string);

      // ============ VÉRIFIER LA PROPRIÉTÉ DE L'OFFRE (IDOR PREVENTION) ============
      // Vérifier que l'offre appartient à l'entreprise connectée
      // Protection IDOR: une entreprise ne peut voir les matches que de ses propres offres
      const offer = await prisma.offer.findUnique({ where: { id: offerId } });
      if (!offer) {
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });
      }

      if (offer.companyId !== companyId) {
        return res.status(403).json({
          error: "Pas votre offre",
          protection:
            "IDOR prevention - Ownership verification. This offer belongs to another company",
        });
      }

      // ============ RÉCUPÉRER LES MATCHES ============
      // Récupérer les matches pour l'offre vérifiée
      // Protection IDOR: les matches sont filtrés par offerId après vérification de propriété
      const matches = await prisma.match.findMany({
        where: { offerId },
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              skills: true,
              softSkills: true,
              experience: true,
              salaryExpected: true,
              scoreCandidat: true,
            },
          },
        },
      });

      return res.status(200).json({
        matches,
        protection:
          "IDOR prevention (offer ownership check) + Role-based access control",
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
