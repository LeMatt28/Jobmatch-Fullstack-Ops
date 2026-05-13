import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function MockCard() {
  return (
    <div className="relative" style={{ perspective: 800 }}>
      {/* Background card */}
      <div
        className="absolute inset-0 rounded-2xl bg-brand-100 border border-brand-200"
        style={{ transform: 'rotate(-3deg) scale(0.95) translate(-10px, 10px)', borderRadius: 16 }}
      />
      {/* Main card */}
      <div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-t-4"
        style={{ borderTopColor: '#534AB7', transform: 'rotate(2deg)' }}
      >
        {/* Match badge */}
        <div
          className="absolute top-4 right-4 z-10 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          Match ✓
        </div>
        {/* Score badge */}
        <div
          className="absolute bottom-16 left-4 z-10 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full"
          style={{ animation: 'float 3s ease-in-out infinite 1.5s' }}
        >
          Score 91%
        </div>
        {/* Header */}
        <div className="px-5 pt-4 pb-3 bg-brand-50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">TF</div>
          <div className="flex-1 min-w-0">
            <p className="text-brand-900 font-semibold text-sm">TechFlow</p>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium border border-emerald-200">88 ✓</span>
          </div>
        </div>
        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Développeur React Senior</h3>
            <p className="text-sm text-gray-500 mt-0.5">Paris 9e · CDI · Remote</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js'].map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-100 text-violet-800 border border-violet-200">{t}</span>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-900">💰 55k–70k€/an</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-500">📍 Paris 9e</p>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Remote</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const avatarColors = ['#534AB7', '#3C3489', '#7F77DD', '#10B981', '#F59E0B']

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[55%_45%] gap-12 items-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm text-brand-700 font-medium mb-6"
        >
          ✦ Nouveau · Matching IA pour l'emploi
        </motion.div>

        <div className="overflow-hidden">
          {['Trouvez votre job', 'comme vous trouvez', "l'amour."].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">{line}</h1>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-base text-gray-600 max-w-lg mt-5 mb-8 leading-relaxed"
        >
          Swipez les offres qui correspondent à votre profil. Notre IA analyse 6 critères et vous explique chaque match.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Link
            to="/register/candidate"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition"
          >
            Trouver mon job <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/register/company"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition"
          >
            Nous recrutons →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {avatarColors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">+ Rejoints par <strong className="text-gray-900">12 000 candidats</strong></p>
        </motion.div>
      </div>

      <div className="hidden md:block">
        <MockCard />
      </div>
    </section>
  )
}
