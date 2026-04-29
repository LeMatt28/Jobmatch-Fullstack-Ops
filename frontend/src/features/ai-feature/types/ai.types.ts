export interface RecommendedJob {
  jobId: string
  title: string
  company: string
  location: string
  contractType: string
  salary?: string
  matchScore: number
  matchReasons: string[]
  publishedAt: string
}

export interface SkillGap {
  skill: string
  importance: 'high' | 'medium' | 'low'
  jobCount: number
}

export interface AIRecommendations {
  jobs: RecommendedJob[]
  skillGaps: SkillGap[]
  profileStrength: number
}
