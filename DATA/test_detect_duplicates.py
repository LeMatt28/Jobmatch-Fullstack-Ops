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


if __name__ == "__main__":
    unittest.main()
