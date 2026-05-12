# ADR 001 — Choix du modèle AI

## Contexte
Contraintes imposées par le sujet :
- Modèle < 500MB sur disque
- Résultat en < 5 secondes par offre
- Pas de fine-tuning au démarrage du container
- Aucune API externe non contrôlée

## Décision
scikit-learn TF-IDF (~5MB) pour la détection de doublons

## Pourquoi
L'API WeLoveDevs retourne déjà des champs structurés
(skillsList, contractTypes, formattedPlaces), donc
l'extraction d'entités via spaCy apporte peu de valeur.
Le vrai problème est la déduplication des offres similaires
postées plusieurs fois, que TF-IDF résout efficacement.

## Comment
pip install scikit-learn
Vectorisation TF-IDF sur title + description
Similarité cosinus entre offres > 0.85 = doublon

## Trade-off
Moins précis que sentence-transformers pour la
recommandation sémantique, mais 16x plus léger (5MB vs 80MB)
et suffisant pour la déduplication.

## Alternatives rejetées
- sentence-transformers (80MB) : trop lourd, overkill
- spaCy (15MB) : moins utile car données déjà structurées
- OpenAI API : interdite par le sujet