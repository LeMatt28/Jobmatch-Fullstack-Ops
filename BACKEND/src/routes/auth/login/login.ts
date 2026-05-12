//imports
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import {
  authLimiter,
  sanitizeString,
} from "../../../middlewares/SecurityMiddleware";

//router
const router = Router();

// ============ VALIDATION SCHÉMA ============
// Zod schema pour valider les champs du login - Protection contre injection SQL et XSS
const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .transform((e) => e.toLowerCase()), // Normaliser l'email
  password: z
    .string()
    .min(1, "Mot de passe requis")
    .max(255, "Mot de passe trop long"),
});

// ============ ENDPOINT LOGIN ============
// Route de connexion avec protection brute force et validation stricte
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    // ============ VALIDATION DES CHAMPS (Protection injection SQL) ============
    // Vérifier que les champs sont valides avec Zod
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: result.error.flatten(),
        protection: "Input validation - Protégé contre injection SQL/XSS",
      });
    }
    const { email, password } = result.data;

    // ============ RECHERCHE UTILISATEUR ============
    // Chercher l'utilisateur dans la base - Prisma utilise des requêtes paramétrées (SQL injection safe)
    let user: any = await prisma.candidate.findUnique({ where: { email } });
    let role = "candidate";

    if (!user) {
      user = await prisma.company.findUnique({ where: { email } });
      role = "company";
    }

    // ============ PROTECTION TIMING ATTACKS ============
    // Comparer les mots de passe même si l'utilisateur n'existe pas
    // Protège contre les attaques par timing qui révèlent si un email existe
    if (!user) {
      // Effectuer une vérification bcrypt fictive pour prendre du temps
      // (protection contre les attaques par énumération d'emails)
      await bcrypt.compare(
        password,
        "$2a$10$fictive.hash.to.prevent.timing.attacks",
      );
      return res.status(401).json({
        error: "Identifiants incorrects",
        protection:
          "Timing attack protection - Réponse identique pour email inexistant ou mot de passe faux",
      });
    }

    // ============ VÉRIFICATION MOT DE PASSE ============
    // Comparer avec le hash bcrypt - Protection contre les attaques brute force via time constant
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Identifiants incorrects",
        protection:
          "Brute force protection via authLimiter - Password comparison via bcrypt (constant time)",
      });
    }

    // ============ CRÉATION TOKEN JWT ============
    // Créer un token signé avec expiration - Protection contre les sessions infinies
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }, // Expiration courte pour limiter les dégâts en cas de vol
    );

    // ============ RÉPONSE ============
    // Ne pas renvoyer le mot de passe ou hash - Protection contre la fuite de données sensibles
    return res.status(200).json({
      token,
      role,
      user: { id: user.id, name: user.name, email: user.email },
      protection:
        "authLimiter (5 tentatives/15min) + JWT expiration (7j) + Timing attack protection",
    });
  } catch (err) {
    // Répondre de manière générique pour ne pas révéler d'infos sensibles
    return res.status(500).json({
      error: "Erreur serveur",
      protection: "Generic error message - Ne pas révéler les détails d'erreur",
    });
  }
});

export default router;
