"""
Recommender — vectorized Top-K job ranking for one Candidate.

Target: < 50 ms per recommendation (index already loaded in memory).

Usage:
    from DATA.matching.recommender import recommend

    results = recommend(candidate_json, top_k=20)

Each result dict:
    {
        'score':            87.3,       # final score /100
        'skills_score':     91.0,       # semantic skills axis /100
        'conditions_score': 80.2,       # semantic conditions axis /100
        'eliminated':       False,      # True if a hard filter fired
        'penalties':        [],         # list of applied penalty descriptions
        'messageIA':        'Match à 87% : Tes compétences en…',
        'offer':            { …offer metadata… }
    }
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np

from .cleaner import REMOTE_COMPAT, build_candidate_texts
from .indexer import DEFAULT_STORE, load_index
from .matcher import (
    MODEL_DIR,
    SKILLS_WEIGHT,
    CONDITIONS_WEIGHT,
    _SALARY_HEAVY_RATIO,
    _SALARY_LIGHT_RATIO,
    get_scorer,
)

# In-process cache so repeated calls skip disk I/O
_index_cache: dict[str, Any] = {}


def _get_index(store_dir: Path) -> tuple[np.ndarray, np.ndarray, list[dict]]:
    key = str(store_dir)
    if key not in _index_cache:
        s, c, m = load_index(store_dir)
        _index_cache[key] = {"skills": s, "conds": c, "meta": m}
    v = _index_cache[key]
    return v["skills"], v["conds"], v["meta"]


def invalidate_cache(store_dir: Path = DEFAULT_STORE) -> None:
    """Call after re-indexing to force a fresh load on the next recommend()."""
    _index_cache.pop(str(store_dir), None)


# ── Vectorized penalty multipliers ────────────────────────────────────────────

def _score_multipliers(cand: dict, metadata: list[dict]) -> np.ndarray:
    """
    Compute a float32 multiplier for each offer in one pass.
    Values: 0.0 (eliminated), 0.30 (location penalty),
            0.40 / 0.75 (salary malus), or 1.0 (no penalty).
    """
    n    = len(metadata)
    mult = np.ones(n, dtype=np.float32)

    # ── Remote (eliminatory: 0 or 1) ──────────────────────────────────────
    user_remote = cand.get("remote", "").replace(" ", "_")
    acceptable  = REMOTE_COMPAT.get(user_remote, None)
    if acceptable is not None:
        job_remotes = np.array([m.get("remote") or "" for m in metadata])
        mult *= np.isin(job_remotes, list(acceptable)).astype(np.float32)

    # ── Contract type (eliminatory: 0 or 1) ───────────────────────────────
    user_contracts = cand.get("contract_types") or []
    if user_contracts:
        job_contracts = np.array([(m.get("contractType") or "").upper() for m in metadata])
        mult *= np.isin(job_contracts, user_contracts).astype(np.float32)

    # ── Location penalty (×0.30 if different city and not mobile) ─────────
    if not cand.get("is_mobile"):
        cand_city = cand.get("location_city") or ""
        if cand_city:
            job_cities = np.array([m.get("location_city") or "" for m in metadata])
            same_city  = (job_cities == cand_city)
            mult       *= np.where(same_city, 1.0, 0.30).astype(np.float32)

    # ── Salary malus (continuous: 1.0 → 0.75 → 0.40) ─────────────────────
    expected = cand.get("salary_expected") or 0
    if expected:
        job_max = np.array([m.get("salary_max") or 0 for m in metadata], dtype=np.float32)
        known   = job_max > 0
        ratio   = np.where(known, expected / np.where(known, job_max, 1.0), 1.0)
        sal_mult = np.ones(n, dtype=np.float32)
        sal_mult = np.where(ratio > _SALARY_HEAVY_RATIO, 0.40, sal_mult)
        sal_mult = np.where(
            (ratio > _SALARY_LIGHT_RATIO) & (ratio <= _SALARY_HEAVY_RATIO), 0.75, sal_mult
        )
        mult *= sal_mult

    return mult


def _build_penalties(cand: dict, offer_meta: dict) -> list[str]:
    """
    Reconstruct penalty descriptions for a single offer (called only for top_k results).
    """
    penalties: list[str] = []

    user_remote = cand.get("remote", "").replace(" ", "_")
    acceptable  = REMOTE_COMPAT.get(user_remote, None)
    job_remote  = offer_meta.get("remote") or ""
    if acceptable is not None and job_remote not in acceptable:
        penalties.append(
            f"Politique remote incompatible (souhaité : {user_remote} | offre : {job_remote})"
        )

    user_contracts = cand.get("contract_types") or []
    job_contract   = (offer_meta.get("contractType") or "").upper()
    if user_contracts and job_contract and job_contract not in user_contracts:
        penalties.append(
            f"Type de contrat incompatible (souhaité : {user_contracts} | offre : {job_contract})"
        )

    if not cand.get("is_mobile"):
        cand_city = cand.get("location_city") or ""
        off_city  = offer_meta.get("location_city") or ""
        if cand_city and off_city and cand_city != off_city:
            penalties.append(
                f"Localisation différente — candidat non mobile "
                f"({cand_city.title()} ≠ {off_city.title()})"
            )

    expected = cand.get("salary_expected") or 0
    max_sal  = offer_meta.get("salary_max") or 0
    if expected and max_sal:
        ratio = expected / max_sal
        if ratio > _SALARY_HEAVY_RATIO:
            penalties.append(
                f"Salaire attendu ({expected:,} €) très supérieur au budget max ({max_sal:,} €)"
            )
        elif ratio > _SALARY_LIGHT_RATIO:
            penalties.append(
                f"Salaire attendu ({expected:,} €) dépasse le budget de l'offre ({max_sal:,} €)"
            )

    return penalties


# ── Main entry point ──────────────────────────────────────────────────────────

def recommend(
    candidate_json: dict,
    top_k: int = 20,
    store_dir: Path = DEFAULT_STORE,
    model_dir: Path = MODEL_DIR,
    include_eliminated: bool = False,
) -> list[dict[str, Any]]:
    """
    Return the top_k best-matching offers for a candidate.

    Args:
        candidate_json:      Prisma Candidate record (or equivalent dict).
        top_k:               Number of results to return.
        store_dir:           Path to the index produced by indexer.py.
        model_dir:           Path to the local model.
        include_eliminated:  If True, eliminated offers appear with score=0
                             (useful for UI transparency / "why no match" view).

    Performance: ~15 ms total for 10 k offers on CPU
        (~5 ms encode user + ~1 ms matmul + ~1 ms sort + ~8 ms messageIA for top_k=20)
    """
    cand = build_candidate_texts(candidate_json)

    # ── Encode candidate (2 strings, 1 batched call) ──────────────────────
    scorer  = get_scorer(model_dir)
    u_embs  = scorer.encode([cand["skills_text"], cand["conditions_text"]])
    u_skills = u_embs[0]   # (384,)
    u_conds  = u_embs[1]   # (384,)

    # ── Load pre-computed offer embeddings ────────────────────────────────
    skills_embs, conds_embs, metadata = _get_index(store_dir)
    # (N, 384) already unit-normalized → dot = cosine

    # ── Vectorized cosine similarities ────────────────────────────────────
    skills_sims = skills_embs @ u_skills          # (N,)
    conds_sims  = conds_embs  @ u_conds           # (N,)
    semantic    = SKILLS_WEIGHT * skills_sims + CONDITIONS_WEIGHT * conds_sims   # (N,)

    # ── Apply all multipliers in one pass ─────────────────────────────────
    mult_arr     = _score_multipliers(cand, metadata)
    final_scores = (semantic * mult_arr * 100).astype(np.float32)

    # ── Rank ──────────────────────────────────────────────────────────────
    if include_eliminated:
        ranked = np.argsort(final_scores)[::-1][:top_k]
    else:
        eligible = np.where(mult_arr > 0)[0]
        if len(eligible) == 0:
            return []
        ranked = eligible[np.argsort(final_scores[eligible])[::-1]][:top_k]

    # ── Build result dicts (messageIA generated here) ─────────────────────
    results: list[dict] = []
    for idx in ranked:
        idx        = int(idx)
        off_meta   = metadata[idx]
        eliminated = bool(mult_arr[idx] == 0.0)
        penalties  = _build_penalties(cand, off_meta)
        score_val  = round(float(final_scores[idx]), 1)

        # build_offer_texts is already done at index time; reconstruct
        # the minimal dict that generate_message_ia needs
        off_for_msg = {
            "stack":         off_meta.get("stack") or [],
            "remote":        off_meta.get("remote") or "",
            "location_city": off_meta.get("location_city") or "",
            "salary_max":    off_meta.get("salary_max") or 0,
        }

        results.append({
            "score":            score_val,
            "skills_score":     round(float(skills_sims[idx]) * 100, 1),
            "conditions_score": round(float(conds_sims[idx]) * 100, 1),
            "eliminated":       eliminated,
            "penalties":        penalties,
            "messageIA":        scorer.generate_message_ia(cand, off_for_msg, score_val, penalties),
            "offer":            off_meta,
        })

    return results
