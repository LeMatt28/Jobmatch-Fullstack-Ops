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
// Schéma pour créer une offre - Protection injection SQL/XSS
const createOfferSchema = z.object({
  title: z.string().min(3, "Minimum 3 caractères").max(200, "Titre trop long"),
  description: z.string().min(10, "Minimum 10 caractères").max(5000, "Description trop longue"),
  stack: z.array(z.string()).min(1, "Au moins une technologie requise"),
  location: z.string().min(2, "Localisation invalide").max(100),
  contractType: z.enum(["CDI", "CDD", "STAGE", "FREELANCE", "ALTERNANCE"]),
  salaryMin: z.number().positive("Salaire min positif").optional(),
  salaryMax: z.number().positive("Salaire max positif").optional(),
  remote: z.string().max(100, "Remote trop long").optional(),
});

const updateOfferSchema = createOfferSchema.partial();

// ============ CREATE OFFER ============
// Créer une offre d'emploi - Protection contre l'accès non autorisé (authorisation check)
router.post("/offers", generalLimiter, verifyToken, async (req: Request, res: Response) => {
  try {
    // ============ VÉRIFICATION RÔLE ============
    // Vérifier que seules les entreprises peuvent créer des offres - Protection accès non autorisé
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({
        error: "Réservé aux entreprises",
        protection: "Role-based access control (RBAC) - Privilege escalation prevention",
      });
    }
    const companyId = req.user!.id;

    // ============ VALIDATION DES CHAMPS ============
    // Valider les données - Protection injection SQL/XSS
    const result = createOfferSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: result.error.flatten(),
        protection: "Input validation - Zod schema validation",
      });
    }

    const { title, description, stack, location, contractType, salaryMin, salaryMax, remote } =
      result.data;

    // ============ CRÉATION DE L'OFFRE ============
    // Créer l'offre liée à l'entreprise connectée (protection IDOR via l'ID authentifié)
    const offer = await prisma.offer.create({
      data: {
        companyId, // IDOR prevention: utiliser l'ID du token, pas du body
        title: sanitizeString(title),
        description: sanitizeString(description),
        stack,
        location: sanitizeString(location),
        contractType,
        salaryMin,
        salaryMax,
        remote: remote || null,
      },
    });

    return res.status(201).json({
      ...offer,
      protection: "IDOR prevention (companyId from token) + Input validation + XSS sanitization",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Erreur serveur",
      protection: "Generic error response",
    });
  }
});

// ============ GET OFFERS FEED ============
// Obtenir les offres pour un candidat - Protection accès non autorisé + IDOR
router.get("/offers/feed", generalLimiter, verifyToken, async (req: Request, res: Response) => {
  try {
    // ============ VÉRIFICATION RÔLE ============
    // Vérifier que seuls les candidats peuvent accéder au feed - Protection accès non autorisé
    const role = req.user!.role;
    if (role !== "candidate") {
      return res.status(403).json({
        error: "Réservé aux candidats",
        protection: "Role-based access control (RBAC)",
      });
    }
    const candidateId = req.user!.id; // IDOR prevention: utiliser l'ID du token

    const alreadySwiped = await prisma.swipe.findMany({
      where: { candidateId }, // IDOR prevention: filtrer par candidateId authentifié
      select: { offerId: true },
    });

    const swipedIds = alreadySwiped.map((s) => s.offerId);

    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        id: { notIn: swipedIds },
      },
      include: {
        company: { select: { id: true, name: true, scoreReliability: true } },
      },
      take: 10,
    });

    return res.status(200).json(offers);
  } catch (err) {
    return res.status(500).json({
      error: "Erreur serveur",
      protection: "Generic error response",
    });
  }
});

// ============ GET MY OFFERS ============
// Obtenir les offres de l'entreprise - Protection IDOR
router.get("/offers/mine", generalLimiter, verifyToken, async (req: Request, res: Response) => {
  try {
    // ============ VÉRIFICATION RÔLE ============
    // Vérifier que seules les entreprises peuvent voir leurs offres - Protection accès non autorisé
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({
        error: "Réservé aux entreprises",
        protection: "Role-based access control (RBAC)",
      });
    }
    const companyId = req.user!.id; // IDOR prevention: utiliser l'ID du token

    const offers = await prisma.offer.findMany({
      where: { companyId }, // IDOR prevention: filtrer par companyId authentifié
      include: {
        _count: { select: { matches: true } },
      },
    });

    return res.status(200).json(offers);
  } catch (err) {
    return res.status(500).json({
      error: "Erreur serveur",
      protection: "Generic error response",
    });
  }
});

