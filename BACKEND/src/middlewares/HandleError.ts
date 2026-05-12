// imports
import { Request, Response, NextFunction } from "express";

// ============ MIDDLEWARE DE GESTION D'ERREURS ============
// Middleware pour capturer et traiter les erreurs de manière sécurisée
// Protection: ne pas révéler les détails techniques en production
export const errorHandle = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log en interne l'erreur complète pour le debugging
  // Protège contre la fuite d'infos sensibles aux clients
  console.error("Erreur serveur:", err.message);
  console.error("Stack:", err.stack);

  // ============ RÉPONSE GÉNÉRIQUE ============
  // Répondre avec une erreur générique sans révéler de détails techniques
  // Protection: n'importe quelle erreur serveur n'expose pas l'implémentation interne
  res.status(500).json({
    error: "Erreur serveur inattendue",
    protection: "Generic error message - Technical details hidden from client",
  });
};
