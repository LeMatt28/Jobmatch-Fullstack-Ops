# Décision d'architecture – Authentification

| **Date** | 2026-04-27 |
| **Statut** | ✅ Validé (Back + Cyber) |
| **Participants** | Back Lead, Cyber Lead |

---

## Décisions actées

### 1. Type d'authentification
**Choix** : JWT (stateless) + refresh token révocable

**Justification** :
- Scalable sans stockage session côté serveur
- La révocation reste possible via blacklist du refresh token

**Trade-off** : Un peu plus complexe que du session classique, mais nécessaire pour la scalabilité.

---

### 2. Durée des tokens

| Token | Durée | Justification |
|-------|-------|----------------|
| Access token | **15 minutes** | Limite la fenêtre d'exploitation en cas de vol |
| Refresh token | **7 jours** | Bon compromis entre UX et sécurité (pas de reconnexion trop fréquente) |

---

### 3. Stockage du token côté client

**Choix** : Cookie `HttpOnly; Secure; SameSite=Strict`

**Justification** :
- Immunise contre le vol via XSS
- Impossible d'accéder au token depuis JavaScript

**Trade-off** : Logout côté client plus technique (nécessite appel API pour supprimer le cookie). Accepté.

---

### 4. Middlewares à implémenter (semaine 1)

| Middleware | Route concernée | Responsable |
|------------|----------------|-------------|
| `authMiddleware()` | Toutes les routes protégées | Back |
| `roleMiddleware(['admin'])` | `/admin/*` | Back |
| `rateLimitMiddleware()` | `/login`, `/refresh` | Back |

---

## Actions immédiates

| Action | Qui | Deadline |
|--------|-----|----------|
| Coder `authMiddleware()` | Back | J+2 |
| Coder `roleMiddleware()` | Back | J+2 |
| Coder `rateLimitMiddleware()` | Back | J+3 |
| Brancher les middlewares sur les routes | Back | J+4 |
| Fournir les exemples de code (snippets) | Cyber | J+1 |
| Tester que `/admin/*` est inaccessible sans role admin | Cyber + Back | J+5 |

---