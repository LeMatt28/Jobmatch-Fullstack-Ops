import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { registerSchema } from "../../../validators/AuthValidator";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const { email, name, password } = result.data;

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

    return res
      .status(201)
      .json({ message: "Utilisateur crée avec succès.", UserId: user.id });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
