// imports
import http from "http";
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
import oauthRoutes from "./routes/auth/oauth/oauthRoutes";

// env
dotenv.config();

//back
const app = express();
const port = process.env.PORT || 3001;

// ============ MIDDLEWARES DE SÉCURITÉ GLOBAUX ============

// CORS - Contrôler les origines des requêtes
// Protection contre les attaques CSRF et XSS cross-origin
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));

// Parser JSON
app.use(express.json());

// Helmet - Headers de sécurité HTTP
app.use(helmet({ crossOriginResourcePolicy: false }));

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
app.use("/candidate", registerLimiter);
app.use("/company", registerLimiter);
app.use(authLimiter);

app.use("/candidate", registerCandidate); // POST /candidate/register
app.use("/company",   registerCompany);   // POST /company/register
app.use("/",          login);             // POST /login
app.use("/auth",      oauthRoutes);       // GET /auth/:provider/redirect, GET /auth/:provider/callback

// ============ ROUTES PROTÉGÉES ============
app.use("/candidate", me);      // GET|PUT /candidate/profile, GET /candidate/stats
app.use("/candidate", swipe);   // POST /candidate/swipe/:id
app.use("/candidate", matches); // GET /candidate/matches
app.use("/candidate", offers);  // GET /candidate/feed

app.use("/company", company);   // GET|PUT /company/profile, GET /company/:id
app.use("/company", offers);    // GET|POST|PUT|DELETE /company/offers(/:id)
app.use("/company", matches);   // GET /company/matches/:offerId

app.use("/", reviews);
app.use("/", admin);

// ============ MIDDLEWARE GESTION DES ERREURS ============
// Gérer les erreurs de manière sécurisée
// Ne pas révéler les détails techniques en production
app.use(errorHandle);

// ============ DÉMARRAGE DU SERVEUR ============
const server = http.createServer(app);

// Node.js 18+ retourne HTTP 426 automatiquement pour les requêtes avec header
// Upgrade (h2c, websocket) sans gestionnaire — on ferme proprement avec 400.
server.on("upgrade", (_req, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, () => {
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
