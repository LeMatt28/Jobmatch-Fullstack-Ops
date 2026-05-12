import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { z } from "zod";
import {
  generalLimiter,
  sanitizeString,
} from "../../middlewares/SecurityMiddleware";

const router = Router();

// ============ VALIDATION SCHÉMAS ============
// Schéma pour mettre à jour le profil candidat - Protection injection SQL/XSS
const updateCandidateSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(100, "Nom trop long")
    .optional(),
  location: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(100, "Localisation trop longue")
    .optional(),
  skills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  experience: z.string().max(5000, "Expérience trop longue").optional(),
  availability: z.string().max(100, "Disponibilité trop longue").optional(),
  salaryExpected: z.number().positive("Salaire positif").optional(),
  mobility: z.boolean().optional(),
});

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

// ============ GET /me — PROFIL CONNECTÉ ============
// Obtenir le profil de l'utilisateur connecté - Protection IDOR et accès non autorisé
router.get(
  "/me",
  generalLimiter,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const id = req.user!.id; // IDOR prevention: utiliser l'ID du token
      const role = req.user!.role;

      // ============ RÉCUPÉRER CANDIDAT ============
      if (role === "candidate") {
        // Récupérer le profil du candidat connecté
        // Protection IDOR: ne récupérer que le profil de l'utilisateur authentifié
        const candidate = await prisma.candidate.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            location: true,
            skills: true,
            softSkills: true,
            experience: true,
            availability: true,
            salaryExpected: true,
            mobility: true,
            scoreCandidat: true,
            isPremium: true,
            createdAt: true,
          },
        });
        if (!candidate)
          return res.status(404).json({
            error: "Candidat introuvable",
            protection: "IDOR prevention - Non-existent resource",
          });
        return res.status(200).json({
          ...candidate,
          role: "candidate",
          protection:
            "IDOR prevention (ID from token) + Sensitive data excluded",
        });
      }

      // ============ RÉCUPÉRER ENTREPRISE ============
      if (role === "company") {
        // Récupérer le profil de l'entreprise connectée
        // Protection IDOR: ne récupérer que le profil de l'utilisateur authentifié
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
          role: "company",
          protection:
            "IDOR prevention (ID from token) + Sensitive data excluded",
        });
      }

      return res.status(400).json({
        error: "Rôle inconnu",
        protection: "Invalid role validation",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  },
);

// ============ PUT /me — MODIFIER PROFIL ============
// Modifier le profil de l'utilisateur connecté - Protection IDOR et injection
router.put(
  "/me",
  generalLimiter,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const id = req.user!.id; // IDOR prevention: utiliser l'ID du token
      const role = req.user!.role;

      // ============ METTRE À JOUR CANDIDAT ============
      if (role === "candidate") {
        // Valider les champs - Protection injection SQL/XSS
        const result = updateCandidateSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: "Données invalides",
            details: result.error.flatten(),
            protection: "Input validation - Zod schema validation",
          });
        }

        // Sanitizer les données et ne mettre à jour que les champs autorisés
        // Protection contre les injections de champs non autorisés (ex: "role", "scoreCandidat")
        const updateData = Object.fromEntries(
          Object.entries(result.data)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [
              key,
              typeof value === "string" ? sanitizeString(value) : value,
            ]),
        );

        // Mettre à jour seulement le candidat connecté
        // Protection IDOR: mettre à jour uniquement via l'ID du token
        const updated = await prisma.candidate.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            email: true,
            name: true,
            location: true,
            skills: true,
            softSkills: true,
            experience: true,
            availability: true,
            salaryExpected: true,
            mobility: true,
          },
        });
        return res.status(200).json({
          ...updated,
          protection:
            "IDOR prevention (ID from token) + Input validation + XSS sanitization + Field whitelisting",
        });
      }

      // ============ METTRE À JOUR ENTREPRISE ============
      if (role === "company") {
        // Valider les champs - Protection injection SQL/XSS
        const result = updateCompanySchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: "Données invalides",
            details: result.error.flatten(),
            protection: "Input validation - Zod schema validation",
          });
        }

        // Sanitizer les données et ne mettre à jour que les champs autorisés
        // Protection contre les injections de champs non autorisés (ex: "subscriptionTier", "scoreReliability")
        const updateData = Object.fromEntries(
          Object.entries(result.data)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [
              key,
              typeof value === "string" ? sanitizeString(value) : value,
            ]),
        );

        // Mettre à jour seulement l'entreprise connectée
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
      }

      return res.status(400).json({
        error: "Rôle inconnu",
        protection: "Invalid role validation",
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

// gety mes stats
router.get("/me/stats", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "candidate") {
      return res.status(403).json({ error: "Réservé aux candidats" });
    }
    const candidateId = req.user!.id;

    const [swipesCount, matchesCount, likesCount] = await Promise.all([
      prisma.swipe.count({ where: { candidateId } }),
      prisma.match.count({ where: { candidateId } }),
      prisma.swipe.count({ where: { candidateId, direction: "LIKE" } }),
    ]);

    return res.status(200).json({
      offersViewed: swipesCount,
      likesGiven: likesCount,
      matchesCount,
      matchRate:
        likesCount > 0 ? Math.round((matchesCount / likesCount) * 100) : 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});
