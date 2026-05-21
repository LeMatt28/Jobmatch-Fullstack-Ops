"""
Text preparation layer: Prisma model dicts → strings optimized for embedding.

Candidate fields: skills, experience, softSkills, location, salaryExpected, isMobile
Offer fields:     title, description, stack, location, salaryMin, salaryMax, remote, contractType
"""
from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from typing import Optional

# WeLoveDevs remotePolicy.frequency → readable French (enriches semantic similarity)
REMOTE_LABEL: dict[str, str] = {
    "full":     "full remote télétravail total",
    "fulltime": "full remote télétravail total",   # WeLoveDevs variant
    "partial":  "télétravail partiel hybride",
    "hybrid":   "télétravail hybride",
    "never":    "présentiel bureau pas de télétravail",
}

# User remote preference → set of acceptable job remote values
REMOTE_COMPAT: dict[str, set[str] | None] = {
    "full_remote":   {"full", "fulltime"},
    "hybrid":        {"full", "fulltime", "partial", "hybrid"},
    "on_site":       None,         # None = accepts everything
    "no_preference": None,
    "":              None,
}


# ─── Helpers ──────────────────────────────────────────────────────────────────

class _HTMLStripper(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self._parts.append(data)

    def get_text(self) -> str:
        return " ".join(self._parts)


def strip_html(text: str) -> str:
    if not text or "<" not in text:
        return text or ""
    p = _HTMLStripper()
    p.feed(text)
    return re.sub(r"\s+", " ", p.get_text()).strip()


def _to_list(value) -> list[str]:
    """
    Safely coerce any Prisma array representation to a Python list of strings.
    Handles: Python list, JSON string '["a","b"]', comma-separated "a,b".
    """
    if not value:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if v]
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(v).strip() for v in parsed if v]
        except (json.JSONDecodeError, ValueError):
            pass
        return [s.strip() for s in value.split(",") if s.strip()]
    return []


def normalize_city(location: Optional[str]) -> str:
    """Extract comparable city name from 'City, Country' or 'City' format."""
    if not location:
        return ""
    return location.split(",")[0].strip().lower()


# ─── Candidate ────────────────────────────────────────────────────────────────

def build_candidate_texts(candidate: dict) -> dict:
    """
    Build embedding-ready text strings from a Prisma Candidate record.

    Returns a dict with:
        skills_text      → what the candidate knows  (for skills cosine axis)
        conditions_text  → what the candidate wants  (for conditions cosine axis)
        + raw scalar fields for boolean/penalty filters
    """
    skills     = _to_list(candidate.get("skills"))
    soft       = _to_list(candidate.get("softSkills"))
    location   = candidate.get("location") or ""
    exp_years  = int(candidate.get("experience") or 0)
    salary_exp = int(candidate.get("salaryExpected") or 0)
    is_mobile  = bool(candidate.get("isMobile") or False)

    # Remote preference: field may be called "remote", "remotePref", "remotePolicy"
    remote_raw = (
        candidate.get("remote")
        or candidate.get("remotePref")
        or candidate.get("remotePolicy")
        or "no_preference"
    )
    remote_pref = str(remote_raw).lower().replace(" ", "_")

    contracts = _to_list(
        candidate.get("contractTypes")
        or candidate.get("contract_types")
        or []
    )
    benefits = _to_list(
        candidate.get("desiredBenefits")
        or candidate.get("desired_benefits")
        or []
    )

    skills_text = " ".join(skills + soft)

    remote_label = REMOTE_LABEL.get(remote_pref.replace("_", ""), remote_pref)
    cond_parts = [
        f"contrat {' '.join(contracts)}" if contracts else "",
        remote_label,
        f"localisation {location}" if location else "",
        f"salaire minimum {salary_exp} euros" if salary_exp else "",
        f"expérience {exp_years} ans" if exp_years else "",
        " ".join(benefits),
    ]
    conditions_text = " ".join(p for p in cond_parts if p).strip()

    return {
        "skills_text":      skills_text,
        "conditions_text":  conditions_text,
        # raw scalars for penalty / boolean logic
        "skills":           skills,
        "location_city":    normalize_city(location),
        "salary_expected":  salary_exp,
        "remote":           remote_pref,
        "contract_types":   [c.upper() for c in contracts],
        "is_mobile":        is_mobile,
        "experience_years": exp_years,
    }


# ─── Offer ────────────────────────────────────────────────────────────────────

def build_offer_texts(offer: dict) -> dict:
    """
    Build embedding-ready text strings from a Prisma Offer record.

    Accepts both normalize.py output (stack/salaryMin) and direct Prisma JSON
    (skills/salary_min) to stay compatible with both pipelines.
    """
    # Tech stack: Prisma may call it "stack", normalize.py also "stack",
    # jobs_preview.json uses "tags", older exports use "skills"
    stack = _to_list(
        offer.get("stack")
        or offer.get("tags")
        or offer.get("skills")
    )
    location   = offer.get("location") or ""
    title      = (offer.get("title") or "").strip()
    contract   = (
        offer.get("contractType")
        or offer.get("contract_type")
        or ""
    ).upper()
    salary_min = int(offer.get("salaryMin") or offer.get("salary_min") or 0)
    salary_max = int(offer.get("salaryMax") or offer.get("salary_max") or 0)
    remote_raw = (offer.get("remote") or "").lower()

    description = strip_html(offer.get("description") or "")[:400]

    skills_text = " ".join([title] + stack)

    remote_label = REMOTE_LABEL.get(remote_raw, remote_raw)
    cond_parts = [
        f"contrat {contract}" if contract else "",
        remote_label if remote_label else "",
        f"localisation {location}" if location else "",
        f"salaire entre {salary_min} et {salary_max} euros" if salary_max else "",
        description,
    ]
    conditions_text = " ".join(p for p in cond_parts if p).strip()

    return {
        "skills_text":    skills_text,
        "conditions_text": conditions_text,
        # raw scalars for penalty / boolean logic
        "stack":          stack,
        "title":          title,
        "location_city":  normalize_city(location),
        "salary_min":     salary_min,
        "salary_max":     salary_max,
        "remote":         remote_raw,
        "contract_type":  contract,
    }
