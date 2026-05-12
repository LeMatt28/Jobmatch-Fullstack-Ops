//imports
import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { JwtPayload } from "../types/JWTPayload";

// ============ MIDDLEWARE D'AUTHENTIFICATION ============
// Middleware pour vérifier le JWT token - protège contre les accès non autorisés
// Vérifie que le token est présent, valide et n'a pas expiré
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const AuthHeaders = req.headers.authorization;

  // Vérifier que le header Authorization est présent - Protection contre l'accès non autorisé
  if (!AuthHeaders)
    return res.status(401).json({
      error: "Token manquant",
      protection: "Authentication required - Authorization header missing",
    });

  // Vérifier le format "Bearer <token>" - Protection contre les formats invalides
  const parts = AuthHeaders.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Format Authorization invalide",
      protection: "Token format must be 'Bearer <token>' - Protection contre accès non autorisé",
    });
  }

  const tokenWB = parts[1];

  // Vérifier que le token n'est pas vide
  if (!tokenWB || tokenWB.trim().length === 0) {
    return res.status(401).json({
      error: "Token invalide",
      protection: "Token cannot be empty - Protection contre injection",
    });
  }

  try {
    // Vérifier la signature et l'expiration du token
    // Protège contre les tokens falsifiés et les sessions expirées
    const decoded = JWT.verify(tokenWB, process.env.JWT_SECRET as string);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    // Répondre de manière générique pour ne pas révéler d'infos sensibles
    // Protection contre les attaques d'énumération
    res.status(401).json({
      error: "Token invalide ou expiré",
      protection: "JWT signature invalid or expired - Protection contre usurpation",
    });
  }
};
