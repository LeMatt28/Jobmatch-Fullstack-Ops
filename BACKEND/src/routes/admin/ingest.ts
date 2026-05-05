import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../middlewares/AuthMidlleware";
import { VerifyAdmin } from "../../middlewares/VerifyAdmin";

const router = Router();

router.post("/admin/ingest", verifyToken, VerifyAdmin, async (req: Request, res: Response) => {});
