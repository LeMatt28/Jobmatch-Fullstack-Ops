from datetime import datetime

def normalize_job(raw: dict) -> dict:
    # Bug 1 : c'est "companyName" pas "name"
    company = raw.get("smallCompany", {}).get("companyName", "")

    # Bug 2 : les skills sont dans une liste d'objets, faut extraire juste le nom
    skills = [s["name"] for s in raw.get("skillsList", [])]

    # Bug 3 : le salaire est dans details.salary.min pas details.salaryMin
    # ET il faut multiplier par 1000
    salary = raw.get("details", {}).get("salary", {})
    salary_min = salary.get("min") * 1000 if salary.get("min") else None
    salary_max = salary.get("max") * 1000 if salary.get("max") else None

    # Bug 4 : le timestamp est en microsecondes, faut diviser par 1_000_000
    ts = raw.get("publishDate")
    published_at = datetime.fromtimestamp(ts / 1_000_000).isoformat() if ts else None

    return {
        "external_id":   raw.get("id"),
        "title":         raw.get("title", "").strip(),
        "company":       company,
        "location":      raw.get("formattedPlaces", [None])[0],
        "contract_type": raw.get("contractTypes", [None])[0],
        "description":   raw.get("descriptionPreview", ""),
        "skills":        skills,
        "published_at":  published_at,
        "salary_min":    salary_min,
        "salary_max":    salary_max,
    }