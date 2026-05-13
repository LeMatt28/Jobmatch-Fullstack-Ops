import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="bg-brand-900 py-20 text-center" aria-label="Appel à l'action">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white tracking-tight mb-4">
          Votre prochain job vous attend.
        </h2>
        <p className="text-brand-200 text-lg mb-8">
          Rejoignez 12 000 candidats qui ont fait confiance à JobMatch.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link
            to="/register/candidate"
            className="bg-white text-brand-900 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition"
          >
            Créer mon profil gratuitement
          </Link>
          <Link
            to="/candidate/feed"
            className="border border-brand-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition"
          >
            Voir les offres →
          </Link>
        </div>
        <p className="text-brand-400 text-sm">Sans carte bancaire · Inscription en 2 minutes</p>
      </div>
    </section>
  )
}
