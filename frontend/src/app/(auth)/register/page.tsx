import { type Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription — JobAggregator',
  description: 'Créez votre compte gratuit sur JobAggregator et accédez à des milliers d\'offres d\'emploi.',
}

export default function RegisterPage() {
  return <RegisterForm />
}
