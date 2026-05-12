# API Mapping — WeLoveDevs

## Informations générales
- URL de base : https://epi-api.welovedevs.com/v1
- Authentification : Header `X-API-Key`
- Rate limit : 1 requête/seconde/étudiant
- Pagination : paramètres `page` et `size`
- Les offres sont dans `data["values"]`

## Champs disponibles par offre

| Champ API                        | Champ en base   | Type       | Toujours présent ? |
|----------------------------------|-----------------|------------|--------------------|
| id                               | external_id     | string     | ✅ toujours        |
| title                            | title           | string     | ✅ toujours        |
| smallCompany.companyName         | company         | string     | ✅ toujours        |
| formattedPlaces[0]               | location        | string     | ⚠️ parfois null   |
| contractTypes[0]                 | contract_type   | string     | ✅ toujours        |
| descriptionPreview               | description     | string     | ✅ toujours        |
| skillsList[].name                | skills          | string[]   | ✅ toujours        |
| publishDate                      | published_at    | datetime   | ✅ toujours        |
| details.salary.min * 1000        | salary_min      | integer    | ❌ souvent absent  |
| details.salary.max * 1000        | salary_max      | integer    | ❌ souvent absent  |
| details.remotePolicy.frequency   | remote          | string     | ⚠️ parfois null   |

## Points importants pour la normalisation

- **Dates** : format timestamp en microsecondes (16 chiffres) → diviser par 1_000_000
- **Salaires** : valeur en milliers (45 = 45 000€/an) → multiplier par 1000
- **Skills** : liste d'objets `{name, value}` → extraire uniquement le `name`
- **Location** : tableau `formattedPlaces` → prendre l'index 0