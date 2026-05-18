import api from './api'

export const getMyOffers = async () => {
  const { data } = await api.get('/company/offers')
  return data
}

export const createOffer = async (payload) => {
  const { data } = await api.post('/company/offers', payload)
  return data
}

export const getMatchedCandidates = async (offerId) => {
  const { data } = await api.get(`/company/matches/${offerId}`)
  return data.matches
}

export const getCompanyProfile = async () => {
  const { data } = await api.get('/company/profile')
  return data
}

export const getCompanyById = async (id) => {
  const { data } = await api.get(`/company/${id}`)
  return data
}

export const getDashboardStats = async () => {
  const { data } = await api.get('/company/offers')
  const offers = data ?? []
  const activeOffers = offers.filter((o) => o.isActive).length
  const totalMatches = offers.reduce((sum, o) => sum + (o._count?.matches ?? 0), 0)
  return { activeOffers, totalMatches, candidatesThisWeek: 0 }
}
