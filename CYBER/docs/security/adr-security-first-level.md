# ADR – Sécurité premier niveau (menaces critiques)

| **Date** | 2026-04-29 |
| **Statut** | ✅ Accepté et partiellement implémenté |
| **Décideurs** | Équipe Cyber, Dev Lead |
| **Portée** | Authentification, API, routes admin |

---

## Contexte global

Avant toute ligne de code, 5 menaces principales ont été identifiées.  
Le présent ADR documente pour chacune : le contrôle retenu, la justification du choix, et les trade-offs acceptés.

Format : **Why / How / What** par menace.

---

## T01 – Injection SQL

### Why (Pourquoi)
L'injection SQL est la menace n°1 des applications web (OWASP Top 10).  
Notre application manipule des données utilisateur sensibles. Une concaténation SQL accidentelle rendrait la base entière exfiltrée ou détruite.

### How (Comment)
- **Contrôle choisi** : Requêtes paramétrées obligatoires via Prisma ORM
- **Interdiction formelle** : Pas de `prisma.$queryRaw` ou concaténation SQL
- **Vérification** : Audit statique du code

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Élimination quasi totale des SQLi | Courbe d'apprentissage ORM |
| Requêtes lisibles/maintenables | Requêtes complexes parfois moins optimales |

**Statut implémentation** : ✅ FAIT (Prisma ORM utilisé partout)

---

## T02 – Brute-force sur l'authentification

### Why (Pourquoi)
L'endpoint `/login` est exposé publiquement. Sans protection, des tentatives massives peuvent casser des mots de passe faibles.

### How (Comment)
- **Contrôle choisi** : Rate limiting (10/login, 5/register) par IP
- **Validation entrées** : `express-validator` (email valide, password ≥ 8)
- **Message unique** : "Identifiants invalides" (pas de distinction email/mot de passe)

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Bloque les attaques automatisées | Nécessite stockage en mémoire (Redis recommandé en prod) |
| Pas de fuite d'information | UX légèrement dégradée (message moins précis) |

**Statut implémentation** : ✅ FAIT

---

## T03 – Exposition de secrets

### Why (Pourquoi)
Un secret dans le code (clé API, JWT secret) = compromission totale. C'est l'erreur la plus fréquente.

### How (Comment)
- **Contrôle choisi** : Fichier `.env` + vérification au runtime
- **Vérification** : `if (!process.env.JWT_SECRET)` avant utilisation

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Aucun secret dans l'historique git | Chaque dev doit configurer son `.env` localement |
| Détection d'absence de secret | Erreur explicite au lieu d'échec silencieux |

**Statut implémentation** : ✅ FAIT

---

## T04 – Vol de token JWT

### Why (Pourquoi)
Un JWT volé donne un accès complet. Le stockage dans `localStorage` est vulnérable au XSS.

### How (Comment)
- **Contrôle choisi** : Cookie `HttpOnly; Secure; SameSite=Strict`
- **Durée** : 15 minutes (court pour limiter la fenêtre d'exploitation)
- **Token hors body** : Plus renvoyé dans la réponse JSON

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Cookie HttpOnly = immunité XSS | Logout nécessite appel API pour supprimer cookie |
| Durée courte = sécurité renforcée | Utilisateur doit se reconnecter plus souvent (refresh token à prévoir) |

**Statut implémentation** : ✅ FAIT

---

## T05 – Accès non autorisé aux routes admin

### Why (Pourquoi)
Les routes admin sont la cible prioritaire après l'auth. Un utilisateur standard qui devine une route peut causer des dégâts.

### How (Comment)
- **Contrôle choisi** : Middleware RBAC (à implémenter)
- **Double vérification** : Middleware + fonction métier

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Défense en profondeur | Code plus verbeux |
| Impossible d'oublier une protection | Maintenance supplémentaire |

**Statut implémentation** : ⚠️ En cours

---

## État des implémentations (2026-04-29)

| Décision | Statut | Preuve |
|----------|--------|--------|
| JWT + refresh token | ✅ Implémenté (access token 15min) | `login.ts` |
| Access token 15 minutes | ✅ Implémenté | `expiresIn: "15m"` |
| Cookie HttpOnly | ✅ Implémenté | `httpOnly: true` |
| Rate limiting login (10/15min) | ✅ Implémenté | `max: 10` |
| Rate limiting register (5/15min) | ✅ Implémenté | `max: 5` |
| Validation entrées | ✅ Implémenté | `express-validator` |
| CORS restreint | ✅ Implémenté | `allowedOrigins` |
| IP whitelist /health | ✅ Implémenté | `allowedIPs` |

---

## Récapitulatif des trade-offs assumés

| Menace | Compromis principal | Acceptabilité |
|--------|---------------------|---------------|
| T01 SQLi | Plus de SQL dynamique | Élevée |
| T02 Brute-force | Rate limiting + message unique | Élevée |
| T03 Secrets | Vérification runtime | Élevée |
| T04 Vol JWT | Pas d'accès JS au token + durée courte | Élevée |
| T05 Admin | Redondance de vérification | Élevée |

---
