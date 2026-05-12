// Middleware de sécurité avancée contre les attaques communes
import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

// ============ PROTECTION CONTRE LE BRUTE FORCE ============
// Limiter les tentatives de connexion/inscription pour éviter les attaques par brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives
  message: {
    error: "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: false, // Désactiver X-RateLimit dans les headers
  legacyHeaders: false,
  skip: (req) => {
    // Ne pas appliquer la limite sur les requêtes GET
    return req.method !== "POST";
  },
});

// Limiter les tentatives d'enregistrement
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 inscriptions par heure
  message: {
    error:
      "Trop d'inscriptions. Veuillez réessayer dans une heure. Protégé contre les attaques brute force.",
  },
  standardHeaders: false,
  legacyHeaders: false,
});

// Rate limit général sur les routes protégées (anti-scraping)
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requêtes par minute
  message: {
    error:
      "Trop de requêtes. Veuillez attendre avant de relancer. Protégé contre les attaques brute force/scraping.",
  },
  standardHeaders: false,
  legacyHeaders: false,
});

// ============ VALIDATION DES IDS (CONTRE IDOR) ============
// Schémas Zod pour valider les paramètres d'ID
export const idParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "L'ID doit être un nombre positif valide. Protection IDOR.",
  }),
});

export const offerIdParamSchema = z.object({
  offerId: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "L'offerId doit être un nombre positif valide. Protection IDOR.",
  }),
});

// ============ MIDDLEWARE DE VALIDATION D'ID ============
// Middleware pour valider automatiquement les paramètres ID
// Protège contre les IDOR en vérifiant que les IDs sont valides
export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const result = idParamSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({
      error: "Paramètre ID invalide",
      details: result.error.flatten(),
      protection: "IDOR validation - ID doit être un nombre positif",
    });
  }
  next();
};

export const validateOfferIdParam = (req: Request, res: Response, next: NextFunction) => {
  const result = offerIdParamSchema.safeParse({
    offerId: req.params.offerId,
  });
  if (!result.success) {
    return res.status(400).json({
      error: "Paramètre offerId invalide",
      details: result.error.flatten(),
      protection: "IDOR validation - offerId doit être un nombre positif",
    });
  }
  next();
};

// ============ PROTECTION CONTRE CSRF ============
// Middleware pour vérifier les requêtes mutantes
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Vérifier que les requêtes de mutation ont un Content-Type approprié
  // Protège contre les attaques CSRF simples
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const contentType = req.headers["content-type"];
    if (
      !contentType ||
      !(
        contentType.includes("application/json") ||
        contentType.includes("application/x-www-form-urlencoded")
      )
    ) {
      return res.status(415).json({
        error: "Content-Type invalide",
        protection: "CSRF protection - Content-Type doit être application/json",
      });
    }
  }
  next();
};

// ============ SANITIZATION DES INPUTS ============
// Fonction pour nettoyer les chaînes de caractères (protection XSS/Injection)
export const sanitizeString = (input: string): string => {
  if (typeof input !== "string") return input;
  return (
    input
      .trim()
      // Échapper les caractères HTML dangereux
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      // Supprimer les scripts potentiels
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  );
};

// Middleware pour sanitizer les inputs du body
export const sanitizeRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.body &&
    typeof req.body === "object" &&
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
  ) {
    // Sanitize toutes les propriétés string du body
    // Protège contre les injections XSS/HTML
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
};

// ============ MIDDLEWARE DE TIMEOUT ============
// Protège contre les attaques de déni de service lent (Slowloris)
export const requestTimeout = (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(30000); // 30 secondes de timeout
  res.setTimeout(30000);
  next();
};
