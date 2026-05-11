# Validation sécurité – Authentification

**Date** : 2026-04-29  
**Validateur** : Cyber  
**Version des fichiers** : Finale validée

---

## Résumé

L'ensemble des fichiers relatifs à l'authentification a été audité, corrigé et validé.

| Fichier | Statut | Points clés vérifiés |
|---------|--------|---------------------|
| `index.ts` | ✅ Validé | CORS restreint, health IP whitelist |
| `login.ts` | ✅ Validé | Rate limit, JWT cookie, message unique |
| `register.ts` | ✅ Validé | Rate limit, bcrypt, validation entrées |

---

## Audit détaillé

### 1. `index.ts`

| Vérification | Résultat | Ligne / Preuve |
|--------------|----------|----------------|
| CORS avec whitelist | ✅ | `allowedOrigins = ["http://localhost:3000", ...]` |
| `/health` protégé par IP | ✅ | `allowedIPs = ["127.0.0.1", "::1"]` |
| `express.json()` présent | ✅ | `app.use(express.json())` |
| Port via variable d'environnement | ✅ | `process.env.PORT \|\| 3001` |

### 2. `login.ts`

| Vérification | Résultat | Ligne / Preuve |
|--------------|----------|----------------|
| Rate limiting | ✅ | `max: 10`, `windowMs: 15 * 60 * 1000` |
| Validation email | ✅ | `body("email").isEmail()` |
| Validation password | ✅ | `body("password").isLength({ min: 8 })` |
| Message d'erreur unique | ✅ | `"Identifiants invalides."` |
| Vérification `JWT_SECRET` existe | ✅ | `if (!process.env.JWT_SECRET)` |
| `bcrypt.compare` utilisé | ✅ | `await bcrypt.compare(password, user.password)` |
| Token en cookie HttpOnly | ✅ | `httpOnly: true` |
| `secure` en production | ✅ | `secure: process.env.NODE_ENV === "production"` |
| `sameSite: "strict"` | ✅ | `sameSite: "strict"` |
| Durée 15 minutes | ✅ | `expiresIn: "15m"`, `maxAge: 900000` |
| Pas de token dans body | ✅ | Seulement `{ message: "..." }` |

### 3. `register.ts`

| Vérification | Résultat | Ligne / Preuve |
|--------------|----------|----------------|
| Rate limiting | ✅ | `max: 5`, `windowMs: 15 * 60 * 1000` |
| Validation email + normalisation | ✅ | `isEmail() + normalizeEmail()` |
| Validation password min 8 | ✅ | `isLength({ min: 8 })` |
| Validation name + trim + escape | ✅ | `trim() + escape()` |
| Vérification email unique | ✅ | `findUnique` avant création |
| bcrypt hash avec salt 10 | ✅ | `bcrypt.hash(password, 10)` |
| Aucun mot de passe dans réponse | ✅ | Seulement `userId` |

---

## Points de vigilance pour la suite

| Sujet | Recommandation | Priorité |
|-------|----------------|----------|
| Refresh token | Implémenter pour éviter reconnexion fréquente | Moyenne |
| Captcha login | Ajouter après 3 échecs | Basse |
| Logs sécurité | Centraliser les tentatives échouées | Moyenne |
| Rotation JWT secret | Automatiser tous les 30 jours | Basse |
| Middleware RBAC admin | Implémenter pour T05 | Haute |

---

## Validation finale

| Menace | Statut |
|--------|--------|
| T01 – Injection SQL | ✅ FAIT |
| T02 – Brute-force | ✅ FAIT |
| T03 – Exposition secrets | ✅ FAIT |
| T04 – Vol JWT | ✅ FAIT |
| T05 – Accès admin | ⚠️ En cours |

**Conclusion** : L'authentification est sécurisée et peut être mergée en production. La route admin reste à protéger.

---
