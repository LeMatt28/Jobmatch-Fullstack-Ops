//imports
import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { JwtPayload } from "../types/JWTPayload";

// middleware token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const AuthHeaders = req.headers.authorization;

  if (!AuthHeaders) return res.status(401).json({ message: "Token manquant" });
  const tokenWB = AuthHeaders.split(" ")[1];
  try {
    const decoded = JWT.verify(tokenWB, process.env.JWT_SECRET as string);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};
