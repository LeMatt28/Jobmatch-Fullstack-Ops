import api from './api'

export const getFeed = async () => {
  const { data } = await api.get('/candidate/feed')
  return data
}

export const swipeOffer = async (offerId, direction) => {
  const { data } = await api.post(`/candidate/swipe/${offerId}`, { direction })
  return { matched: data.matched, message: null }
}

export const getMatches = async () => {
  const { data } = await api.get('/candidate/matches')
  return data.matches
}

export const getProfile = async () => {
  const { data } = await api.get('/candidate/profile')
  return data
}

export const updateProfile = async (payload) => {
  const { data } = await api.put('/candidate/profile', payload)
  return data
}
