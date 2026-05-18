import api from './api'

export const loginUser = async (email, password) => {
  const { data } = await api.post('/login', { email, password })
  return { token: data.token, role: data.role, user: data.user }
}

export const registerCandidate = async (data) => {
  await api.post('/candidate/register', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  })
  return loginUser(data.email, data.password)
}

export const registerCompany = async (data) => {
  await api.post('/company/register', {
    name: data.companyName,
    email: data.email,
    password: data.password,
    sector: data.sector,
  })
  return loginUser(data.email, data.password)
}
