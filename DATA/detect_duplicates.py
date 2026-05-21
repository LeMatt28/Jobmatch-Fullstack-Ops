from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def clean_value(value):
    if value is None:
        return ""

    return str(value).strip()


def build_tags_text(tags):
    if not tags:
        return ""

    if isinstance(tags, str):
        return clean_value(tags)

    clean_tags = [clean_value(tag) for tag in tags]
    return " ".join(tag for tag in clean_tags if tag)


def build_job_text(job):
    tags = job.get("stack") or job.get("tags") or job.get("skills") or []
    parts = [
        clean_value(job.get("title")),
        clean_value(job.get("companyName") or job.get("company")),
        clean_value(job.get("description")),
        build_tags_text(tags),
    ]
    return " ".join(part for part in parts if part).strip()


def get_job_id(job):
    return job.get("sourceId") or job.get("external_id")


def find_duplicates(jobs, threshold=0.85):
    if len(jobs) < 2:
        return []

    texts = [build_job_text(job) for job in jobs]
    if not any(texts):
        return []

    try:
        matrix = TfidfVectorizer(strip_accents="unicode").fit_transform(texts)
    except ValueError:
        # Happens when there is no usable word in the job texts.
        return []

    duplicates = []

    for index_a in range(len(jobs) - 1):
        scores = cosine_similarity(matrix[index_a], matrix[index_a + 1 :]).ravel()

        for index_b, score in enumerate(scores, start=index_a + 1):
            score = float(score)
            if score >= threshold:
                duplicates.append(
                    {
                        "job_1": get_job_id(jobs[index_a]),
                        "job_2": get_job_id(jobs[index_b]),
                        "score": round(score, 3),
                    }
                )

    return duplicates
