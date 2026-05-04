import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";

const router = Router();

router.get("/offers", async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany();
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/offers/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const offer = await prisma.offer.findUnique({ where: { id } });
    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable" });
    }
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/offers", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      company,
      location,
      contractType,
      salaryMin,
      salaryMax,
      tags,
      sourceId,
      publishedAt,
      remote,
    } = req.body;
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        company,
        location,
        contractType,
        salaryMin,
        salaryMax,
        tags,
        sourceId,
        publishedAt,
        remote,
      },
    });
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/offers/:id", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const offer = await prisma.offer.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/offers/:id", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await prisma.offer.delete({
      where: { id },
    });
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
