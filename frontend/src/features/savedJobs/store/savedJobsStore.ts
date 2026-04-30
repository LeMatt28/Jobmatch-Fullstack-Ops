import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Job } from '@/features/jobs/types/job.types'

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

const MOCK_SAVED_JOBS: Job[] = [
  {
    id: 'saved-1',
    title: 'Développeur Frontend React',
    company: { id: 'c1', name: 'Contentsquare', sector: 'Analytics' },
    location: 'Paris, France',
    remote: 'partial',
    contractType: 'CDI',
    experienceLevel: 'Intermédiaire',
    salary: { min: 48000, max: 62000, currency: 'EUR', period: 'year' },
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL'],
    description: 'Rejoignez notre équipe frontend pour développer des features sur notre plateforme analytics.',
    requirements: [],
    source: 'LinkedIn',
    sourceUrl: '#',
    publishedAt: daysAgo(2),
    isFavorite: true,
  },
  {
    id: 'saved-2',
    title: 'Ingénieur Fullstack Node / React',
    company: { id: 'c2', name: 'Alan', sector: 'HealthTech' },
    location: 'Paris, France',
    remote: 'full',
    contractType: 'CDI',
    experienceLevel: 'Senior',
    salary: { min: 65000, max: 85000, currency: 'EUR', period: 'year' },
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    description: 'Construisez les prochaines fonctionnalités de notre app santé utilisée par 500k membres.',
    requirements: [],
    source: 'Welcome to the Jungle',
    sourceUrl: '#',
    publishedAt: daysAgo(4),
    isFavorite: true,
  },
  {
    id: 'saved-3',
    title: 'Lead Développeur TypeScript',
    company: { id: 'c3', name: 'Qonto', sector: 'FinTech' },
    location: 'Paris, France',
    remote: 'partial',
    contractType: 'CDI',
    experienceLevel: 'Senior',
    salary: { min: 75000, max: 95000, currency: 'EUR', period: 'year' },
    skills: ['TypeScript', 'NestJS', 'React', 'Kubernetes'],
    description: 'Pilotez l\'architecture technique de notre plateforme bancaire B2B en forte croissance.',
    requirements: [],
    source: 'LinkedIn',
    sourceUrl: '#',
    publishedAt: daysAgo(6),
    isFavorite: true,
  },
  {
    id: 'saved-4',
    title: 'Développeur React Native',
    company: { id: 'c4', name: 'Back Market', sector: 'E-commerce' },
    location: 'Paris, France',
    remote: 'partial',
    contractType: 'CDI',
    experienceLevel: 'Intermédiaire',
    salary: { min: 50000, max: 65000, currency: 'EUR', period: 'year' },
    skills: ['React Native', 'TypeScript', 'Redux', 'iOS/Android'],
    description: 'Développez notre application mobile utilisée par des millions d\'acheteurs en Europe.',
    requirements: [],
    source: 'Indeed',
    sourceUrl: '#',
    publishedAt: daysAgo(8),
    isFavorite: true,
  },
]

interface SavedJobsStore {
  jobs: Job[]
  toggleSaved: (id: string) => void
  isSaved: (id: string) => boolean
}

export const useSavedJobsStore = create<SavedJobsStore>()(
  persist(
    (set, get) => ({
      jobs: MOCK_SAVED_JOBS,

      toggleSaved: (id) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id ? { ...j, isFavorite: !j.isFavorite } : j
          ),
        })),

      isSaved: (id) => get().jobs.some((j) => j.id === id && j.isFavorite),
    }),
    {
      name: 'saved-jobs-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
