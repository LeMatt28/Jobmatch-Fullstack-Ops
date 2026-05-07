import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

router.post("/offers", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const companyId = req.user!.id;

    const { title, description, stack, location, contractType,
            salaryMin, salaryMax, remote, isActive } = req.body;

    const offer = await prisma.offer.create({
      data: {
        companyId,
        title,
        description,
        stack,
        location,
        contractType,
        salaryMin,
        salaryMax,
        remote,
      },
    });

    return res.status(201).json(offer);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/offers/feed", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "candidate") {
      return res.status(403).json({ error: "Réservé aux candidats" });
    }
    const candidateId = req.user!.id;

    const alreadySwiped = await prisma.swipe.findMany({
      where: { candidateId },
      select: { offerId: true },
    });

    const swipedIds = alreadySwiped.map(s => s.offerId);

    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        id: { notIn: swipedIds },
      },
      include: { company: { select: { id: true, name: true, scoreReliability: true } } },
      take: 10,
    });

    return res.status(200).json(offers);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});



router.get("/offers/mine", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const companyId = req.user!.id;

    const offers = await prisma.offer.findMany({
      where: { companyId },
      include: {
        _count: { select: { matches: true } },
      },
    });

    return res.status(200).json(offers);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});



router.get("/offers/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { company: { select: { id: true, name: true, scoreReliability: true } } },
    });
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    return res.status(200).json(offer);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});



router.put("/offers/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const id = parseInt(req.params.id as string);

    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    if (offer.companyId !== req.user!.id) {
      return res.status(403).json({ error: "Pas votre offre" });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});


router.patch("/offers/:id/toggle", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const id = parseInt(req.params.id as string);

    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    if (offer.companyId !== req.user!.id) {
      return res.status(403).json({ error: "Pas votre offre" });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: { isActive: !offer.isActive },
    });

    return res.status(200).json({ isActive: updated.isActive });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});



router.delete("/offers/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    const id = parseInt(req.params.id as string);
    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    if (offer.companyId !== req.user!.id) {
      return res.status(403).json({ error: "Pas votre offre" });
    }
    await prisma.offer.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;