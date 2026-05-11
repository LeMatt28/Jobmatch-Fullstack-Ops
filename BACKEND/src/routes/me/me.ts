import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const role = req.user!.role;

    if (role === "candidate") {
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
        return res.status(404).json({ error: "Candidat introuvable" });
      return res.status(200).json({ ...candidate, role: "candidate" });
    }

    if (role === "company") {
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
      return res.status(200).json({ ...company, role: "company" });
    }

    return res.status(400).json({ error: "Rôle inconnu" });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const role = req.user!.role;

    if (role === "candidate") {
      const {
        name,
        location,
        skills,
        softSkills,
        experience,
        availability,
        salaryExpected,
        mobility,
      } = req.body;
      const updated = await prisma.candidate.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(location && { location }),
          ...(skills && { skills }),
          ...(softSkills && { softSkills }),
          ...(experience && { experience }),
          ...(availability && { availability }),
          ...(salaryExpected && { salaryExpected }),
          ...(mobility !== undefined && { mobility }),
        },
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
      return res.status(200).json(updated);
    }

    if (role === "company") {
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
    }

    return res.status(400).json({ error: "Rôle inconnu" });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

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
      matchRate: likesCount > 0 ? Math.round((matchesCount / likesCount) * 100) : 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});
