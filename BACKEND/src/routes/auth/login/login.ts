import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { loginSchema } from "../../../validators/AuthValidator";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable." });

    const compare = await bcrypt.compare(password, user.password as string);
    if (!compare) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

export default router;