// ============ GET SINGLE OFFER ============
// Obtenir une offre spécifique - Protection IDOR par validation ID
router.get(
  "/offers/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware pour valider que l'ID est un nombre positif
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);

      // ============ RECHERCHE OFFRE ============
      // Prisma utilise les requêtes paramétrées - Protection injection SQL
      const offer = await prisma.offer.findUnique({
        where: { id },
        include: {
          company: { select: { id: true, name: true, scoreReliability: true } },
        },
      });

      if (!offer)
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - ID validation + Database parameterized query",
        });

      return res.status(200).json(offer);
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  }
);

// ============ UPDATE OFFER ============
// Modifier une offre - Protection IDOR via vérification propriétaire
router.put(
  "/offers/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware validation ID
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent modifier - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const id = parseInt(req.params.id as string);

      // ============ VALIDATION DES CHAMPS ============
      // Valider les données mises à jour - Protection injection SQL/XSS
      const result = updateOfferSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Données invalides",
          details: result.error.flatten(),
          protection: "Input validation - Zod schema validation",
        });
      }

      // ============ VÉRIFIER LA PROPRIÉTÉ DE L'OFFRE (IDOR PREVENTION) ============
      // Vérifier que l'offre appartient à l'entreprise connectée
      // Protection IDOR: n'importe qui ne peut modifier que ses propres offres
      const offer = await prisma.offer.findUnique({ where: { id } });
      if (!offer)
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      if (offer.companyId !== req.user!.id) {
        return res.status(403).json({
          error: "Pas votre offre",
          protection:
            "IDOR prevention - Ownership verification. This offer belongs to another company",
        });
      }

      // ============ MISE À JOUR ============
      // Mettre à jour seulement les champs autorisés - Protection contre les updates non autorisées
      const sanitizedData = Object.fromEntries(
        Object.entries(result.data).map(([key, value]) => [
          key,
          typeof value === "string" ? sanitizeString(value) : value,
        ])
      );

      const updated = await prisma.offer.update({
        where: { id },
        data: sanitizedData,
      });

      return res.status(200).json({
        ...updated,
        protection: "IDOR prevention (ownership check) + XSS sanitization",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  }
);

// ============ TOGGLE OFFER STATUS ============
// Activer/désactiver une offre - Protection IDOR
router.patch(
  "/offers/:id/toggle",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware validation ID
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent modifier - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const id = parseInt(req.params.id as string);

      // ============ VÉRIFIER LA PROPRIÉTÉ DE L'OFFRE (IDOR PREVENTION) ============
      // Vérifier que l'offre appartient à l'entreprise connectée
      const offer = await prisma.offer.findUnique({ where: { id } });
      if (!offer)
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      if (offer.companyId !== req.user!.id) {
        return res.status(403).json({
          error: "Pas votre offre",
          protection:
            "IDOR prevention - Ownership verification. This offer belongs to another company",
        });
      }

      // ============ TOGGLE STATUS ============
      const updated = await prisma.offer.update({
        where: { id },
        data: { isActive: !offer.isActive },
      });

      return res.status(200).json({
        isActive: updated.isActive,
        protection: "IDOR prevention (ownership check) + Database parameterized query",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  }
);

// ============ DELETE OFFER ============
// Supprimer une offre - Protection IDOR
router.delete(
  "/offers/:id",
  generalLimiter,
  verifyToken,
  validateIdParam, // Middleware validation ID
  async (req: Request, res: Response) => {
    try {
      // ============ VÉRIFICATION RÔLE ============
      // Vérifier que seules les entreprises peuvent supprimer - Protection accès non autorisé
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({
          error: "Réservé aux entreprises",
          protection: "Role-based access control (RBAC)",
        });
      }
      const id = parseInt(req.params.id as string);

      // ============ VÉRIFIER LA PROPRIÉTÉ DE L'OFFRE (IDOR PREVENTION) ============
      // Vérifier que l'offre appartient à l'entreprise connectée
      const offer = await prisma.offer.findUnique({ where: { id } });
      if (!offer)
        return res.status(404).json({
          error: "Offre introuvable",
          protection: "IDOR prevention - Non-existent resource",
        });

      if (offer.companyId !== req.user!.id) {
        return res.status(403).json({
          error: "Pas votre offre",
          protection:
            "IDOR prevention - Ownership verification. This offer belongs to another company",
        });
      }

      // ============ SUPPRESSION ============
      await prisma.offer.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({
        error: "Erreur serveur",
        protection: "Generic error response",
      });
    }
  }
);

export default router;
