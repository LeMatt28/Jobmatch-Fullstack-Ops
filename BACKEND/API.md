# Contrat API — Job Aggregator

> Base URL : `http://localhost:3001`
> Auth : header `Authorization: Bearer <token>` sur les routes protégées

---

## Auth

### `POST /auth/register`
Créer un compte.

**Body**
```json
{
  "email": "user@example.com",
  "password": "motdepasse",
  "name": "Alice"
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 201 | `{ "message": "Utilisateur créé avec succès.", "UserId": 1 }` |
| 400 | `{ "message": "Champs manquants" }` |
| 409 | `{ "message": "Email déjà utilisé." }` |
| 500 | `{ "message": "Erreur serveur" }` |

---

### `POST /auth/login`
Se connecter.

**Body**
```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

**Réponses**
| Code | Description |
|------|-------------|
| 200 | `{ "token": "<jwt>" }` |
| 400 | `{ "message": "Champs manquants" }` |
| 401 | `{ "message": "Mot de passe incorrect" }` |
| 404 | `{ "message": "Utilisateur introuvable" }` |
| 500 | `{ "message": "Erreur serveur" }` |

---

## Offres

### `GET /offers`
Liste des offres avec filtres et pagination.

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page (défaut: 1) |
| `limit` | number | Résultats par page (défaut: 20) |
| `location` | string | Filtrer par ville |
| `contractType` | string | CDI / CDD / STAGE / ALTERNANCE / FREELANCE |
| `tags` | string | Tags séparés par virgule |
| `salaryMin` | number | Salaire minimum |
| `salaryMax` | number | Salaire maximum |

**Réponse 200**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Développeur Node.js",
      "company": "TechCorp",
      "location": "Paris",
      "contractType": "CDI",
      "salaryMin": 40000,
      "salaryMax": 55000,
      "tags": ["node", "typescript"],
      "publishedAt": "2026-04-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

### `GET /offers/:id`
Détail d'une offre.

**Réponse 200**
```json
{
  "id": 1,
  "title": "Développeur Node.js",
  "company": "TechCorp",
  "location": "Paris",
  "contractType": "CDI",
  "description": "...",
  "salaryMin": 40000,
  "salaryMax": 55000,
  "tags": ["node", "typescript"],
  "publishedAt": "2026-04-01T00:00:00Z",
  "isActive": true
}
```

| Code | Description |
|------|-------------|
| 200 | Offre trouvée |
| 404 | `{ "message": "Offre introuvable" }` |

---

### `POST /offers` 🔒 Admin
Créer une offre manuellement.

**Body**
```json
{
  "title": "Développeur Node.js",
  "company": "TechCorp",
  "location": "Paris",
  "contractType": "CDI",
  "description": "...",
  "salaryMin": 40000,
  "salaryMax": 55000,
  "tags": ["node", "typescript"],
  "sourceId": "wld-123",
  "publishedAt": "2026-04-01T00:00:00Z"
}
```

| Code | Description |
|------|-------------|
| 201 | Offre créée |
| 400 | Champs manquants |
| 403 | Accès refusé |

---

### `PUT /offers/:id` 🔒 Admin
Modifier une offre.

**Body** : mêmes champs que POST (partiels acceptés)

| Code | Description |
|------|-------------|
| 200 | Offre mise à jour |
| 404 | Offre introuvable |
| 403 | Accès refusé |

---

### `DELETE /offers/:id` 🔒 Admin
Supprimer une offre.

| Code | Description |
|------|-------------|
| 200 | `{ "message": "Offre supprimée" }` |
| 404 | Offre introuvable |
| 403 | Accès refusé |

---

## Profil utilisateur

### `GET /me` 🔒 User
Récupérer son profil.

**Réponse 200**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Alice",
  "role": "USER",
  "createdAt": "2026-04-01T00:00:00Z"
}
```

---

### `PUT /me` 🔒 User
Modifier son profil.

**Body**
```json
{
  "name": "Alice Dupont",
  "password": "nouveaumotdepasse"
}
```

| Code | Description |
|------|-------------|
| 200 | Profil mis à jour |
| 400 | Champs invalides |

---

### `GET /me/saved-offers` 🔒 User
Lister ses offres sauvegardées.

**Réponse 200**
```json
{
  "data": [
    {
      "id": 1,
      "offer": { "id": 1, "title": "...", "company": "..." },
      "createdAt": "2026-04-01T00:00:00Z"
    }
  ]
}
```

---

### `POST /me/saved-offers/:id` 🔒 User
Sauvegarder une offre.

| Code | Description |
|------|-------------|
| 201 | `{ "message": "Offre sauvegardée" }` |
| 409 | `{ "message": "Déjà sauvegardée" }` |
| 404 | Offre introuvable |

---

### `DELETE /me/saved-offers/:id` 🔒 User
Supprimer une offre sauvegardée.

| Code | Description |
|------|-------------|
| 200 | `{ "message": "Offre retirée" }` |
| 404 | Non trouvée |

---

## Admin — Utilisateurs

### `GET /users` 🔒 Admin
Liste tous les utilisateurs.

**Réponse 200**
```json
{
  "data": [
    { "id": 1, "email": "user@example.com", "name": "Alice", "role": "USER" }
  ]
}
```

---

### `PUT /users/:id/role` 🔒 Admin
Changer le rôle d'un utilisateur.

**Body**
```json
{ "role": "ADMIN" }
```

| Code | Description |
|------|-------------|
| 200 | Rôle mis à jour |
| 404 | Utilisateur introuvable |

---

### `DELETE /users/:id` 🔒 Admin
Supprimer un utilisateur.

| Code | Description |
|------|-------------|
| 200 | `{ "message": "Utilisateur supprimé" }` |
| 404 | Introuvable |

---

## Stats / Data

### `GET /stats/contracts`
Répartition des types de contrats.

**Réponse 200**
```json
[
  { "contractType": "CDI", "count": 120 },
  { "contractType": "STAGE", "count": 45 }
]
```

---

### `GET /stats/salaries`
Distribution des salaires par tranche.

**Réponse 200**
```json
[
  { "range": "0-30k", "count": 20 },
  { "range": "30k-50k", "count": 80 }
]
```

---

### `GET /stats/cities`
Volume d'offres par ville.

**Réponse 200**
```json
[
  { "location": "Paris", "count": 200 },
  { "location": "Lyon", "count": 50 }
]
```

---

### `GET /stats/volume`
Évolution du nombre d'offres dans le temps.

**Réponse 200**
```json
[
  { "date": "2026-04-01", "count": 30 },
  { "date": "2026-04-02", "count": 45 }
]
```

---

## AI / Tags

### `GET /offers/:id/tags`
Tags extraits par l'IA pour une offre.

**Réponse 200**
```json
{ "tags": ["node", "typescript", "api", "rest"] }
```

---

### `GET /tags`
Tous les tags existants.

**Réponse 200**
```json
{ "tags": ["node", "react", "python", "docker"] }
```

---

## Ingestion

### `POST /admin/ingest` 🔒 Admin
Déclenche manuellement la collecte WeLoveDevs.

**Réponse 200**
```json
{
  "message": "Ingestion terminée",
  "inserted": 42,
  "skipped": 8
}
```

| Code | Description |
|------|-------------|
| 200 | Succès |
| 403 | Accès refusé |
| 500 | Erreur durant l'ingestion |

---

> 🔒 = route protégée par `verifyToken`
> 🔒 Admin = protégée par `verifyToken` + `verifyAdmin`