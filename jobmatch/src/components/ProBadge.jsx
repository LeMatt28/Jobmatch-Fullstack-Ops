import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { Button } from './ui/Button'

export function ProBadge() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 bg-brand-900 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-brand-800 transition"
      >
        <Star className="w-3 h-3 fill-current" /> PRO
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog" aria-modal="true" aria-label="Offre JobMatch PRO"
          >
            <motion.div
              className="bg-brand-900 text-white rounded-2xl p-8 max-w-sm w-full relative"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="text-4xl mb-4">✦</div>
              <h2 className="text-2xl font-bold mb-2">Passez à JobMatch PRO</h2>
              <p className="text-brand-200 text-sm mb-6">Accédez à tous les profils complets et contactez directement les candidats.</p>
              <ul className="space-y-2 mb-8 text-sm">
                {['Profils candidats complets', 'Contact direct illimité', 'Statistiques avancées', 'Tri par critères premium'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-brand-400">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="w-full bg-white text-brand-900 hover:bg-brand-50" onClick={() => setOpen(false)}>
                Voir les offres PRO
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
