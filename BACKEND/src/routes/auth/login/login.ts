//imports
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

//router
const router = Router();

//verif des champs avec zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

//se connecter
router.post("/login", async (req: Request, res: Response) => {
  try {
    // si champs ok
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const { email, password } = result.data;

    // Cherche dans candidate d'abord, puis company
    let user: any = await prisma.candidate.findUnique({ where: { email } });
    let role = "candidate";

    if (!user) {
      user = await prisma.company.findUnique({ where: { email } });
      role = "company";
    }

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // verif password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    //creation token
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // renvoie le user
    return res.status(200).json({
      token,
      role,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
