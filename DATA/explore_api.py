import json
import os
from pathlib import Path

import requests

try:
    from DATA.detect_duplicates import find_duplicates
    from DATA.normalize import normalize_job
except ModuleNotFoundError:
    from detect_duplicates import find_duplicates
    from normalize import normalize_job


API_URL = "https://epi-api.welovedevs.com/v1"
OUTPUT_FILE = Path(__file__).with_name("jobs_preview.json")
DUPLICATES_FILE = Path(__file__).with_name("jobs_duplicates.json")
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


def read_api_key():
    api_key = os.getenv("WELOVEDEVS_API_KEY")
    if api_key:
        return api_key

    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            if line.startswith("WELOVEDEVS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")

    raise ValueError("WELOVEDEVS_API_KEY introuvable dans l'environnement ou dans .env")


def fetch_jobs(page=0, size=10):
    response = requests.get(
        API_URL,
        headers={"X-API-Key": read_api_key()},
        params={"page": page, "size": size},
        timeout=15,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("values", [])


def save_jobs(jobs):
    OUTPUT_FILE.write_text(
        json.dumps(jobs, indent=4, ensure_ascii=False),
        encoding="utf-8",
    )


def save_duplicates(duplicates):
    DUPLICATES_FILE.write_text(
        json.dumps(duplicates, indent=4, ensure_ascii=False),
        encoding="utf-8",
    )


def filter_duplicate_jobs(jobs, duplicates):
    duplicate_ids = {duplicate["job_2"] for duplicate in duplicates}
    return [job for job in jobs if job.get("sourceId") not in duplicate_ids]


def main():
    try:
        jobs = fetch_jobs()
    except Exception as error:
        print("Erreur API :", error)
        return

    normalized_jobs = [normalize_job(job) for job in jobs]
    duplicates = find_duplicates(normalized_jobs)
    clean_jobs = filter_duplicate_jobs(normalized_jobs, duplicates)

    save_jobs(clean_jobs)
    save_duplicates(duplicates)

    print(f"{len(clean_jobs)} offres sauvegardees dans {OUTPUT_FILE.name}")
    print(f"{len(duplicates)} doublons detectes dans {DUPLICATES_FILE.name}")


if __name__ == "__main__":
    main()
