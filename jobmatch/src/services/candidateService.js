// import api from './api'
import { mockOffers } from '../mocks/offers'
import { mockMatches } from '../mocks/matches'

export const getFeed = async () => {
  // TODO API RÉELLE : return api.get('/offers/feed').then(r => r.data)
  await new Promise((r) => setTimeout(r, 400))
  return mockOffers
}

export const swipeOffer = async (offerId, direction, likeCount) => {
  // TODO API RÉELLE : return api.post(`/offers/${offerId}/swipe`, { direction }).then(r => r.data)
  await new Promise((r) => setTimeout(r, 200))
  const matched = direction === 'LIKE' && likeCount % 3 === 0
  const match = matched ? mockMatches.find((m) => m.offer.id === offerId) || mockMatches[0] : null
  return { matched, message: match?.messageIA ?? null }
}

export const getMatches = async () => {
  // TODO API RÉELLE : return api.get('/me/matches').then(r => r.data)
  await new Promise((r) => setTimeout(r, 400))
  return mockMatches
}

export const getProfile = async () => {
  // TODO API RÉELLE : return api.get('/me').then(r => r.data)
  await new Promise((r) => setTimeout(r, 300))
  return {
    name: 'Alex Demo',
    email: 'demo@candidat.fr',
    location: 'Paris',
    salaryExpected: 55000,
    mobility: true,
    contractTypes: ['CDI', 'Freelance'],
    skills: ['React', 'TypeScript', 'Node.js'],
    softSkills: ['Leadership', 'Autonomie'],
    experience: 'Développeur frontend passionné, 4 ans d\'expérience en startup et scale-up.',
    level: 'Confirmé',
    scoreIA: 84,
  }
}

export const updateProfile = async (data) => {
  // TODO API RÉELLE : return api.put('/me', data).then(r => r.data)
  await new Promise((r) => setTimeout(r, 500))
  return data
}
