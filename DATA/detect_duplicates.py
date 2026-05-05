from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def build_job_text(job):
    tags = job.get("tags") or job.get("skills") or []
    parts = [
        job.get("title", ""),
        job.get("company", ""),
        job.get("description", ""),
        " ".join(tags),
    ]
    return " ".join(part for part in parts if part).strip()


def find_duplicates(jobs, threshold=0.85):
    if len(jobs) < 2:
        return []

    texts = [build_job_text(job) for job in jobs]
    matrix = TfidfVectorizer().fit_transform(texts)
    similarities = cosine_similarity(matrix)

    duplicates = []

    for index_a in range(len(jobs)):
        for index_b in range(index_a + 1, len(jobs)):
            score = float(similarities[index_a, index_b])
            if score >= threshold:
                duplicates.append(
                    {
                        "job_1": jobs[index_a].get("sourceId") or jobs[index_a].get("external_id"),
                        "job_2": jobs[index_b].get("sourceId") or jobs[index_b].get("external_id"),
                        "score": round(score, 3),
                    }
                )

    return duplicates
