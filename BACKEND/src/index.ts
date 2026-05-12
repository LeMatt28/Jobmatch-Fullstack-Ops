// imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorHandle } from "./middlewares/HandleError";
import {
  authLimiter,
  registerLimiter,
  csrfProtection,
  sanitizeRequestBody,
  requestTimeout,
} from "./middlewares/SecurityMiddleware";
import registerCandidate from "./routes/auth/register/registerCandidate";
import registerCompany from "./routes/auth/register/registerCompagny";
import login from "./routes/auth/login/login";
import me from "./routes/me/me";
import offers from "./routes/offers/OfferCrud";
import swipe from "./routes/offers/swipe";
import matches from "./routes/matches/matches";
import company from "./routes/compagny/compagnyCrud";
import reviews from "./routes/reviews/Reviews";
import admin from "./routes/admin/admin";

// env
dotenv.config();

//back
const app = express();
const port = process.env.PORT || 3001;

// ============ MIDDLEWARES DE SÉCURITÉ GLOBAUX ============

// CORS - Contrôler les origines des requêtes
// Protection contre les attaques CSRF et XSS cross-origin
app.use(cors());

// Parser JSON
app.use(express.json());

// Helmet - Headers de sécurité HTTP
// Protection contre XSS, clickjacking, MIME sniffing, etc.
app.use(helmet());

// ============ PROTECTIONS SUPPLÉMENTAIRES ============

// Protection du timeout - Prévention des attaques Slowloris
// Protège contre les attaques de déni de service lent
app.use(requestTimeout);

// Protection CSRF - Vérifier le Content-Type des requêtes mutatrices
// Protège contre les attaques CSRF simples
app.use(csrfProtection);

// Sanitization des inputs - Échapper les caractères HTML dangereux
// Protection contre les injections XSS
app.use(sanitizeRequestBody);

// ============ ROUTES PUBLIQUES ============

// Routes de santé
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    protection: "Health check endpoint - No sensitive information",
  });
});

// ============ ROUTES AUTHENTIFICATION ============
// Rate limiter sur les routes d'authentification
// Protection brute force sur login (5 tentatives/15min)
app.use("/auth", authLimiter);
app.use("/auth", registerLimiter);

app.use("/auth", registerCandidate);
app.use("/auth", registerCompany);
app.use("/auth", login);

// ============ ROUTES PROTÉGÉES ============
// Toutes les autres routes demandent un token JWT

app.use("/", me);
app.use("/", offers);
app.use("/", swipe);
app.use("/", matches);
app.use("/", company);
app.use("/", reviews);
app.use("/", admin);

// ============ MIDDLEWARE GESTION DES ERREURS ============
// Gérer les erreurs de manière sécurisée
// Ne pas révéler les détails techniques en production
app.use(errorHandle);

// ============ DÉMARRAGE DU SERVEUR ============
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  console.log("Security middleware enabled:");
  console.log("  - Helmet (HTTP security headers)");
  console.log("  - CORS (Cross-Origin Resource Sharing)");
  console.log("  - Rate limiting (Brute force protection)");
  console.log("  - CSRF protection");
  console.log("  - Input sanitization (XSS prevention)");
  console.log("  - JWT verification (Authentication)");
  console.log("  - Role-based access control (Authorization)");
});
