"""
Downloads all-MiniLM-L6-v2 (~80 MB) and saves it permanently to disk.

Run ONCE before first use:
    python -m DATA.matching.download_model

After this script completes, every other module in DATA/matching/ runs
100% offline — no network access is ever attempted again.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
MODEL_DIR  = Path(__file__).parent.parent / "models" / "bi-encoder"


def download() -> None:
    # Import here so the rest of the codebase can import cleaner.py
    # without sentence_transformers being installed yet.
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("sentence-transformers not installed.")
        print("Run:  pip install sentence-transformers")
        sys.exit(1)

    if MODEL_DIR.exists() and any(MODEL_DIR.iterdir()):
        print(f"[download_model] Model already present at {MODEL_DIR}")
        _print_size()
        return

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[download_model] Downloading {MODEL_NAME} …")
    print("[download_model] (requires internet — this is the ONLY time)")

    model = SentenceTransformer(MODEL_NAME)
    model.save(str(MODEL_DIR))

    _print_size()
    print("[download_model] Done. Internet access is no longer required.")


def _print_size() -> None:
    total = sum(f.stat().st_size for f in MODEL_DIR.rglob("*") if f.is_file())
    print(f"[download_model] Model size on disk: {total / 1e6:.1f} MB  ({MODEL_DIR})")


if __name__ == "__main__":
    download()
