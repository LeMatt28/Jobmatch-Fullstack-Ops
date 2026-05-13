import { Link } from 'react-router-dom'

const COLS = [
  {
    title: 'JobMatch',
    items: null,
    social: true,
  },
  {
    title: 'Candidats',
    items: [
      { label: 'Comment ça marche', to: '/#how' },
      { label: 'Créer un profil', to: '/register/candidate' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Entreprises',
    items: [
      { label: 'Publier une offre', to: '/register/company' },
      { label: 'Tarifs entreprise', to: '/premium/company' },
      { label: 'Contact RH', to: '#' },
    ],
  },
  {
    title: 'Légal',
    items: [
      { label: 'Mentions légales', to: '#' },
      { label: 'CGU', to: '#' },
      { label: 'Politique RGPD', to: '#' },
    ],
  },
]

export default function LandingFooter() {
  return (
    <footer className="bg-brand-900 border-t border-brand-800 pt-12 pb-6" role="contentinfo">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="font-bold text-white text-sm mb-4">{col.title}</p>
            {col.social ? (
              <div className="space-y-2">
                <p className="text-xs text-brand-300 leading-relaxed">Le matching IA pour trouver l'emploi qui vous ressemble vraiment.</p>
                <div className="flex gap-3 mt-3">
                  {['in', 'tw', 'ig'].map((s) => (
                    <a key={s} href="#" className="w-8 h-8 rounded-lg bg-brand-800 text-brand-300 hover:text-white hover:bg-brand-600 flex items-center justify-center text-xs font-bold transition" aria-label={s}>
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-xs text-brand-300 hover:text-white transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-6 border-t border-brand-800 pt-6">
        <p className="text-xs text-brand-400 text-center">© 2025 JobMatch · Fait avec ♥ en France</p>
      </div>
    </footer>
  )
}
