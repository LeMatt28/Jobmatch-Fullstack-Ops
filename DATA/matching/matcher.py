"""
LocalScorer — the main scoring engine.

Loads all-MiniLM-L6-v2 from DATA/models/bi-encoder (local, offline).
Never accesses the internet after the model has been downloaded.

Usage:
    from DATA.matching.matcher import get_scorer

    scorer = get_scorer()
    result = scorer.score(candidate_json, offer_json)
    # {'score': 82.5, 'messageIA': 'Match à 82% : Tes compétences en Python…', …}
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import numpy as np

from .cleaner import (
    REMOTE_COMPAT,
    build_candidate_texts,
    build_offer_texts,
)

MODEL_DIR        = Path(__file__).parent.parent / "models" / "bi-encoder"
SKILLS_WEIGHT    = 0.6
CONDITIONS_WEIGHT = 0.4

# Salary penalty thresholds
_SALARY_HEAVY_RATIO = 1.50   # expected > 50% above max → 0.40×
_SALARY_LIGHT_RATIO = 1.20   # expected > 20% above max → 0.75×


class LocalScorer:
    """
    Thread-safe scoring engine.  Instantiate once (via get_scorer()) and reuse.
    """

    def __init__(self, model_dir: Path = MODEL_DIR) -> None:
        if not model_dir.exists():
            raise FileNotFoundError(
                f"Model not found at {model_dir}.\n"
                "Run:  python -m DATA.matching.download_model"
            )
        # Block any accidental network calls from HuggingFace libraries
        os.environ["TRANSFORMERS_OFFLINE"]    = "1"
        os.environ["HF_DATASETS_OFFLINE"]     = "1"
        os.environ["HF_HUB_OFFLINE"]          = "1"

        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(str(model_dir), local_files_only=True)

    # ── Encoding ──────────────────────────────────────────────────────────────

    def encode(self, texts: list[str], normalize: bool = True) -> np.ndarray:
        """Encode a batch of strings to unit-normalized float32 embeddings."""
        return self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=normalize,
            show_progress_bar=False,
            batch_size=64,
        )

    # ── Penalty / multiplier helpers ──────────────────────────────────────────

    def _remote_mult(self, cand: dict, off: dict) -> tuple[float, str | None]:
        """Eliminatory if remote policy strictly incompatible."""
        pref = cand.get("remote", "").replace(" ", "_")
        acceptable = REMOTE_COMPAT.get(pref, None)
        job_remote = off.get("remote", "")
        if acceptable is not None and job_remote not in acceptable:
            return 0.0, (
                f"Politique remote incompatible "
                f"(souhaité : {pref or 'non précisé'} | offre : {job_remote or 'non précisé'})"
            )
        return 1.0, None

    def _contract_mult(self, cand: dict, off: dict) -> tuple[float, str | None]:
        """Eliminatory if contract type strictly incompatible."""
        user_contracts = cand.get("contract_types") or []
        job_contract   = (off.get("contract_type") or "").upper()
        if user_contracts and job_contract and job_contract not in user_contracts:
            return 0.0, (
                f"Type de contrat incompatible "
                f"(souhaité : {user_contracts} | offre : {job_contract})"
            )
        return 1.0, None

    def _location_mult(self, cand: dict, off: dict) -> tuple[float, str | None]:
        """
        Heavy penalty (×0.30) when:
        - candidate is NOT mobile, AND
        - offer city ≠ candidate city
        """
        if cand.get("is_mobile"):
            return 1.0, None
        cand_city = cand.get("location_city") or ""
        off_city  = off.get("location_city") or ""
        if cand_city and off_city and cand_city != off_city:
            return 0.30, (
                f"Localisation différente — candidat non mobile "
                f"({cand_city.title()} ≠ {off_city.title()})"
            )
        return 1.0, None

    def _salary_mult(self, cand: dict, off: dict) -> tuple[float, str | None]:
        """
        Salary malus when candidate expects more than the offer's budget:
        - > 50% above max → ×0.40
        - > 20% above max → ×0.75
        """
        expected = cand.get("salary_expected") or 0
        max_sal  = off.get("salary_max") or 0
        if not expected or not max_sal:
            return 1.0, None
        ratio = expected / max_sal
        if ratio > _SALARY_HEAVY_RATIO:
            return 0.40, (
                f"Salaire attendu ({expected:,} €) très supérieur au budget max ({max_sal:,} €)"
            )
        if ratio > _SALARY_LIGHT_RATIO:
            return 0.75, (
                f"Salaire attendu ({expected:,} €) dépasse le budget de l'offre ({max_sal:,} €)"
            )
        return 1.0, None

    # ── Main scoring ──────────────────────────────────────────────────────────

    def score(self, candidate_json: dict, offer_json: dict) -> dict[str, Any]:
        """
        Full match score for one Candidate × one Offer.

        Returns:
            score            float [0..100]
            skills_score     float [0..100]   candidate skills vs offer stack
            conditions_score float [0..100]   candidate wants vs offer provides
            eliminated       bool             True if a hard filter (remote/contract) fired
            penalties        list[str]        all applied penalty descriptions
            messageIA        str              human-readable explanation for the UI
        """
        cand = build_candidate_texts(candidate_json)
        off  = build_offer_texts(offer_json)

        # ── Semantic phase ─────────────────────────────────────────────────
        embs = self.encode([
            cand["skills_text"],   off["skills_text"],
            cand["conditions_text"], off["conditions_text"],
        ])
        # dot product of unit vectors = cosine similarity
        skills_sim = float(np.dot(embs[0], embs[1]))
        conds_sim  = float(np.dot(embs[2], embs[3]))
        semantic   = SKILLS_WEIGHT * skills_sim + CONDITIONS_WEIGHT * conds_sim

        # ── Penalty phase ──────────────────────────────────────────────────
        penalties: list[str] = []
        multiplier = 1.0
        for fn in (self._remote_mult, self._contract_mult,
                   self._location_mult, self._salary_mult):
            mult, reason = fn(cand, off)
            multiplier *= mult
            if reason:
                penalties.append(reason)

        final = round(semantic * multiplier * 100, 1)

        return {
            "score":            final,
            "skills_score":     round(skills_sim * 100, 1),
            "conditions_score": round(conds_sim * 100, 1),
            "eliminated":       multiplier == 0.0,
            "penalties":        penalties,
            "messageIA":        self.generate_message_ia(cand, off, final, penalties),
        }

    # ── Message IA ────────────────────────────────────────────────────────────

    def generate_message_ia(
        self,
        cand: dict,
        off: dict,
        score: float,
        penalties: list[str],
    ) -> str:
        """
        Generate a human-readable match explanation using keyword intersection.
        No LLM — runs in microseconds.

        Example output:
            "Match à 82% : Tes compétences en Python, Docker correspondent à
             cette offre. Point à développer : Kubernetes.
             La politique de télétravail correspond à tes attentes."
        """
        cand_skills = {s.lower() for s in cand.get("skills", [])}
        off_stack   = {s.lower() for s in off.get("stack", [])}

        # Top 3 matching skills (longest first → most specific tech)
        matching = sorted(cand_skills & off_stack, key=len, reverse=True)[:3]
        # Top 2 missing skills from the offer
        missing  = sorted(off_stack - cand_skills, key=len, reverse=True)[:2]

        parts: list[str] = [f"Match à {score}% :"]

        if matching:
            skills_str = ", ".join(s.capitalize() for s in matching)
            parts.append(f"Tes compétences en {skills_str} correspondent à cette offre.")
        else:
            parts.append("Le profil technique est partiellement aligné avec cette offre.")

        if missing:
            miss_str = " et ".join(s.capitalize() for s in missing)
            parts.append(f"Point{'s' if len(missing) > 1 else ''} à développer : {miss_str}.")

        remote_pref  = cand.get("remote", "")
        offer_remote = off.get("remote", "")
        if (remote_pref in ("full_remote", "hybrid")
                and offer_remote in ("full", "fulltime", "partial", "hybrid")):
            parts.append("La politique de télétravail correspond à tes attentes.")

        if penalties:
            # Surface only the first (most important) penalty in the UI message
            parts.append(f"⚠ {penalties[0]}")

        return " ".join(parts)


# ── Module-level singleton ─────────────────────────────────────────────────────

_scorer: LocalScorer | None = None


def get_scorer(model_dir: Path = MODEL_DIR) -> LocalScorer:
    """Return the module-level LocalScorer, loading the model on first call."""
    global _scorer
    if _scorer is None:
        _scorer = LocalScorer(model_dir)
    return _scorer
