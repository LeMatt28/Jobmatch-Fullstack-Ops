import unittest

from DATA.detect_duplicates import find_duplicates


class DetectDuplicatesTests(unittest.TestCase):
    def test_find_duplicates_detects_similar_jobs(self):
        jobs = [
            {
                "sourceId": "1",
                "title": "Python Backend Developer",
                "company": "ACME",
                "description": "API Python FastAPI PostgreSQL",
                "tags": ["Python", "FastAPI", "PostgreSQL"],
            },
            {
                "sourceId": "2",
                "title": "Backend Python Developer",
                "company": "ACME",
                "description": "Python API FastAPI PostgreSQL",
                "tags": ["Python", "FastAPI", "PostgreSQL"],
            },
            {
                "sourceId": "3",
                "title": "Frontend React Developer",
                "company": "ACME",
                "description": "React TypeScript UI",
                "tags": ["React", "TypeScript"],
            },
        ]

        duplicates = find_duplicates(jobs, threshold=0.6)

        self.assertEqual(len(duplicates), 1)
        self.assertEqual(duplicates[0]["job_1"], "1")
        self.assertEqual(duplicates[0]["job_2"], "2")

    def test_find_duplicates_accepts_normalized_prisma_fields(self):
        jobs = [
            {
                "sourceId": "job-1",
                "title": "Developpeur Python Backend",
                "companyName": "ACME",
                "description": "API Python FastAPI PostgreSQL",
                "stack": ["Python", "FastAPI", "PostgreSQL"],
            },
            {
                "sourceId": "job-2",
                "title": "Développeur Backend Python",
                "companyName": "ACME",
                "description": "Python API FastAPI PostgreSQL",
                "stack": ["Python", "FastAPI", "PostgreSQL"],
            },
        ]

        duplicates = find_duplicates(jobs, threshold=0.6)

        self.assertEqual(len(duplicates), 1)
        self.assertEqual(duplicates[0]["job_1"], "job-1")
        self.assertEqual(duplicates[0]["job_2"], "job-2")

    def test_find_duplicates_ignores_empty_jobs(self):
        jobs = [
            {"sourceId": "1", "title": "", "description": "", "stack": []},
            {"sourceId": "2", "title": None, "description": None, "stack": None},
        ]

        self.assertEqual(find_duplicates(jobs), [])


if __name__ == "__main__":
    unittest.main()
