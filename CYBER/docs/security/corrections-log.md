# Journal des corrections de sécurité

## 2026-05-08 – Implémentation sécurité avancée (IDOR + XSS + Brute Force + Injection)

**Auteur** : Dev Team  
**Fichiers modifiés/créés** : 
- `SecurityMiddleware.ts` (CRÉÉ)
- Tous les fichiers de routes (MODIFIÉS)
- `AuthMidlleware.ts`, `VerifyAdmin.ts`, `HandleError.ts` (AMÉLIORÉS)

**Nature des implémentations** :
- **Rate Limiting Avancé** : authLimiter (5/15min), registerLimiter (3/heure), generalLimiter (100/min)
- **Protection IDOR** : Vérification propriété sur PUT/PATCH/DELETE, validateIdParam middleware
- **Sanitization XSS** : sanitizeString + sanitizeRequestBody middleware
- **Validation Injection SQL** : Zod schemas strict + Prisma parameterized queries
- **CSRF Protection** : Content-Type validation
- **DDoS Lent** : requestTimeout 30s
- **Timing Attack Prevention** : Réponses identiques même si utilisateur n'existe pas
- **Interaction Verification** : Reviews uniquement sur utilisateurs matchés

**Détails par fichier** :
```
✓ SecurityMiddleware.ts – Middlewares centralisés (rate limit, sanitization, validation)
✓ login.ts – Timing attack protection + brute force
✓ registerCandidate.ts – Password strength validation (regex) + registerLimiter
✓ registerCompagny.ts – Password strength validation + registerLimiter
✓ OfferCrud.ts – IDOR ownership checks + input validation
✓ swipe.ts – ID validation + duplicate prevention
✓ matches.ts – IDOR on offer ownership verification
✓ Reviews.ts – Interaction verification (match required)
✓ compagnyCrud.ts – IDOR + field whitelisting
✓ me.ts – Profile protection + sanitization
✓ AuthMidlleware.ts – Enhanced JWT verification (Bearer format check)
✓ VerifyAdmin.ts – Privilege escalation prevention
✓ HandleError.ts – Generic error messages (no stack leaks)
✓ index.ts – Global security middleware stack
```

**Protections couvertes** :
- T01 (Injection SQL) : ✅ Zod + Prisma
- T02 (Brute Force) : ✅ authLimiter + timing attacks
- T03 (Secrets) : ✅ Inchangé, déjà fait
- T04 (Token theft) : ✅ Inchangé, déjà fait
- T05 (Unauthorized access) : ✅ RBAC + IDOR checks
- **PLUS**: XSS, CSRF, DDoS lent, ENUM, Fuite d'info

**Preuve** : Code validé, compile sans erreurs, serveur démarre avec logs de sécurité

**Statut** : ✅ Implémenté et testé

---

## 2026-04-29 – Correction login.js

**Auteur** : Cyber  
**Fichier corrigé** : `login.js`  
**Nature des corrections** :
- Message d'erreur unique pour éviter l'énumération des emails
- Token JWT déplacé du body JSON vers cookie HttpOnly
- Durée du token réduite de 7 jours à 15 minutes

**Preuve** : Le fichier corrigé a été remis à l'équipe back et intégré.

**Statut** : ✅ Validé

---

## Prochaines corrections prévues
- Implémenter refresh tokens (pour éviter reconnexion fréquente)
- Ajouter captcha après 3 échecs de login
- Centraliser les logs de sécurité
- Rotation JWT secret (tous les 30 jours)