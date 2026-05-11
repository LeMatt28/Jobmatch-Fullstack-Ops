# Justification Innovation — Data & AI Features

## Feature Data : Dashboard salaires / contrats / villes

### Problème utilisateur
Un développeur junior cherchant un emploi ne sait pas :
- Quelles villes offrent le plus d'opportunités
- Quels salaires sont réalistes pour son profil
- Quelle répartition CDI/stage/freelance existe sur le marché

### Hypothèse
Afficher un dashboard avec la répartition des types de contrats,
la distribution des salaires par ville, et le volume d'offres
par localisation aide l'utilisateur à cibler sa recherche
géographiquement et à calibrer ses attentes salariales.

### Pourquoi cette approche est pertinente
Les données nécessaires (location, salary, contractTypes) sont
disponibles directement depuis l'API WeLoveDevs sans traitement
complexe. C'est la feature avec le meilleur ratio valeur/effort.

### Mesure du succès
- Dashboard visible sur la page principale sans navigation supplémentaire
- Au moins 3 widgets : répartition contrats, distribution salaires, volume par ville
- Données issues de vraies offres ingérées (pas de données fictives)

---

## Feature AI : Détection de doublons (TF-IDF)

### Problème utilisateur
Un agrégateur qui collecte des offres depuis plusieurs sources
(ou plusieurs fois la même source) accumule des doublons.
L'utilisateur voit la même offre plusieurs fois, ce qui dégrade
l'expérience et fausse les statistiques du dashboard.

### Hypothèse
Calculer la similarité textuelle entre les offres via TF-IDF
sur le titre + description permet de détecter automatiquement
les doublons avant insertion en base, garantissant des données
propres sans intervention manuelle.

### Pourquoi cette approche est pertinente
- scikit-learn TF-IDF : ~5MB, bien sous la limite de 500MB
- Résultat en moins d'1 seconde par offre
- Aucune API externe, tourne entièrement en local
- Pas de fine-tuning nécessaire

### Mesure du succès
- 0 doublon détectable (similarité > 0.85) en base après ingestion
- Temps de traitement < 5 secondes par offre (exigence du sujet)

### Alternative rejetée
sentence-transformers all-MiniLM-L6-v2 (~80MB) : plus précis
pour la recommandation sémantique mais 16x plus lourd et
inutilement complexe pour de la déduplication simple.