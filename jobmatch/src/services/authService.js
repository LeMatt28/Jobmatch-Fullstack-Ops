// import api from './api'

export const loginUser = async (email, password) => {
  // TODO API RÉELLE : return api.post('/auth/login', { email, password }).then(r => r.data)
  await new Promise((r) => setTimeout(r, 600))
  if (email === 'demo@candidat.fr' && password === 'demo')
    return { token: 'mock-token-cand', role: 'candidate', user: { id: '1', name: 'Alex Demo', email } }
  if (email === 'demo@entreprise.fr' && password === 'demo')
    return { token: 'mock-token-comp', role: 'company', user: { id: '2', name: 'TechFlow', email } }
  throw new Error('Identifiants incorrects')
}

export const registerCandidate = async (data) => {
  // TODO API RÉELLE : return api.post('/auth/register/candidate', data).then(r => r.data)
  await new Promise((r) => setTimeout(r, 800))
  return {
    token: 'mock-token-cand-new',
    role: 'candidate',
    user: { id: String(Date.now()), name: `${data.firstName} ${data.lastName}`, email: data.email },
  }
}

export const registerCompany = async (data) => {
  // TODO API RÉELLE : return api.post('/auth/register/company', data).then(r => r.data)
  await new Promise((r) => setTimeout(r, 800))
  return {
    token: 'mock-token-comp-new',
    role: 'company',
    user: { id: String(Date.now()), name: data.companyName, email: data.email },
  }
}
