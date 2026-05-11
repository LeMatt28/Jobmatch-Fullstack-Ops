// imports
import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";

const router = Router();

// post review entreprise to candidat
router.post("/reviews/candidate/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    // verif si entreprise
    const role = req.user!.role;
    if (role !== "company") {
      return res.status(403).json({ error: "Réservé aux entreprises" });
    }
    //recup params
    const companyId = req.user!.id;
    const candidateId = parseInt(req.params.id as string);
    const { score, comment } = req.body;

    
    // verif si la review = okkkk
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: "Score entre 1 et 5 requis" });
    }

    // creer review si tout good
    const review = await prisma.candidateReview.create({
      data: { candidateId, companyId, score, comment },
    });

    return res.status(201).json(review);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});



// post candidat vers entreprise
router.post("/reviews/company/:id", verifyToken, async (req: Request, res: Response) => {
  try {

    // verif si bien candidat
    const role = req.user!.role;
    if (role !== "candidate") {
      return res.status(403).json({ error: "Réservé aux candidats" });
    }

    // recup params
    const candidateId = req.user!.id;
    const companyId = parseInt(req.params.id as string);
    const { score, comment } = req.body;

    // vefif si review ok
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: "Score entre 1 et 5 requis" });
    }

    //  creer review su tout good
    const review = await prisma.companyReview.create({
      data: { companyId, candidateId, score, comment },
    });

    return res.status(201).json(review);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;