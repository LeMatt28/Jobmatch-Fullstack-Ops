import unittest

from DATA.normalize import normalize_job


class NormalizeJobTests(unittest.TestCase):
    def test_normalize_job_keeps_main_fields(self):
        raw_job = {
            "id": "job-1",
            "title": " Python Developer ",
            "smallCompany": {"companyName": "ACME"},
            "formattedPlaces": ["Paris"],
            "contractTypes": ["CDI"],
            "description": "Build APIs",
            "skillsList": [{"name": "Python"}, {"name": "FastAPI"}],
            "publishDate": 1714000000000000,
            "details": {
                "salary": {"min": 45, "max": 55},
                "remotePolicy": {"frequency": "FULL_REMOTE"},
            },
        }

        job = normalize_job(raw_job)

        self.assertEqual(job["sourceId"], "job-1")
        self.assertEqual(job["title"], "Python Developer")
        self.assertEqual(job["company"], "ACME")
        self.assertEqual(job["location"], "Paris")
        self.assertEqual(job["contractType"], "CDI")
        self.assertEqual(job["tags"], ["Python", "FastAPI"])
        self.assertEqual(job["salaryMin"], 45000)
        self.assertEqual(job["salaryMax"], 55000)
        self.assertEqual(job["remote"], "FULL_REMOTE")
        self.assertIsNotNone(job["publishedAt"])
        self.assertTrue(job["isActive"])

    def test_normalize_job_maps_welovedevs_contract_type_to_prisma_enum(self):
        raw_job = {
            "id": "job-3",
            "title": "Backend Developer",
            "smallCompany": {"companyName": "ACME"},
            "contractTypes": ["permanent"],
            "details": {},
        }

        job = normalize_job(raw_job)

        self.assertEqual(job["contractType"], "CDI")

    def test_normalize_job_handles_missing_values(self):
        raw_job = {
            "id": "job-2",
            "title": "Data intern",
            "formattedPlaces": [],
            "contractTypes": [],
            "skillsList": [],
            "details": {},
        }

        job = normalize_job(raw_job)

        self.assertIsNone(job["location"])
        self.assertIsNone(job["contractType"])
        self.assertEqual(job["tags"], [])
        self.assertIsNone(job["salaryMin"])
        self.assertIsNone(job["salaryMax"])
        self.assertIsNone(job["publishedAt"])
        self.assertIsNone(job["remote"])


if __name__ == "__main__":
    unittest.main()
