import { type Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion — JobAggregator',
  description: 'Connectez-vous à votre espace JobAggregator pour accéder à vos offres personnalisées.',
}

export default function LoginPage() {
  return <LoginForm />
}
