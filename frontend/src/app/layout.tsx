import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'JobAggregator — Trouvez votre prochain emploi',
    template: '%s | JobAggregator',
  },
  description: 'Plateforme d\'agrégation d\'offres d\'emploi. Des milliers d\'offres en un seul endroit.',
  keywords: ['emploi', 'recrutement', 'offres', 'CDI', 'stage', 'alternance'],
  authors: [{ name: 'JobAggregator' }],
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
