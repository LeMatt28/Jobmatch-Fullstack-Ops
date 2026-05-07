// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

//* SWIPE
router.post(
  "/offers/:id/swipe",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      //recup role user (on veut candidat)
      const role = req.user!.role;
      if (role !== "candidate") {
        return res.status(403).json({ error: "Réservé aux candidats" });
      }
      // recup de 3 params (quel candidat quelle offre et quel swipe)
      const candidateId = req.user!.id;
      const offerId = parseInt(req.params.id as string);
      const { direction } = req.body;

      // verifie si l'offre existe bien
      const offer = await prisma.offer.findUnique({ where: { id: offerId } });
      if (!offer) return res.status(404).json({ error: "Offre introuvable" });

      // on ne veut que un swipe valide
      if (!["LIKE", "DISLIKE"].includes(direction)) {
        return res.status(400).json({ error: "Direction invalide" });
      }

      //pour eviter que on swipe 2x la meme offre
      const existingSwipe = await prisma.swipe.findUnique({
        where: { candidateId_offerId: { candidateId, offerId } },
      });
      if (existingSwipe) {
        return res
          .status(409)
          .json({ error: "Vous avez déjà swipé cette offre" });
      }

      // si tout est bon on defini le swipe (avec les 3 params du dessus)
      await prisma.swipe.create({
        data: { candidateId, offerId, direction },
      });

      //  if dislike = pas match
      if (direction === "DISLIKE") {
        return res.status(200).json({ matched: false });
      }
      // else like = match
      const match = await prisma.match.create({
        data: { candidateId, offerId },
      });

      return res.status(200).json({ matched: true, matchId: match.id });
    } catch (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },
);

export default router;
