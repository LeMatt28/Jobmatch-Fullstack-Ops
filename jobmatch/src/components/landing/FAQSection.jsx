import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: "Comment fonctionne le score IA ?",
    a: "Notre algorithme analyse 6 critères objectifs pour chaque match : compétences techniques, salaire, localisation, type de contrat, expérience et soft skills. Chaque critère est noté de 0 à 100, et nous vous expliquons le résultat en clair.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Vos données sont hébergées en France, chiffrées et ne sont jamais vendues à des tiers. Vous pouvez les exporter ou les supprimer à tout moment depuis vos paramètres.",
  },
  {
    q: "Comment annuler mon abonnement PRO ?",
    a: "Depuis vos paramètres, rubrique Abonnement, en un clic. Aucune condition, aucun frais de résiliation.",
  },
  {
    q: "L'app est-elle disponible sur mobile ?",
    a: "JobMatch fonctionne sur tous les navigateurs mobiles. Une application iOS et Android est en cours de développement.",
  },
  {
    q: "Combien de temps faut-il pour trouver un match ?",
    a: "En moyenne 48h après la création de votre profil. Les candidats avec un profil complet reçoivent 3× plus de matchs.",
  },
  {
    q: "Comment les entreprises accèdent-elles à mon profil ?",
    a: "Les entreprises voient votre profil uniquement si vous avez liké leur offre et qu'elles ont liké votre profil en retour. Sans match, votre profil reste invisible.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl mb-2 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        <ChevronDown
          className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        />
      </button>
      <div
        style={{
          maxHeight: open ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 300ms ease',
        }}
      >
        <p className="text-sm text-gray-600 leading-relaxed px-4 pb-4">{a}</p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section className="bg-brand-50 py-20" aria-label="Questions fréquentes">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center mb-10">Questions fréquentes</h2>
        {FAQS.map((faq) => <FAQItem key={faq.q} {...faq} />)}
      </div>
    </section>
  )
}
