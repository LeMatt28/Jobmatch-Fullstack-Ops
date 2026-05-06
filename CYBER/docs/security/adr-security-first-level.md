# ADR – Sécurité premier niveau (menaces critiques)

| **Date** | 2026-04-23 |
| **Statut** | Accepté |
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
L’injection SQL est la menace n°1 des applications web (OWASP Top 10).  
Notre application manipule des données utilisateur sensibles. Une concaténation SQL accidentelle rendrait la base entière exfiltrée ou détruite.

### How (Comment)
- **Contrôle choisi** : Requêtes paramétrées obligatoires (via ORM TypeORM / SQLAlchemy)
- **Interdiction formelle** : Toute concaténation de chaînes SQL est bloquée en revue de code
- **Vérification automatique** : Linter (ESLint / Ruff) avec règle personnalisée

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Élimination quasi totale des SQLi | Courbe d’apprentissage ORM pour les juniors |
| Requêtes plus lisibles/maintenables | Certaines requêtes complexes moins optimales (jointures) |
| Pas de WAF nécessaire en 1ère ligne | Impossible d’utiliser du SQL dynamique (ex. ORDER BY variable) → accepté, on utilise une whitelist |

---

## T02 – Brute-force sur l’authentification

### Why (Pourquoi)
L’endpoint `/login` est exposé publiquement. Sans protection, 1000 tentatives/seconde suffisent à casser la plupart des mots de passe faibles en quelques minutes.

### How (Comment)
- **Contrôle choisi** : Rate limiting distribué (Redis + 5 tentatives / 15 min)
- **Mesures complémentaires** : Délai progressif (2s → 15s), Captcha après 3 échecs
- **MFA obligatoire** pour tout compte admin

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Bloque les attaques automatisées | Nécessite Redis → complexité infra supplémentaire |
| Délai progressif dissuade le bruteforce | UX dégradée après 3 échecs (attente + captcha) |
| MFA = sécurité renforcée | Friction utilisateur (perte de temps à l’inscription) |

> **Accepté** : Pour les comptes admin, la sécurité prime sur l’UX. Pour les utilisateurs standards, MFA reste optionnel.

---

## T03 – Exposition de secrets

### Why (Pourquoi)
Un secret dans le code (clé API, mot de passe DB, JWT secret) = compromission totale. C’est l’erreur la plus fréquente et la plus silencieuse.

### How (Comment)
- **Contrôle choisi** : Fichier `.env` + scan automatique pré-commit (`truffleHog`)
- **Stockage critique** : HashiCorp Vault pour secrets de production (DB password, JWT secret)
- **Rotation** : JWT secret changé tous les 30 jours (automatisé)

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Aucun secret dans l’historique git | Tous les devs doivent configurer leur `.env` localement |
| Vault = traçabilité (qui a accédé à quoi) | Coût d’apprentissage + maintenance d’un Vault |
| Scan pré-commit = détection immédiate | Ralentissement du commit (~1s) → acceptable |

> **Accepté** : On ne fait pas confiance aux humains. Le scan automatique est obligatoire, pas optionnel.

---

## T04 – Vol de token JWT

### Why (Pourquoi)
Un JWT volé donne un accès complet et souvent long à l’utilisateur. Le stockage dans `localStorage` est vulnérable au XSS. L’absence de `jti` empêche la révocation.

### How (Comment)
- **Contrôle choisi** : Cookie `HttpOnly; Secure; SameSite=Strict`
- **Durées** : Access token = 15 min, Refresh token = 7 jours (révocable via base)
- **Signature** : RS256 (asymétrique) pour éviter que le front puisse signer des tokens

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Cookie HttpOnly = immunité XSS pour le token | Impossible d’accéder au token côté JS → logout côté client plus technique |
| Refresh token révocable = vraie déconnexion | Nécessite une table `refresh_tokens` en base |
| RS256 = plus sûr | Plus lent (vérification asymétrique) → acceptable pour une API interne |

> **Accepté** : On perd la facilité de manipuler le token dans le front, on gagne en sécurité critique.

---

## T05 – Accès non autorisé aux routes admin

### Why (Pourquoi)
Les routes admin sont la cible n°1 après l’auth. Un utilisateur standard qui devine `/admin/users/delete/1` peut causer des dégâts disproportionnés.

### How (Comment)
- **Contrôle choisi** : Middleware RBAC unique et obligatoire sur **toutes** les routes `/admin/*`
- **Double vérification** : Vérification du rôle dans le middleware **ET** dans la fonction métier
- **Tests systématiques** : Un test qui vérifie qu’un rôle `user` obtient HTTP 403

### What (Trade-off)
| Gagné | Perdu / Accepté |
|-------|----------------|
| Défense en profondeur (2 vérifications) | Code légèrement plus verbeux (mais factorisable) |
| Impossible d’oublier la protection sur une route | Risque de duplication de logique (maintenable via décorateur/middleware) |
| Tests automatisés = non-régression | Temps d’écriture des tests supplémentaire (~15% sur routes admin) |

> **Accepté** : La redondance est voulue. Un oubli unique est trop dangereux.

---

## Récapitulatif des trade-offs assumés

| Menace | Compromis principal | Acceptabilité |
|--------|---------------------|---------------|
| T01 SQLi | Plus de SQL dynamique → whitelist manuelle | Élevée |
| T02 Brute-force | Redis + captcha = friction | Moyenne (admin : élevée) |
| T03 Secrets | Vault = complexité | Élevée (sécurité critique) |
| T04 Vol JWT | Pas d’accès JS au token | Élevée |
| T05 Admin | Double vérification + tests | Élevée |

---

## Mise à jour – Décisions actées avec le back (2026-04-27)

| Sujet | Décision |
|-------|----------|
| Type d'auth | JWT + refresh token révocable |
| Access token | 15 minutes |
| Refresh token | 7 jours |
| Stockage | Cookie HttpOnly |
| Middlewares | auth, role (admin), rate limit |

### Mise à jour – Audit bcrypt (2026-04-29)

| Constat | Statut |
|---------|--------|
| Salt factor = 10 | ✅ Conforme |
| bcrypt.compare utilisé | ✅ Conforme |
| Messages d'erreur login | ❌ Non conforme – correction demandée |
| Stockage JWT | ❌ Non conforme – passage en cookie HttpOnly |
| Durée JWT | ❌ Non conforme – 15 min au lieu de 7j |