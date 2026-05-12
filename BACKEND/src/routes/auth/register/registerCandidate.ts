//imports
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { registerLimiter, sanitizeString } from "../../../middlewares/SecurityMiddleware";

const router = Router();

// ============ VALIDATION SCHÉMA ============
// Zod schema pour valider les champs du candidat - Protection contre injection SQL et XSS
const candidateSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .transform((e) => e.toLowerCase()), // Normaliser l'email
  password: z
    .string()
    .min(8, "Minimum 8 caractères")
    .max(255, "Mot de passe trop long")
    .regex(/[A-Z]/, "Au moins une majuscule requise")
    .regex(/[a-z]/, "Au moins une minuscule requise")
    .regex(/[0-9]/, "Au moins un chiffre requis"), // Validation motif de passe fort
  name: z
    .string()
    .min(2, "Minimum 2 caractères")
    .max(100, "Nom trop long")
    .regex(/^[a-zA-Z\s'-]+$/, "Caractères invalides dans le nom"),
});

// ============ ENDPOINT REGISTRATION CANDIDAT ============
// Route d'inscription avec rate limiter et validation stricte
router.post("/register/candidate", registerLimiter, async (req: Request, res: Response) => {
  try {
    // ============ VALIDATION DES CHAMPS ============
    // Vérifier que les champs sont valides - Protection injection SQL/XSS
    const result = candidateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: result.error.flatten(),
        protection: "Input validation + registerLimiter - Protection injection SQL/XSS/Brute force",
      });
    }
    const { email, password, name } = result.data;

    // ============ VÉRIFIER DUPLICATION D'EMAIL ============
    // Vérifier que l'email n'existe pas déjà dans candidats
    // Prisma utilise les requêtes paramétrées (protection injection SQL)
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });
    if (existingCandidate) {
      return res.status(409).json({
        error: "Email déjà utilisé",
        protection: "Email uniqueness check - Prisma parameterized queries (SQL injection safe)",
      });
    }

    // Vérifier aussi dans les entreprises pour éviter les doublons cross-table
    const existingCompany = await prisma.company.findUnique({
      where: { email },
    });
    if (existingCompany) {
      return res.status(409).json({
        error: "Email déjà utilisé",
        protection: "Cross-table email uniqueness check",
      });
    }

    // ============ HASH DU MOT DE PASSE ============
    // Hasher avec bcrypt (coût 10) - Protection contre les rainbow tables
    // Lent intentionnellement pour ralentir les attaques brute force
    const hashed = await bcrypt.hash(password, 10);

    // ============ CRÉATION DE L'UTILISATEUR ============
    // Créer le candidat dans la base - Prisma parameterized queries
    const candidate = await prisma.candidate.create({
      data: {
        email,
        password: hashed,
        name,
      },
    });

    // ============ RÉPONSE ============
    // Ne pas renvoyer le mot de passe ou hash
    return res.status(201).json({
      message: "Candidat créé avec succès",
      id: candidate.id,
      protection:
        "registerLimiter (3/heure) + bcrypt hashing (coût 10) + Input validation + Email uniqueness",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Erreur serveur",
      protection: "Generic error message - Ne pas révéler les détails d'erreur",
    });
  }
});

export default router;
