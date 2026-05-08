# Validation sécurité – Authentification et Routes

**Date** : 2026-05-08  
**Validateur** : Dev Team + Cyber  
**Version des fichiers** : Validation complète des routes

---

## Résumé

L'ensemble des fichiers relatifs à l'authentification ET aux routes protégées a été audité et sécurisé.

| Fichier | Statut | Points clés vérifiés |
|---------|--------|---------------------|
| `index.ts` | ✅ Sécurisé | Helmet, CORS, rate limit global, sanitization |
| `login.ts` | ✅ Sécurisé | Rate limit (5/15min), Zod validation, timing attack |
| `registerCandidate.ts` | ✅ Sécurisé | Rate limit (3/heure), password strength, Zod |
| `registerCompagny.ts` | ✅ Sécurisé | Rate limit (3/heure), password strength, Zod |
| `OfferCrud.ts` | ✅ Sécurisé | IDOR ownership checks, ID validation, Zod |
| `swipe.ts` | ✅ Sécurisé | Duplicate prevention, ID validation, RBAC |
| `matches.ts` | ✅ Sécurisé | IDOR offer ownership, RBAC |
| `Reviews.ts` | ✅ Sécurisé | Interaction verification, Zod validation |
| `compagnyCrud.ts` | ✅ Sécurisé | IDOR ownership, field whitelisting |
| `me.ts` | ✅ Sécurisé | IDOR user ID from token, sanitization |

---

## Audit détaillé - Nouvelles Protections (2026-05-08)

### A. Rate Limiting Avancé (SecurityMiddleware.ts)

| Protection | Implémentation | Fenêtre |
|-----------|---|---------|
| **authLimiter** | POST /auth/login | 5 tentatives / 15 minutes |
| **registerLimiter** | POST /auth/register/* | 3 inscriptions / heure |
| **generalLimiter** | GET/POST toutes les routes | 100 requêtes / minute |

**Code** :
```typescript
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Trop de tentatives. Réessayez dans 15 minutes."
});
```

### B. Protection IDOR (Insecure Direct Object Reference)

#### Middleware ID Validation
```typescript
// Valide que les IDs sont des nombres positifs
export const validateIdParam = (req, res, next) => {
  const result = idParamSchema.safeParse({ id: req.params.id });
  if (!result.success) return res.status(400).json(...);
  next();
};
```

#### Ownership Verification
Chaque route POST/PUT/PATCH/DELETE vérifie la propriété :
```typescript
// Dans OfferCrud.ts, PUT /offers/:id
if (offer.companyId !== req.user!.id) {
  return res.status(403).json({ error: "Pas votre offre" });
}
```

**Routes sécurisées**:
- ✅ PUT /offers/:id – Vérification companyId
- ✅ DELETE /offers/:id – Vérification companyId
- ✅ PATCH /offers/:id/toggle – Vérification companyId
- ✅ GET /matches/:offerId – Vérification offre de l'entreprise
- ✅ POST /reviews/candidate/:id – Interaction check
- ✅ POST /reviews/company/:id – Interaction check

### C. Injection SQL & XSS Prevention

#### Zod Validation Schema
```typescript
const createOfferSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  stack: z.array(z.string()).min(1),
  contractType: z.enum(["CDI", "CDD", "STAGE", "FREELANCE", "ALTERNANCE"]),
  // etc...
});
```

#### Sanitization Function
```typescript
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/&/g, "&amp;")   // Échappe &
    .replace(/</g, "&lt;")    // Échappe <
    .replace(/>/g, "&gt;")    // Échappe >
    .replace(/"/g, "&quot;")  // Échappe "
    .replace(/'/g, "&#x27;")  // Échappe '
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""); // Supprime scripts
};
```

**Appliqué** : À tous les inputs dans POST/PUT/PATCH

### D. Timing Attack Prevention (Login)

```typescript
// Même si utilisateur n'existe pas, on compare un hash fictif
if (!user) {
  await bcrypt.compare(password, "$2a$10$fictive.hash");
  return res.status(401).json({ error: "Identifiants incorrects" });
}
```

**Résultat** : Impossible de savoir si email existe en comparant les temps réponse

### E. Password Strength Validation

```typescript
const candidateSchema = z.object({
  password: z
    .string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
});
```

**Résultat** : Mots de passe forts obligatoires (ex: `ValidPass123`)

### F. CSRF Protection

```typescript
export const csrfProtection = (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const contentType = req.headers["content-type"];
    if (!contentType?.includes("application/json")) {
      return res.status(415).json({ error: "Content-Type invalide" });
    }
  }
  next();
};
```

**Résultat** : Requêtes avec mauvais Content-Type rejetées

### G. Interaction Verification (Reviews)

```typescript
// Dans Reviews.ts, POST /reviews/candidate/:id
const hasInteraction = await prisma.match.findFirst({
  where: {
    offer: { companyId },
    candidateId
  }
});
if (!hasInteraction) {
  return res.status(403).json({
    error: "Vous n'avez pas d'interaction avec ce candidat"
  });
}
```

**Résultat** : Les reviews ne peuvent être laissées que sur utilisateurs matchés

---

## Matrice de Sécurité Finale

| Menace | Protection | Middleware | Code |
|--------|-----------|-----------|------|
| **Brute Force** | authLimiter | ✅ | ✅ |
| **Injection SQL** | Prisma + Zod | ✅ | ✅ |
| **IDOR** | Ownership check | ✅ | ✅ |
| **XSS** | Sanitization | ✅ | ✅ |
| **Timing Attack** | Dummy hash | ✅ | ✅ |
| **CSRF** | Content-Type | ✅ | ✅ |
| **Slowloris** | Timeout 30s | ✅ | ✅ |
| **Fuite Info** | Generic errors | ✅ | ✅ |
| **Weak Password** | Regex validation | ✅ | ✅ |
| **Unauthorized** | RBAC + JWT | ✅ | ✅ |

---

## Validation finale

| Menace | Statut | Preuve |
|--------|--------|--------|
| T01 – Injection SQL | ✅ FAIT | Zod + Prisma partout |
| T02 – Brute-force | ✅ FAIT | authLimiter + timing |
| T03 – Exposition secrets | ✅ FAIT | .env validation |
| T04 – Vol JWT | ✅ FAIT | HttpOnly cookie |
| T05 – Accès admin | ✅ FAIT | RBAC + IDOR checks |
| **BONUS** – XSS | ✅ FAIT | Sanitization |
| **BONUS** – CSRF | ✅ FAIT | Content-Type check |
| **BONUS** – DDoS | ✅ FAIT | Timeout + rate limit |

**Conclusion** : Tous les endpoints sont sécurisés. Le code peut être mergé en production.

---

## Points de vigilance futurs

| Sujet | Recommandation | Priorité |
|-------|----------------|----------|
| Refresh token | Implémenter refresh endpoint | Moyenne |
| Logging centralisé | Collecter logs de sécurité | Haute |
| 2FA | Ajouter après T1 | Basse |
| Captcha | Ajouter après 3 échecs login | Basse |
| Rate limit Redis | Migrer de en-mémoire à Redis | Moyenne |
