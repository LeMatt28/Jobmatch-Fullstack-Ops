// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { z } from "zod";
import {
  validateIdParam,
  generalLimiter,
  sanitizeString,
} from "../../middlewares/SecurityMiddleware";

const router = Router();

// ============ VALIDATION SCHÉMAS ============
// Schéma pour valider une review - Protection injection SQL/XSS
const reviewSchema = z.object({
  score: z
    .number()
    .int("Le score doit être un entier")
    .min(1, "Le score doit être entre 1 et 5")
    .max(5, "Le score doit être entre 1 et 5"),
  comment: z
    .string()
    .min(10, "Minimum 10 caractères")
    .max(1000, "Maximum 1000 caractères")
    .optional(),
});

// ============ POST REVIEW CANDIDAT (par entreprise) ============
// Route pour qu'une entreprise leave une review sur un candidat
// Protection IDOR: vérifier que la review est basée sur une interaction réelle
router.post(
  "/reviews/candidate/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware pour valider que l'ID est un nombre positif
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent laisser des reviews - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const companyId = req.user!.id; // IDOR prevention: utiliser l'ID du token
      const candidateId = parseInt(req.params.id as string);

      // ============ VALIDATION DES CHAMPS ============
      // Valider que les champs sont valides - Protection injection SQL/XSS
      const result = reviewSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: result.error.flatten(),
          protection: "Input validation - Zod schema validation",
        });
      }
      const { score, comment } = result.data;

      // ============ VÉRIFIER L'EXISTENCE DU CANDIDAT ============
      // Vérifier que le candidat existe - Protection IDOR contre les références invalides
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });
      if (!candidate) {
        return res.status(404).json({
          error: "Candidat introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });
      }

      // ============ VÉRIFIER UNE INTERACTION ENTRE LA COMPANY ET LE CANDIDAT ============
      // Vérifier qu'il existe un match entre cette entreprise et le candidat
      // Protection IDOR: n'importe qui ne peut laisser une review que sur quelqu'un qu'il a matché
      const hasInteraction = await prisma.match.findFirst({
        where: {
          offer: {
            companyId, // Offre de l'entreprise
          },
          candidateId, // Candidat
        },
      });
      if (!hasInteraction) {
        return res.status(403).json({
          error: "Vous n'avez pas d'interaction avec ce candidat",
          protection:
            "IDOR prevention - Review can only be left on matched candidates",
        });
      }

      // ============ CRÉER LA REVIEW ============
      // Créer la review
      // Protection IDOR: companyId vient du token, pas du body
      const review = await prisma.candidateReview.create({
        data: {
          candidateId,
          companyId, // IDOR prevention: utiliser l'ID du token
          score,
          comment: comment ? sanitizeString(comment) : null,
        },
      });

      return res.status(201).json({
        ...review,
        protection:
          "IDOR prevention (interaction check) + Input validation + XSS sanitization",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

// ============ POST REVIEW ENTREPRISE (par candidat) ============
// Route pour qu'un candidat laisse une review sur une entreprise
// Protection IDOR: vérifier que la review est basée sur une interaction réelle
router.post(
  "/reviews/company/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware pour valider que l'ID est un nombre positif
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seuls les candidats peuvent laisser des reviews - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "candidate") {
        return res.status(403).json({
          error: "Réservé aux candidats",
          protection: "Role-based access control (RBAC)",
        });
      }
      const candidateId = req.user!.id; // IDOR prevention: utiliser l'ID du token
      const companyId = parseInt(req.params.id as string);

      // ============ VALIDATION DES CHAMPS ============
      // Valider que les champs sont valides - Protection injection SQL/XSS
      const result = reviewSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: result.error.flatten(),
          protection: "Input validation - Zod schema validation",
        });
      }
      const { score, comment } = result.data;

      // ============ VÉRIFIER L'EXISTENCE DE L'ENTREPRISE ============
      // Vérifier que l'entreprise existe - Protection IDOR contre les références invalides
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        return res.status(404).json({
          error: "Entreprise introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });
      }

      // ============ VÉRIFIER UNE INTERACTION ENTRE LE CANDIDAT ET LA COMPANY ============
      // Vérifier qu'il existe un match entre ce candidat et une offre de l'entreprise
      // Protection IDOR: n'importe qui ne peut laisser une review que sur quelqu'un qu'il a matché
      const hasInteraction = await prisma.match.findFirst({
        where: {
          candidateId,
          offer: {
            companyId, // Offre de l'entreprise
          },
        },
      });
      if (!hasInteraction) {
        return res.status(403).json({
          error: "Vous n'avez pas d'interaction avec cette entreprise",
          protection:
            "IDOR prevention - Review can only be left on matched companies",
        });
      }

      // ============ CRÉER LA REVIEW ============
      // Créer la review
      // Protection IDOR: candidateId vient du token, pas du body
      const review = await prisma.companyReview.create({
        data: {
          companyId,
          candidateId, // IDOR prevention: utiliser l'ID du token
          score,
          comment: comment ? sanitizeString(comment) : null,
        },
      });

      return res.status(201).json({
        ...review,
        protection:
          "IDOR prevention (interaction check) + Input validation + XSS sanitization",
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