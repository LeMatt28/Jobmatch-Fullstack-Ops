"""
Indexer — pre-computes and caches Offer embeddings to disk.

Run once after ingesting new offers, or on a nightly cron:
    python -m DATA.matching.indexer DATA/jobs_preview.json

Writes to DATA/matching/store/:
    skills.npy       float32  (N, 384)  — unit-normalized
    conditions.npy   float32  (N, 384)  — unit-normalized
    metadata.json    list of N lightweight offer records

Loading the index on the next server start takes < 5 ms for 50 k offers.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np

from .cleaner import build_offer_texts, normalize_city
from .matcher import MODEL_DIR, get_scorer

DEFAULT_STORE = Path(__file__).parent / "store"

# Only the fields needed for display + boolean/penalty filtering at query time
_META_FIELDS = (
    "sourceId", "title", "contractType", "salaryMin",
    "salaryMax", "remote", "location", "publishedAt",
)


def _extract_meta(offer: dict, parsed: dict) -> dict:
    meta = {k: offer.get(k) or offer.get(_snake(k)) for k in _META_FIELDS}
    meta["company"]       = offer.get("companyName") or offer.get("company") or ""
    meta["stack"]         = parsed["stack"]
    meta["location_city"] = parsed["location_city"]   # normalized for fast comparison
    meta["salary_min"]    = parsed["salary_min"]
    meta["salary_max"]    = parsed["salary_max"]
    meta["remote"]        = parsed["remote"]
    meta["contractType"]  = parsed["contract_type"]
    return meta


def _snake(camel: str) -> str:
    """contractType → contract_type"""
    import re
    return re.sub(r"([A-Z])", r"_\1", camel).lower().lstrip("_")


# ── Public API ────────────────────────────────────────────────────────────────

def build_index(
    offers: list[dict],
    store_dir: Path = DEFAULT_STORE,
    model_dir: Path = MODEL_DIR,
) -> None:
    """
    Batch-encode all offers and persist embeddings + metadata.

    Args:
        offers:    list of Prisma Offer records (or normalize.py output).
        store_dir: directory where .npy and .json files are written.
        model_dir: path to the local model (must exist — run download_model.py first).
    """
    store_dir.mkdir(parents=True, exist_ok=True)

    texts_skills:     list[str]       = []
    texts_conditions: list[str]       = []
    metadata:         list[dict[str, Any]] = []

    for offer in offers:
        parsed = build_offer_texts(offer)
        texts_skills.append(parsed["skills_text"])
        texts_conditions.append(parsed["conditions_text"])
        metadata.append(_extract_meta(offer, parsed))

    scorer = get_scorer(model_dir)

    print(f"[indexer] encoding {len(offers)} offers — skills axis …")
    skills_embs = scorer.encode(texts_skills)
    print("[indexer] encoding conditions axis …")
    conds_embs  = scorer.encode(texts_conditions)

    np.save(store_dir / "skills.npy",     skills_embs.astype(np.float32))
    np.save(store_dir / "conditions.npy", conds_embs.astype(np.float32))
    with open(store_dir / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False)

    print(f"[indexer] {len(offers)} embeddings saved → {store_dir}")


def load_index(
    store_dir: Path = DEFAULT_STORE,
) -> tuple[np.ndarray, np.ndarray, list[dict]]:
    """
    Load pre-computed embeddings from disk.

    Returns:
        skills_embs   float32 (N, 384)  unit-normalized
        conds_embs    float32 (N, 384)  unit-normalized
        metadata      list of N Offer metadata dicts
    """
    for name in ("skills.npy", "conditions.npy", "metadata.json"):
        if not (store_dir / name).exists():
            raise FileNotFoundError(
                f"Index file '{name}' not found in {store_dir}.\n"
                "Run:  python -m DATA.matching.indexer <offers.json>"
            )

    skills_embs = np.load(store_dir / "skills.npy")
    conds_embs  = np.load(store_dir / "conditions.npy")
    with open(store_dir / "metadata.json", encoding="utf-8") as f:
        metadata = json.load(f)

    return skills_embs, conds_embs, metadata


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m DATA.matching.indexer <offers.json> [store_dir]")
        sys.exit(1)

    offers_path = Path(sys.argv[1])
    store_dir   = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_STORE

    with open(offers_path, encoding="utf-8") as f:
        offers = json.load(f)

    build_index(offers, store_dir)
