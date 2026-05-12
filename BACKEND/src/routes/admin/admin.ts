import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";

const router = Router();

// get entreprise et candidat
router.get(
  "/admin/users",
  verifyToken,
  VerifyAdmin,
  async (req: Request, res: Response) => {
    try {
      const candidates = await prisma.candidate.findMany({
        select: { id: true, email: true, name: true, createdAt: true },
      });
      const companies = await prisma.company.findMany({
        select: { id: true, email: true, name: true, createdAt: true },
      });
      return res.status(200).json({ candidates, companies });
    } catch (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },
);

// delete candidat ou entreprise
router.delete(
  "/admin/users/:id",
  verifyToken,
  VerifyAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { type } = req.query;

      if (type === "candidate") {
        await prisma.candidate.delete({ where: { id } });
      } else if (type === "company") {
        await prisma.company.delete({ where: { id } });
      } else {
        return res
          .status(400)
          .json({ error: "Type requis : candidate ou company" });
      }

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },
);

export default router;
