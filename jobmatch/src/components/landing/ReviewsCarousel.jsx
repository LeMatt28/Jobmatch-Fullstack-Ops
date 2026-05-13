const REVIEWS = [
  { name: 'Sophie M.', title: 'Dev Frontend React', city: 'Paris', stars: 5, text: 'Trouvé un CDI en 3 semaines. Le matching IA m\'a évité des dizaines d\'offres hors-sujet.' },
  { name: 'Karim A.', title: 'Data Analyst', city: 'Lyon', stars: 5, text: 'Le score IA était vraiment précis — il m\'a expliqué exactement pourquoi j\'étais compatible avec chaque offre.' },
  { name: 'Laura D.', title: 'UX Designer', city: 'Bordeaux', stars: 5, text: 'Interface super intuitive, les matchs sont pertinents. Je recommande à tous mes amis.' },
  { name: 'Thomas R.', title: 'DevOps', city: 'Nantes', stars: 5, text: 'Interface intuitive, matchs pertinents. J\'ai trouvé mon poste actuel via JobMatch en moins de 2 semaines.' },
  { name: 'Inès B.', title: 'Product Manager', city: 'Toulouse', stars: 5, text: 'Moins de perte de temps qu\'Indeed. Seulement des offres qui correspondent vraiment à mon profil.' },
  { name: 'Marc V.', title: 'DRH, TechFlow', city: 'Paris', stars: 5, text: 'Candidats bien ciblés, gain de temps ×3 sur nos processus de recrutement. Outil indispensable.' },
  { name: 'Emma C.', title: 'Alternante Marketing', city: 'Lille', stars: 5, text: 'Parfait pour ma recherche d\'alternance. J\'ai eu des réponses en 48h !' },
  { name: 'Nicolas P.', title: 'Backend Dev', city: 'Strasbourg', stars: 5, text: 'Le matching soft skills m\'a vraiment surpris par sa précision. Enfin un outil qui comprend ce que je cherche.' },
  { name: 'Amina K.', title: 'Chargée RH, StartupX', city: 'Lyon', stars: 5, text: 'On embauche plus vite depuis JobMatch. Les profils matchés sont déjà pré-qualifiés.' },
  { name: 'Julien F.', title: 'Freelance', city: 'Remote', stars: 5, text: 'Enfin des offres remote vraiment adaptées à mon profil freelance. Top 5 des meilleurs outils que j\'utilise.' },
]

function ReviewCard({ name, title, city, stars, text }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 w-72 flex-shrink-0 mx-3">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-amber-400 text-sm">★</span>
        ))}
      </div>
      <p className="text-sm text-gray-700 italic leading-relaxed mb-4">"{text}"</p>
      <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-400">{title} · {city}</p>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsCarousel() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <section className="bg-gray-50 py-20 overflow-hidden" aria-label="Avis clients">
      <div className="max-w-4xl mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ils ont trouvé leur match.</h2>
      </div>

      <div className="group space-y-4">
        {/* Row 1 — scroll left */}
        <div className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0, #F9FAFB 80px, #F9FAFB calc(100% - 80px), transparent 100%)' }}>
          <div
            className="flex group-hover:[animation-play-state:paused]"
            style={{ animation: 'scroll-left 40s linear infinite' }}
          >
            {doubled.slice(0, 14).map((r, i) => <ReviewCard key={i} {...r} />)}
          </div>
        </div>

        {/* Row 2 — scroll right */}
        <div className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0, #F9FAFB 80px, #F9FAFB calc(100% - 80px), transparent 100%)' }}>
          <div
            className="flex group-hover:[animation-play-state:paused]"
            style={{ animation: 'scroll-right 35s linear infinite' }}
          >
            {doubled.slice(0, 14).map((r, i) => <ReviewCard key={i} {...r} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
