# JobAggregator

Plateforme d'agrégation d'offres d'emploi — projet Epitech B-YEP-200.

## Stack

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript 5 strict
- **UI** : Tailwind CSS + shadcn/ui + Radix UI, palette pastel personnalisée
- **État** : Zustand (slices auth / jobs / admin)
- **Data fetching** : TanStack Query v5
- **Forms** : React Hook Form + Zod
- **Graphiques** : Recharts
- **HTTP** : Axios avec intercepteurs JWT + refresh token
- **Base de données** : PostgreSQL 16
- **Conteneurisation** : Docker multi-stage + docker-compose

---

## Installation locale

### Prérequis

- Node.js >= 20
- npm >= 10

### Démarrage

```bash
# 1. Cloner le dépôt
git clone <repo-url>
cd jobaggregator

# 2. Variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# 3. Installer les dépendances frontend
cd frontend
npm install

# 4. Lancer en développement
npm run dev
```

L'application est accessible sur http://localhost:3000.

---

## Scripts disponibles

```bash
# Dans /frontend
npm run dev        # Serveur de développement (hot reload)
npm run build      # Build de production
npm run start      # Serveur de production (après build)
npm run lint       # ESLint
npm run type-check # Vérification TypeScript strict
```

---

## Docker

### Développement avec docker-compose

```bash
# Depuis la racine du projet
cp .env.example .env
docker-compose up --build
```

Services démarrés :

| Service   | URL                   |
|-----------|-----------------------|
| Frontend  | http://localhost:3000 |
| Backend   | http://localhost:8080 |
| Postgres  | localhost:5432        |

### Build image frontend seul

```bash
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  -t jobaggregator-frontend .
docker run -p 3000:3000 jobaggregator-frontend
```

---

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base du backend | `http://localhost:8080/api` |
| `NEXT_PUBLIC_API_KEY` | Clé API optionnelle | _(vide)_ |
| `DATABASE_URL` | URL PostgreSQL | `postgresql://postgres:postgres@localhost:5432/jobaggregator` |
| `JWT_SECRET` | Secret JWT access token | _(à définir)_ |
| `JWT_REFRESH_SECRET` | Secret JWT refresh token | _(à définir)_ |
| `POSTGRES_PASSWORD` | Mot de passe Postgres | `postgres` |

---

## Architecture frontend

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Login, Register
│   ├── (dashboard)/      # Dashboard, Jobs
│   └── (admin)/          # Interface admin
├── components/
│   ├── ui/               # Button, Input, Card, Badge, Dialog, Select, Tabs
│   ├── layout/           # Header, Footer, Sidebar, DashboardLayout
│   ├── jobs/             # JobCard, JobList, JobFilters, JobSearchBar
│   ├── dashboard/        # StatsCard, RecentJobs
│   ├── data-feature/     # SalaryDistribution, JobTrends
│   ├── ai-feature/       # JobRecommendations, SimilarJobs
│   ├── admin/            # UserTable, OfferModeration
│   └── common/           # LoadingSpinner, EmptyState, Pagination
├── features/             # Logique métier isolée
│   ├── auth/             # store Zustand, useAuth, schemas Zod
│   ├── jobs/             # store Zustand, useJobs, formatters
│   ├── admin/            # useAdminUsers, useAdminOffers
│   ├── data-feature/     # useJobAnalytics
│   └── ai-feature/       # useJobRecommendations
└── lib/
    ├── api/              # axios.config, endpoints, interceptors
    ├── utils/            # cn()
    └── constants/        # routes, config
```

---

## Fonctionnalités

### Authentification
- Inscription / Connexion avec validation temps réel (Zod)
- JWT + refresh token automatique
- Protection des routes (user / admin)
- Jauge de force du mot de passe

### Dashboard utilisateur
- Statistiques du marché en temps réel
- Feature DATA : distribution des salaires (Recharts) + tendances mensuelles
- Feature IA : recommandations personnalisées avec score de match + skill gaps
- Recherche rapide intégrée

### Offres d'emploi
- Recherche full-text + localisation
- Filtres avancés : contrat, expérience, remote, salaire, date
- Pagination intelligente
- Page détail complète (description, prérequis, avantages, CTA postuler)

### Interface Admin
- Dashboard avec statistiques plateforme
- CRUD utilisateurs (suspension, suppression avec confirmation)
- Modération offres (approuver / rejeter, gestion signalements)

---

## Accessibilité — WCAG 2.1 AA

- `lang="fr"` sur `<html>`
- Skip link "Aller au contenu principal"
- `aria-live` sur les zones dynamiques
- `aria-current="page"` sur la navigation
- `aria-pressed` sur les filtres toggle
- `role="progressbar"` sur la jauge de profil
- `role="search"` sur la barre de recherche
- Focus visible sur tous les éléments interactifs
- Labels explicites sur tous les champs de formulaire
- `aria-label` sur les icônes et boutons icon-only

---

## Auteur

Projet réalisé dans le cadre du cursus Epitech — B-YEP-200.