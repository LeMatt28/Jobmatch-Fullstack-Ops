// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

// get les matchs
router.get("/me/matches", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "candidate") {
      return res.status(403).json({ error: "Réservé aux candidats" });
    }
    const candidateId = req.user!.id;

    const matches = await prisma.match.findMany({
      where: { candidateId },
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

    return res.status(200).json(matches);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// get les matchs coté entreprise
router.get(
  "/matches/:offerId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const role = req.user!.role;
      if (role !== "company") {
        return res.status(403).json({ error: "Réservé aux entreprises" });
      }
      const offerId = parseInt(req.params.offerId as string);
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

      return res.status(200).json(matches);
    } catch (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },
);

export default router;
