# Analyse des menaces – Premier niveau (avant développement)

> **Périmètre** : Application web avec authentification, API, interface admin.  
> **Objectif** : Documenter les menaces critiques identifiées en amont du code, et les contrôles techniques associés.
> **Statut** : À implémenter avant toute mise en production.

---

## 1. Menaces principales

| ID | Menace | Vecteur d’attaque typique | Impact |
|----|--------|---------------------------|--------|
| **T01** | Injection SQL | Champs formulaire, paramètres URL, en-têtes HTTP | Lecture / modification / suppression de toute la base |
| **T02** | Brute-force sur l’authentification | Endpoint `/login`, `/auth` | Prise de contrôle de compte par force brute |
| **T03** | Exposition de secrets | Code source, logs, variables d’env non protégées | Compromission complète du système (DB, API externes, JWT) |
| **T04** | Vol de token JWT | Stockage localStorage, session hijacking, fuite logs | Usurpation d’identité, accès persistant |
| **T05** | Accès non autorisé aux routes admin | Manipulation de rôles, endpoints cachés, IDOR | Exfiltration de données sensibles, contournement des privilèges |

---

## 2. Contrôles obligatoires (implémentation systématique)

### T01 – Injection SQL

| Contrôle | Implémentation |
|----------|----------------|
| Requêtes paramétrées / ORM | Aucune concaténation de chaînes SQL. Utiliser Prisma, TypeORM, SQLAlchemy, ou `?` / `$1` en SQL brut |
| Validation stricte des entrées | Type, longueur, format (ex. email, UUID) avant toute requête |
| Principe du moindre privilège | Compte BDD avec uniquement `SELECT, INSERT, UPDATE, DELETE` sur les tables nécessaires |
| WAF (optionnel mais recommandé) | Règle générique SQLi pour couche défensive supplémentaire |

### T02 – Brute-force sur l’authentification

| Contrôle | Implémentation |
|----------|----------------|
| Rate limiting | Maximum 5 tentatives / 15 minutes par IP + par utilisateur |
| Délai progressif | +2 secondes après chaque échec (jusqu’à 15s) |
| Captcha | Déclenché après 3 échecs consécutifs |
| MFA obligatoire | Tous les comptes admin + utilisateurs à risque |
| Alerte | Log des tentatives échouées + webhook Discord/Slack après 10 échecs |

### T03 – Exposition de secrets

| Contrôle | Implémentation |
|----------|----------------|
| Fichier `.env` | Jamais versionné. `.env` dans `.gitignore`. Exemple : `.env.example` |
| Vault / Secrets Manager | HashiCorp Vault, AWS Secrets Manager, ou Doppler pour les secrets critiques |
| Scan pré-commit | `truffleHog`, `gitleaks`, ou hook git détectant les secrets |
| Rotation automatique | JWT secret, DB password : rotation tous les 30 jours |
| Interdiction formelle | Pas de secret dans : code, logs, variables d’env exposées (frontend) |

### T04 – Vol de token JWT

| Contrôle | Implémentation |
|----------|----------------|
| Stockage sécurisé | Cookie `HttpOnly`, `Secure`, `SameSite=Strict`. **Interdire `localStorage` ou `sessionStorage`** |
| Courte durée de vie | Access token : 15 minutes max. Refresh token : 7 jours (révocable) |
| Signature forte | `RS256` (préféré) ou `HS256` avec secret ≥ 64 caractères aléatoires |
| Référence unique | `jti` (JWT ID) stocké en base pour blacklist en cas de logout |
| Renouvellement silencieux | Refresh token via endpoint `/refresh` sans réauthentification complète |

### T05 – Accès non autorisé aux routes admin

| Contrôle | Implémentation |
|----------|----------------|
| RBAC (Role-Based Access Control) | Middleware unique vérifiant `role === 'admin'` avant toute logique métier |
| Double vérification | Route **ET** fonction métier : ne pas se fier uniquement au routage |
| Routes admin isolées | Si possible : sous-domaine `admin.exemple.com` ou réseau interne |
| Tests automatisés | Tests unitaires / intégration vérifiant qu’un utilisateur `user` obtient HTTP 403 |
| Audit logs | Chaque accès admin logué avec `user_id`, `action`, `timestamp`, `IP` |

---

## 3. Ordre d’implémentation (strict)

| Ordre | Menace | Justification |
|-------|--------|----------------|
| 1 | **T03 – Exposition de secrets** | Sans ça, tout le reste peut être contourné (clé DB, JWT secret) |
| 2 | **T01 – Injection SQL** | Base de données = cœur des données. Prévenir avant même d’écrire une requête |
| 3 | **T02 – Brute-force** | Porte d’entrée principale. Un rate limiting s’écrit en 10 lignes |
| 4 | **T05 – Accès admin** | À écrire avant la première route admin elle-même |
| 5 | **T04 – Vol JWT** | Dépend de l’auth ; paramétrage final avant mise en ligne |

---

## 4. Traçabilité (obligatoire dans le code)

Chaque contrôle implémenté devra contenir un commentaire référençant la menace correspondante.

**Exemple :**
```python
# [T01] Injection SQL : requête paramétrée
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

| ID | Menace | Contrôle principal | État |
|----|--------|-------------------|------|
| T01 | Injection SQL | Requêtes paramétrées | À implémenter |
| T02 | Brute-force auth | Rate limiting + Captcha | ⚠️ En cours (message générique fait ✅) |
| T03 | Exposition secrets | .env + Vault | À implémenter |
| T04 | Vol JWT | Cookie Secure + durée 15 min | ✅ **FAIT** (corrigé par cyber) |
| T05 | Accès admin non autorisé | RBAC middleware | À implémenter |