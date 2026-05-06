// import api from './api'
import { mockOffers } from '../mocks/offers'
import { mockCandidates } from '../mocks/candidates'
import { mockCompanies } from '../mocks/companies'

export const getMyOffers = async () => {
  // TODO API RÉELLE : return api.get('/offers/mine').then(r => r.data)
  await new Promise((r) => setTimeout(r, 400))
  return mockOffers.filter((o) => o.company.id === 'c1')
}

export const createOffer = async (data) => {
  // TODO API RÉELLE : return api.post('/offers', data).then(r => r.data)
  await new Promise((r) => setTimeout(r, 600))
  return { id: String(Date.now()), ...data, company: { id: 'c1', name: 'TechFlow', score: 88 }, createdAt: new Date().toISOString() }
}

export const getMatchedCandidates = async (offerId) => {
  // TODO API RÉELLE : return api.get(`/matches/${offerId}`).then(r => r.data)
  await new Promise((r) => setTimeout(r, 400))
  return mockCandidates
}

export const getCompanyProfile = async () => {
  // TODO API RÉELLE : return api.get('/me').then(r => r.data)
  await new Promise((r) => setTimeout(r, 300))
  return mockCompanies[0]
}

export const getCompanyById = async (id) => {
  // TODO API RÉELLE : return api.get(`/companies/${id}`).then(r => r.data)
  await new Promise((r) => setTimeout(r, 300))
  return mockCompanies.find((c) => c.id === id) || mockCompanies[0]
}

export const getDashboardStats = async () => {
  // TODO API RÉELLE : return api.get('/company/stats').then(r => r.data)
  await new Promise((r) => setTimeout(r, 300))
  return { activeOffers: 4, totalMatches: 17, candidatesThisWeek: 32 }
}
