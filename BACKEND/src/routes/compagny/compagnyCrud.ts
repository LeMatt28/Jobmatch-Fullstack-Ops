import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

// GET /company/me — profil entreprise connectée
router.get("/company/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const id = req.user!.id;
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
      return res.status(404).json({ error: "Entreprise introuvable" });
    return res.status(200).json(company);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /company/me — modifier profil entreprise
router.put("/company/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const id = req.user!.id;
    const { name, sector, size, description, values } = req.body;

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sector && { sector }),
        ...(size && { size }),
        ...(description && { description }),
        ...(values && { values }),
      },
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
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /company/:id — profil public d'une entreprise
router.get("/company/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
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
      return res.status(404).json({ error: "Entreprise introuvable" });
    return res.status(200).json(company);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
