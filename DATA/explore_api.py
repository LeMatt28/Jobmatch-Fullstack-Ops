import os
import time
from pathlib import Path

import requests

try:
    from DATA.normalize import normalize_job
except ModuleNotFoundError:
    from normalize import normalize_job


API_URL = "https://epi-api.welovedevs.com/v1"
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
DEFAULT_PAGE_SIZE = 100
REQUEST_DELAY_SECONDS = 1.1


def read_api_key():
    api_key = os.getenv("WELOVEDEVS_API_KEY")
    if api_key:
        return api_key

    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            if line.startswith("WELOVEDEVS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")

    raise ValueError("WELOVEDEVS_API_KEY introuvable dans l'environnement ou dans .env")


def fetch_jobs_page(page=0, size=DEFAULT_PAGE_SIZE):
    response = requests.get(
        API_URL,
        headers={"X-API-Key": read_api_key()},
        params={"page": page, "size": size},
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def fetch_all_jobs(size=DEFAULT_PAGE_SIZE, delay_seconds=REQUEST_DELAY_SECONDS):
    jobs = []
    page = 0

    while True:
        if page > 0:
            time.sleep(delay_seconds)

        payload = fetch_jobs_page(page=page, size=size)
        values = payload.get("values", [])

        if not values:
            break

        jobs.extend(values)

        if len(values) < size:
            break

        page += 1

    return jobs


def dedupe_jobs_by_source_id(jobs):
    seen_source_ids = set()
    unique_jobs = []

    for job in jobs:
        source_id = job.get("sourceId")
        if not source_id or source_id in seen_source_ids:
            continue

        seen_source_ids.add(source_id)
        unique_jobs.append(job)

    return unique_jobs


def filter_duplicate_jobs(jobs, duplicates):
    duplicate_ids = {duplicate["job_2"] for duplicate in duplicates}
    return [job for job in jobs if job.get("sourceId") not in duplicate_ids]


def get_normalized_jobs(size=DEFAULT_PAGE_SIZE, delay_seconds=REQUEST_DELAY_SECONDS):
    raw_jobs = fetch_all_jobs(size=size, delay_seconds=delay_seconds)
    normalized_jobs = [normalize_job(job) for job in raw_jobs]
    return dedupe_jobs_by_source_id(normalized_jobs)


def main():
    try:
        jobs = get_normalized_jobs()
    except Exception as error:
        print("Erreur API :", error)
        return

    print(f"{len(jobs)} offres normalisees recuperees")
    print("Utilise DATA/ingest_welovedevs_to_prisma.mjs pour inserer directement en base Prisma.")


if __name__ == "__main__":
    main()
