# Database — Documentation du schéma Prisma

## Stack
- **PostgreSQL** (via Docker)
- **Prisma ORM** v5
- **Provider** : `postgresql`
- **URL** : définie dans `.env` → `DATABASE_URL`

---

## Enums

### `Role`
Définit le rôle d'un utilisateur.

| Valeur | Description |
|--------|-------------|
| `USER` | Utilisateur standard (défaut) |
| `ADMIN` | Administrateur |

### `ContractType`
Type de contrat d'une offre d'emploi.

| Valeur |
|--------|
| `CDI` |
| `CDD` |
| `STAGE` |
| `ALTERNANCE` |
| `FREELANCE` |

---

## Tables

### `User`
Représente un utilisateur inscrit sur la plateforme.

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | `Int` | PK, auto-incrémenté | Clé primaire |
| `email` | `String` | UNIQUE | Email de connexion |
| `password` | `String` | — | Mot de passe hashé (bcrypt) |
| `name` | `String` | — | Nom affiché |
| `role` | `Role` | défaut: `USER` | Rôle de l'utilisateur |
| `createdAt` | `DateTime` | défaut: `now()` | Date de création |
| `updatedAt` | `DateTime` | auto-maj | Date de dernière modification |

**Choix :**
- `email` est `@unique` → pas deux comptes avec le même email
- `password` stocké hashé → jamais en clair
- `role` avec enum → extensible sans migration lourde

---

### `Offer`
Représente une offre d'emploi agrégée depuis une source externe.

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | `Int` | PK, auto-incrémenté | Clé primaire |
| `title` | `String` | — | Titre du poste |
| `company` | `String` | — | Nom de l'entreprise |
| `location` | `String` | — | Localisation |
| `contractType` | `ContractType` | — | Type de contrat |
| `description` | `String` | — | Description du poste |
| `salaryMin` | `Int?` | nullable | Salaire minimum |
| `salaryMax` | `Int?` | nullable | Salaire maximum |
| `tags` | `String[]` | tableau | Tags / compétences |
| `sourceId` | `String` | UNIQUE | ID de la source externe |
| `publishedAt` | `DateTime` | — | Date de publication |
| `isActive` | `Boolean` | défaut: `true` | Offre active ou non |
| `createdAt` | `DateTime` | défaut: `now()` | Date d'import |

**Choix :**
- `sourceId` est `@unique` → évite les doublons lors de l'agrégation
- `salaryMin/Max` nullable → toutes les offres n'affichent pas le salaire
- `tags` en tableau natif PostgreSQL → requêtes filtrables sans table pivot
- `isActive` → désactiver une offre sans la supprimer

---

### `SavedOffer`
Table de jointure entre `User` et `Offer` (relation many-to-many).

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| `id` | `Int` | PK, auto-incrémenté | Clé primaire |
| `userId` | `Int` | FK → `User.id` | Clé étrangère vers User |
| `offerId` | `Int` | FK → `Offer.id` | Clé étrangère vers Offer |
| `createdAt` | `DateTime` | défaut: `now()` | Date de sauvegarde |

**Contraintes :**
- `@@unique([userId, offerId])` → un user ne peut pas sauvegarder la même offre deux fois
- `onDelete: Cascade` → si le user ou l'offre est supprimé, la sauvegarde est supprimée automatiquement

---

## Relations

```
User  1 ──── N  SavedOffer  N ──── 1  Offer
```

- Un `User` peut sauvegarder plusieurs `Offer` via `SavedOffer`
- Une `Offer` peut être sauvegardée par plusieurs `User` via `SavedOffer`
- `SavedOffer` est la table pivot avec ses propres métadonnées (`createdAt`)

---

## Clés primaires / étrangères

| Table | PK | FK |
|-------|----|----|
| `User` | `id` | — |
| `Offer` | `id` | — |
| `SavedOffer` | `id` | `userId` → `User.id`, `offerId` → `Offer.id` |

---

## Commandes utiles

```bash
npx prisma migrate dev      # applique les migrations
npx prisma generate         # régénère le client
npx prisma studio           # interface visuelle de la DB
```