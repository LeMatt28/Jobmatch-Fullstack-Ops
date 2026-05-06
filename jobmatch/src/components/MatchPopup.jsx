import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'

const COLORS = ['#534AB7', '#7F77DD', '#AFA9EC', '#ffffff', '#CECBF6', '#f59e0b', '#10b981']

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 24 }).map((_, i) => {
        const color = COLORS[i % COLORS.length]
        const left = `${Math.random() * 100}%`
        const duration = 1.5 + Math.random() * 2
        const delay = Math.random() * 0.8
        const size = 6 + Math.floor(Math.random() * 10)
        return (
          <div
            key={i}
            className="absolute confetti-particle rounded-sm"
            style={{
              left,
              top: '-20px',
              width: size,
              height: size,
              backgroundColor: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function MatchPopup({ offer, message, onContinue, onGoToMatches }) {
  const firstBtn = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => firstBtn.current?.focus(), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <Confetti />
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(38, 33, 92, 0.85)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="C'est un Match !"
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800 rounded-t-3xl" />

          <motion.div
            className="text-5xl mb-2"
            initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring', stiffness: 300 } }}
          >
            🎉
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-brand-900 mb-1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          >
            C'est un Match !
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          >
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center text-lg font-bold mx-auto mt-4 mb-2">
              {offer.company.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className="font-semibold text-brand-900">{offer.title}</p>
            <p className="text-sm text-gray-500">{offer.company.name}</p>
          </motion.div>

          {message && (
            <motion.div
              className="mt-4 bg-brand-50 rounded-xl p-4 text-sm text-brand-800 text-left leading-relaxed"
              initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              <p className="text-xs text-brand-400 font-medium mb-1 uppercase tracking-wide">Message de l'entreprise</p>
              {message}
            </motion.div>
          )}

          <motion.div
            className="flex flex-col gap-3 mt-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }}
          >
            <Button
              ref={firstBtn}
              variant="primary"
              className="w-full"
              onClick={onGoToMatches}
              tabIndex={0}
            >
              Voir mes matchs
            </Button>
            <Button variant="secondary" className="w-full" onClick={onContinue} tabIndex={0}>
              Continuer à swiper
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
