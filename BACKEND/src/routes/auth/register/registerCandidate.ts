//imports 
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const router = Router();

// defini quand champs = ok
const candidateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

// creer candidat
router.post("/register/candidate", async (req: Request, res: Response) => {
  try {
    //verif des champs
    const result = candidateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const { email, password, name } = result.data;
    
    //verifie si existe pas deja
    const existing = await prisma.candidate.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    
    //hash le password
    const hashed = await bcrypt.hash(password, 10);
    //creer le user
    const candidate = await prisma.candidate.create({
      data: { email, password: hashed, name },
    });

    return res.status(201).json({ message: "Candidat créé", id: candidate.id });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
