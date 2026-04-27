# Schéma de la base de données

## Tables

### User
Stocke les comptes utilisateurs.

| Champ | Type | Contrainte |
|-------|------|------------|
| id | Int | PK, autoincrement |
| email | String | NOT NULL, UNIQUE |
| password | String | NOT NULL |
| name | String | NOT NULL |
| role | Role | NOT NULL, défaut USER |
| createdAt | DateTime | NOT NULL, défaut now() |
| updatedAt | DateTime | NOT NULL, auto-updated |

### Offer
Stocke les offres d'emploi ingérées depuis WeLoveDevs.

| Champ | Type | Contrainte |
|-------|------|------------|
| id | Int | PK, autoincrement |
| title | String | NOT NULL |
| company | String | NOT NULL |
| location | String | NOT NULL |
| contractType | ContractType | NOT NULL |
| description | String | NOT NULL |
| salaryMin | Int | nullable |
| salaryMax | Int | nullable |
| tags | String[] | — |
| sourceId | String | NOT NULL, UNIQUE |
| publishedAt | DateTime | NOT NULL |
| isActive | Boolean | NOT NULL, défaut true |
| createdAt | DateTime | NOT NULL, défaut now() |

### SavedOffer
Table de jonction entre User et Offer (relation N—N).

| Champ | Type | Contrainte |
|-------|------|------------|
| id | Int | PK, autoincrement |
| userId | Int | FK → User.id, CASCADE |
| offerId | Int | FK → Offer.id, CASCADE |
| createdAt | DateTime | NOT NULL, défaut now() |

Contrainte : `UNIQUE(userId, offerId)` — un user ne peut pas sauvegarder deux fois la même offre.

---

## Relations

- **User 1—N SavedOffer** : un user peut sauvegarder plusieurs offres.
- **Offer 1—N SavedOffer** : une offre peut être sauvegardée par plusieurs users.
- **User N—N Offer** via `SavedOffer`.

---

## Enums

### Role
Contrôle l'accès aux fonctionnalités.

| Valeur | Usage |
|--------|-------|
| USER | Accès standard — navigation et favoris |
| ADMIN | Accès administration — modération et gestion |

### ContractType
Valeurs acceptées pour le type de contrat d'une offre.

| Valeur |
|--------|
| CDI |
| CDD |
| STAGE |
| ALTERNANCE |
| FREELANCE |

---

## Contraintes d'intégrité

- **Clés primaires** sur chaque table (`id`).
- **Clé étrangère** `SavedOffer.userId` → `User.id` avec `onDelete: Cascade`.
- **Clé étrangère** `SavedOffer.offerId` → `Offer.id` avec `onDelete: Cascade`.
- **UNIQUE** sur `User.email` — impossible d'avoir deux comptes avec le même email.
- **UNIQUE** sur `Offer.sourceId` — empêche d'ingérer deux fois la même offre WeLoveDevs.
- **UNIQUE** sur `(SavedOffer.userId, SavedOffer.offerId)` — pas de doublon de favoris.