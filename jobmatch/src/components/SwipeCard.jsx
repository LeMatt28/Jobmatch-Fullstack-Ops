import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ScoreBadge } from './ScoreBadge'
import { ScoreDetail, mockScoreCriteria } from './ScoreDetail'
import { TagList } from './TagList'
import { formatSalary } from '../utils/formatDate'

const SWIPE_THRESHOLD = 120

function CompanyAvatar({ name, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-16 h-16 text-xl rounded-2xl' : 'w-11 h-11 text-sm rounded-xl'
  return (
    <div className={`${sz} bg-brand-600 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {name?.slice(0, 2).toUpperCase()}
    </div>
  )
}

function OfferModal({ offer, onClose, onLike, onDislike }) {
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(38,33,92,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Détail de l'offre : ${offer.title}`}
      >
        <div className="sticky top-0 bg-white border-b border-warm-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <CompanyAvatar name={offer.company.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-brand-900">{offer.title}</h2>
              <p className="text-sm text-gray-500">{offer.company.name}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            {offer.contractType && <span className="text-xs bg-brand-50 text-brand-700 font-medium px-3 py-1 rounded-full border border-brand-100">{offer.contractType}</span>}
            {offer.location && <span className="text-xs bg-warm-100 text-warm-900 font-medium px-3 py-1 rounded-full border border-warm-200">{offer.location}</span>}
            {offer.remote && <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-3 py-1 rounded-full border border-emerald-100">Remote</span>}
            {salary && <span className="text-xs bg-amber-50 text-amber-700 font-medium px-3 py-1 rounded-full border border-amber-100">💰 {salary}/an</span>}
          </div>

          <section className="bg-warm-50 rounded-xl p-4 border border-warm-200">
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Score de compatibilité IA</h3>
            <ScoreDetail scores={mockScoreCriteria} />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-brand-900 mb-2">Description du poste</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{offer.description}</p>
          </section>

          {offer.stack?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-brand-900 mb-2">Stack requise</h3>
              <TagList tags={offer.stack} color="brand" />
            </section>
          )}

          <section className="border border-warm-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-brand-900 mb-3">L'entreprise en bref</h3>
            <div className="flex items-center gap-3">
              <CompanyAvatar name={offer.company.name} />
              <div>
                <p className="font-semibold text-brand-900 text-sm">{offer.company.name}</p>
                <p className="text-xs text-gray-400">{offer.company.sector} · {offer.company.employees} employés</p>
              </div>
              <ScoreBadge score={offer.company.scoreReliability} size="sm" />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-warm-200 px-6 py-4 flex gap-3">
          <button
            onClick={() => { onDislike(); onClose() }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition text-sm"
          >
            ✕ Passer
          </button>
          <button
            onClick={() => { onLike(); onClose() }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-800 transition text-sm"
          >
            ♥ Je like cette offre
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function SwipeCard({ offer, onSwipe, isTop, style }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12])
  const likeOpacity = useTransform(x, [30, 120], [0, 1])
  const nopeOpacity = useTransform(x, [-120, -30], [1, 0])
  const [modalOpen, setModalOpen] = useState(false)
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)

  const triggerSwipe = async (direction) => {
    const target = direction === 'LIKE' ? 600 : -600
    await animate(x, target, { type: 'spring', stiffness: 200, damping: 20 })
    onSwipe(direction)
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      triggerSwipe('LIKE')
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      triggerSwipe('DISLIKE')
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-2xl bg-gray-100 border border-gray-200"
        style={{ transform: 'scale(0.96)', ...style }}
      />
    )
  }

  if (!offer) return null

  return (
    <>
      <motion.div
        role="article"
        aria-label={`Offre : ${offer.title}`}
        className="absolute inset-0 rounded-2xl shadow-md cursor-grab active:cursor-grabbing overflow-hidden select-none bg-white border-t-4 border-brand-600"
        style={{ x, rotate, zIndex: 1, ...style }}
        drag="x"
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02 }}
      >
        {/* LIKE overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl flex items-start justify-start p-6 z-10 pointer-events-none"
          style={{ opacity: likeOpacity, background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="text-emerald-600 font-black text-2xl border-2 border-emerald-500 rounded-xl px-3 py-1 bg-white" style={{ transform: 'rotate(-15deg)' }}>LIKE ✓</span>
        </motion.div>

        {/* NOPE overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl flex items-start justify-end p-6 z-10 pointer-events-none"
          style={{ opacity: nopeOpacity, background: 'rgba(239,68,68,0.08)' }}
        >
          <span className="text-red-600 font-black text-2xl border-2 border-red-500 rounded-xl px-3 py-1 bg-white" style={{ transform: 'rotate(15deg)' }}>NOPE ✗</span>
        </motion.div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 bg-brand-50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {offer.company.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-brand-900 font-semibold text-sm truncate">{offer.company.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <ScoreBadge score={offer.company.scoreReliability} size="sm" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{offer.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{offer.company.name} · {offer.location} · {offer.contractType}</p>
          </div>

          <div className="border-t border-gray-100" />

          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{offer.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {offer.stack?.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-50 text-brand-700 border border-brand-100">{s}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 mt-auto bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm space-y-0.5">
              {salary && <p className="text-gray-900 font-semibold">💰 {salary}/an</p>}
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-xs">📍 {offer.location}</p>
                {offer.remote && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Remote</span>
                )}
              </div>
            </div>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
              className="text-xs text-brand-600 hover:underline font-medium"
            >
              Voir détails →
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <OfferModal
            offer={offer}
            onClose={() => setModalOpen(false)}
            onLike={() => triggerSwipe('LIKE')}
            onDislike={() => triggerSwipe('DISLIKE')}
          />
        )}
      </AnimatePresence>
    </>
  )
}
