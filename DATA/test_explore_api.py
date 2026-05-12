import unittest
from unittest.mock import patch

from DATA.explore_api import (
    dedupe_jobs_by_source_id,
    fetch_all_jobs,
    filter_duplicate_jobs,
    get_normalized_jobs,
)


class ExploreApiTests(unittest.TestCase):
    def test_fetch_all_jobs_collects_every_page_until_total_count(self):
        payloads = [
            {"totalCount": 3, "values": [{"id": "1"}, {"id": "2"}]},
            {"totalCount": 3, "values": [{"id": "3"}]},
        ]

        with patch("DATA.explore_api.fetch_jobs_page", side_effect=payloads) as mocked_fetch:
            with patch("DATA.explore_api.time.sleep") as mocked_sleep:
                jobs = fetch_all_jobs(size=2, delay_seconds=0)

        self.assertEqual(jobs, [{"id": "1"}, {"id": "2"}, {"id": "3"}])
        self.assertEqual(mocked_fetch.call_count, 2)
        mocked_sleep.assert_called_once_with(0)

    def test_dedupe_jobs_by_source_id_keeps_first_occurrence(self):
        jobs = [
            {"sourceId": "1", "title": "Backend Developer"},
            {"sourceId": "1", "title": "Backend Developer duplicate"},
            {"sourceId": "2", "title": "Frontend Developer"},
        ]

        unique_jobs = dedupe_jobs_by_source_id(jobs)

        self.assertEqual(unique_jobs, [jobs[0], jobs[2]])

    def test_filter_duplicate_jobs_removes_second_job_from_duplicate_pair(self):
        jobs = [
            {"sourceId": "1", "title": "Backend Developer"},
            {"sourceId": "2", "title": "Python Backend Developer"},
            {"sourceId": "3", "title": "Frontend Developer"},
        ]
        duplicates = [
            {"job_1": "1", "job_2": "2", "score": 0.91},
        ]

        clean_jobs = filter_duplicate_jobs(jobs, duplicates)

        self.assertEqual([job["sourceId"] for job in clean_jobs], ["1", "3"])

    def test_get_normalized_jobs_normalizes_and_dedupes_results(self):
        raw_jobs = [
            {
                "id": "job-1",
                "title": " Python Developer ",
                "smallCompany": {"companyName": "ACME"},
                "formattedPlaces": ["Paris"],
                "contractTypes": ["CDI"],
                "description": "Build APIs",
                "skillsList": [{"name": "Python"}],
                "details": {},
            },
            {
                "id": "job-1",
                "title": "Duplicate Python Developer",
                "smallCompany": {"companyName": "ACME"},
                "contractTypes": ["CDI"],
                "details": {},
            },
        ]

        with patch("DATA.explore_api.fetch_all_jobs", return_value=raw_jobs):
            jobs = get_normalized_jobs(size=2, delay_seconds=0)

        self.assertEqual(len(jobs), 1)
        self.assertEqual(jobs[0]["sourceId"], "job-1")
        self.assertEqual(jobs[0]["title"], "Python Developer")


if __name__ == "__main__":
    unittest.main()
