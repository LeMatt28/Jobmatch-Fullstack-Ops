from datetime import datetime, timezone


CONTRACT_TYPE_MAPPING = {
    "cdi": "CDI",
    "permanent": "CDI",
    "permanent_contract": "CDI",
    "cdd": "CDD",
    "fixed_term": "CDD",
    "fixed-term": "CDD",
    "temporary": "CDD",
    "stage": "STAGE",
    "intern": "STAGE",
    "internship": "STAGE",
    "alternance": "ALTERNANCE",
    "apprenticeship": "ALTERNANCE",
    "work_study": "ALTERNANCE",
    "work-study": "ALTERNANCE",
    "freelance": "FREELANCE",
    "contractor": "FREELANCE",
}


def first_value(values):
    if values:
        return values[0]
    return None


def euros_from_thousands(value):
    if value is None:
        return None

    try:
        return int(float(value) * 1000)
    except (TypeError, ValueError):
        return None


def format_publish_date(timestamp):
    if not timestamp:
        return None
    return datetime.fromtimestamp(timestamp / 1_000_000, timezone.utc).isoformat()


def normalize_contract_type(contract_type):
    if not contract_type:
        return None

    value = str(contract_type).strip()
    if value.upper() in CONTRACT_TYPE_MAPPING.values():
        return value.upper()

    return CONTRACT_TYPE_MAPPING.get(value.lower())


def normalize_job(raw):
    details = raw.get("details") or {}
    salary = details.get("salary") or {}
    remote_policy = details.get("remotePolicy") or {}

    description = (
        raw.get("description")
        or raw.get("rawDescription")
        or raw.get("descriptionPreview")
        or ""
    )

    tags = []
    for skill in raw.get("skillsList", []):
        name = skill.get("name")
        if name:
            tags.append(name)

    return {
        "sourceId": str(raw.get("id") or "").strip(),
        "title": (raw.get("title") or "").strip(),
        "company": (raw.get("smallCompany") or {}).get("companyName") or "",
        "location": first_value(raw.get("formattedPlaces") or []),
        "contractType": normalize_contract_type(first_value(raw.get("contractTypes") or [])),
        "description": description,
        "salaryMin": euros_from_thousands(salary.get("min")),
        "salaryMax": euros_from_thousands(salary.get("max")),
        "tags": tags,
        "publishedAt": format_publish_date(raw.get("publishDate")),
        "remote": remote_policy.get("frequency"),
        "isActive": True,
    }
