# Analyse des menaces – Premier niveau

**Dernière mise à jour** : 2026-04-29  
**Statut global** : ✅ Authentification sécurisée – En cours sur les autres menaces  
**Auteur** : Cyber

---

## Contexte

Ce document recense les menaces principales identifiées avant le développement, ainsi que les contrôles implémentés pour les mitiger.

---

## Tableau des menaces et contrôles

| ID | Menace | Contrôle principal | État | Date validation |
|----|--------|-------------------|------|-----------------|
| T01 | Injection SQL | Requêtes paramétrées (Prisma ORM) | ✅ **FAIT** | 2026-04-29 |
| T02 | Brute-force sur l'authentification | Rate limiting (10/login, 5/register) + validation inputs | ✅ **FAIT** | 2026-04-29 |
| T03 | Exposition de secrets | `.env` + `JWT_SECRET` en variable d'environnement | ✅ **FAIT** | 2026-04-29 |
| T04 | Vol de token JWT | Cookie HttpOnly + durée 15min + Secure + SameSite=Strict | ✅ **FAIT** | 2026-04-29 |
| T05 | Accès non autorisé aux routes admin | Middleware RBAC (à implémenter) | ⚠️ **En cours** | - |

---

## Détail des contrôles implémentés

### T01 – Injection SQL

| Contrôle | Implémentation | Statut |
|----------|----------------|--------|
| Requêtes paramétrées | Prisma ORM (type-safe, pas de concaténation SQL) | ✅ |
| Pas de requêtes brutes | Aucune `prisma.$queryRaw` utilisée | ✅ |

### T02 – Brute-force sur l'authentification

| Contrôle | Implémentation | Statut |
|----------|----------------|--------|
| Rate limiting login | 10 tentatives / 15 minutes par IP | ✅ |
| Rate limiting register | 5 tentatives / 15 minutes par IP | ✅ |
| Validation des entrées | `express-validator` (email, password min 8) | ✅ |
| Message d'erreur unique | "Identifiants invalides." (pas de fuite d'information) | ✅ |

### T03 – Exposition de secrets

| Contrôle | Implémentation | Statut |
|----------|----------------|--------|
| Variables d'environnement | `.env` avec `dotenv` | ✅ |
| `JWT_SECRET` | Vérifié avant utilisation | ✅ |
| `.gitignore` | `.env` exclus du versionnement | ✅ |
| `.env.example` | Documenté et versionné | ✅ |

### T04 – Vol de token JWT

| Contrôle | Implémentation | Statut |
|----------|----------------|--------|
| Stockage | Cookie `httpOnly: true` (inaccessible à JS) | ✅ |
| HTTPS uniquement | `secure: process.env.NODE_ENV === "production"` | ✅ |
| Protection CSRF | `sameSite: "strict"` | ✅ |
| Durée token | 15 minutes (`expiresIn: "15m"`) | ✅ |
| Token dans body | ❌ Supprimé (plus renvoyé) | ✅ |
| Vérification secret | `if (!process.env.JWT_SECRET)` avant signature | ✅ |

### T05 – Accès non autorisé aux routes admin

| Contrôle | Implémentation | Statut |
|----------|----------------|--------|
| Middleware RBAC | À implémenter | ⚠️ |
| Routes protégées par défaut | À définir | ⚠️ |

---

## Fichiers audités et validés

| Fichier | Statut | Observations |
|---------|--------|--------------|
| `index.ts` | ✅ Validé | CORS restreint, /health protégé par IP |
| `login.ts` | ✅ Validé | Rate limiting, JWT cookie, message unique |
| `register.ts` | ✅ Validé | Rate limiting, bcrypt, validation entrées |

---

## Prochaines actions

| Action | Priorité | Responsable | Deadline |
|--------|----------|-------------|----------|
| Implémenter middleware RBAC pour routes `/admin/*` | Haute | Back | À définir |
| Ajouter refresh token pour rotation | Moyenne | Back | À définir |
| Ajouter Captcha après 3 échecs login | Basse | Back | À définir |
| Centraliser les logs de sécurité | Basse | Ops | À définir |

---
