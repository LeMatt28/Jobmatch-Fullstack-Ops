export interface SalaryBucket {
  range: string
  count: number
  avgSalary: number
}

export interface JobTrend {
  month: string
  jobs: number
  applications: number
}

export interface TechTrend {
  skill: string
  count: number
  growth: number
}

export interface AnalyticsSummary {
  totalJobs: number
  avgSalary: number
  topLocation: string
  topSkill: string
  jobsThisMonth: number
  growthPercent: number
}

export interface SalaryAnalytics {
  buckets: SalaryBucket[]
  median: number
  average: number
  min: number
  max: number
}

export interface TrendsAnalytics {
  monthly: JobTrend[]
  topSkills: TechTrend[]
}
