import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email, OldPassword, NewPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    if (OldPassword && NewPassword) {
      const isValid = await bcrypt.compare(OldPassword, user.password as string);
      if (!isValid) {
        return res.status(401).json({ error: "Mot de passe actuel incorrect" });
      }
    }
    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(NewPassword && { password: await bcrypt.hash(NewPassword, 10) }),
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.status(200).json(userUpdate);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});



router.get("/me/saved-offers", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const savedOffers = await prisma.savedOffer.findMany({
          where: { userId },
          include: { offer: true },
        });
        res.status(200).json(savedOffers);
    } catch(err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
})


router.post("/me/saved-offers/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const offerId = parseInt(req.params.id as string)
        const savedOffer = await prisma.savedOffer.create({
          data: { userId, offerId },
        });
        res.status(201).json(savedOffer);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
})


router.delete("/me/saved-offers/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const offerId = parseInt(req.params.id as string);
    await prisma.savedOffer.delete({
      where: { userId_offerId: { userId, offerId } },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


export default router;