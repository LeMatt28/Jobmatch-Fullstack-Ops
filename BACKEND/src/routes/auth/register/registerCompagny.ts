//imports
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const router = Router();

// defini quand champs = ok
const companySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  sector: z.string().optional(),
});

// creer entreprise
router.post("/register/company", async (req: Request, res: Response) => {
  try {
    //verif des champs
    const result = companySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const { email, password, name, sector } = result.data;

    //verifie si existe pas deja
    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    //hash le password
    const hashed = await bcrypt.hash(password, 10);
    const company = await prisma.company.create({
      data: { email, password: hashed, name, sector },
    });

    return res
      .status(201)
      .json({ message: "Entreprise créée", id: company.id });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
