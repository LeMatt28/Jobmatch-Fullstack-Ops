import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

router.get("/stats/contracts", async (req: Request, res: Response) => {
  try {
    const stats = await prisma.offer.groupBy({
      by: ["contractType"],
      _count: { contractType: true },
    });
    res.status(200).json({ stats });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/stats/salary", async (req: Request, res: Response) => {
  try {
    const stats = await prisma.offer.groupBy({
      by: ["contractType"],
      _avg: { salaryMin: true, salaryMax: true },
    });
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/stats/locations", async (req: Request, res: Response) => {
  try {
    const stats = await prisma.offer.groupBy({
      by: ["location"],
      _count: { location: true },
      orderBy: { _count: { location: "desc" } },
      take: 10,
    });
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
