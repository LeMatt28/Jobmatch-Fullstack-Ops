import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";

const router = Router();

router.get("/users", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
    try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/users/:id/role", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
    try {
    const id = parseInt(req.params.id as string);
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
})





router.delete("/users/:id", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {
    try {
    const id = parseInt(req.params.id as string);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
})


export default router;