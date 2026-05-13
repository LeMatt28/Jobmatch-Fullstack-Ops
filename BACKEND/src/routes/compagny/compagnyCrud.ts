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
// Schéma pour mettre à jour le profil entreprise - Protection injection SQL/XSS
const updateCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(255, "Nom trop long")
    .optional(),
  sector: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(100, "Secteur trop long")
    .optional(),
  size: z.string().max(50, "Taille trop longue").optional(),
  description: z
    .string()
    .min(10, "Minimum 10 caractères")
    .max(5000, "Description trop longue")
    .optional(),
  values: z.string().max(1000, "Valeurs trop longues").optional(),
});

// ============ GET /company/me — PROFIL ENTREPRISE CONNECTÉE ============
// Obtenir le profil de l'entreprise connectée - Protection IDOR et accès non autorisé
router.get(
  "/profile",
  generalLimiter,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent voir leur profil - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const id = req.user!.id; // IDOR prevention: utiliser l'ID du token

      // ============ RÉCUPÉRER LE PROFIL ============
      // Récupérer le profil de l'entreprise connectée
      // Protection IDOR: ne récupérer que le profil de l'entreprise authentifiée
      const company = await prisma.company.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          sector: true,
          size: true,
          description: true,
          values: true,
          scoreReliability: true,
          subscriptionTier: true,
          createdAt: true,
        },
      });
      if (!company)
        return res.status(404).json({
          error: "Entreprise introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      return res.status(200).json({
        ...company,
        protection: "IDOR prevention (ID from token) + Sensitive data excluded",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

// ============ PUT /company/me — MODIFIER PROFIL ENTREPRISE ============
// Modifier le profil de l'entreprise connectée - Protection IDOR et injection
router.put(
  "/profile",
  generalLimiter,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent modifier leur profil - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const id = req.user!.id; // IDOR prevention: utiliser l'ID du token

      // ============ VALIDATION DES CHAMPS ============
      // Valider que les champs sont valides - Protection injection SQL/XSS
      const result = updateCompanySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: result.error.flatten(),
          protection: "Input validation - Zod schema validation",
        });
      }

      // ============ CONSTRUCTION DES DONNÉES À METTRE À JOUR ============
      // Sanitizer les données et ne mettre à jour que les champs autorisés
      // Protection contre les injections de champs non autorisés (ex: "role", "subscriptionTier")
      const updateData = Object.fromEntries(
        Object.entries(result.data)
          .filter(([_, value]) => value !== undefined) // Ne pas mettre à jour les champs undefined
          .map(([key, value]) => [
            key,
            typeof value === "string" ? sanitizeString(value) : value,
          ]),
      );

      // ============ MISE À JOUR ============
      // Mettre à jour le profil de l'entreprise connectée
      // Protection IDOR: mettre à jour uniquement via l'ID du token
      const updated = await prisma.company.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          sector: true,
          size: true,
          description: true,
          values: true,
          scoreReliability: true,
          subscriptionTier: true,
        },
      });
      return res.status(200).json({
        ...updated,
        protection:
          "IDOR prevention (ID from token) + Input validation + XSS sanitization + Field whitelisting",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

// ============ GET /company/:id — PROFIL PUBLIC ENTREPRISE ============
// Obtenir le profil public d'une entreprise - Protection IDOR par validation ID
router.get(
  "/:id",
  generalLimiter,
  validateIdParam, // Middleware pour valider que l'ID est un nombre positif
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);

      // ============ RÉCUPÉRER LE PROFIL PUBLIC ============
      // Récupérer uniquement les infos publiques (pas d'email, etc.)
      // Prisma utilise des requêtes paramétrées - Protection injection SQL
      const company = await prisma.company.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          sector: true,
          size: true,
          description: true,
          values: true,
          scoreReliability: true,
        },
      });
      if (!company)
        return res.status(404).json({
          error: "Entreprise introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      return res.status(200).json({
        ...company,
        protection:
          "Public profile - Sensitive data excluded (no email, no password) + Parameter validation",
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
