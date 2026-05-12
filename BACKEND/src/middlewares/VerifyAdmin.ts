// imports
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/JWTPayload";

// ============ MIDDLEWARE DE VÉRIFICATION DE RÔLE ADMIN ============
// Middleware pour vérifier que l'utilisateur a le rôle admin
// Protège contre les accès non autorisés aux routes réservées à l'administration
// Protection contre l'escalade de privilèges (Privilege Escalation)
export const VerifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as JwtPayload;

  // Vérifier que l'utilisateur est authentifié - Protection contre accès non autorisé
  if (!user) {
    res.status(401).json({
      error: "Utilisateur non authentifié",
      protection: "Authentication required - Protégé contre accès non autorisé",
    });
    return;
  }

  // Vérifier que l'utilisateur a le rôle admin
  // Protection contre l'escalade de privilèges et les accès non autorisés
  if (user.role !== "admin") {
    res.status(403).json({
      error: "Accès refusé, admin requis",
      protection:
        "Authorization failed - Only admins can access this resource (Privilege Escalation prevention)",
    });
    return;
  }
  next();
};
