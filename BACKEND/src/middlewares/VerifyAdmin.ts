// imports
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/JWTPayload";

//middleware verifier si admin
export const VerifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user as JwtPayload;
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Accès refusé, admin requis" });
    return;
  }
  next();
};
