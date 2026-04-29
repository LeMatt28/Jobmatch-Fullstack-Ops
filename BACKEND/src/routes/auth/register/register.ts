import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Champs manquant" });
    }

    const VerifyUSer = await prisma.user.findUnique({
      where: { email },
    });

    if (VerifyUSer) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const HashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: HashPassword, name },
    });

    return res.status(201).json({ message: "Utilisateur crée avec succès.", UserId: user.id });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
