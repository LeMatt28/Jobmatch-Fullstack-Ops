import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Heart, X, RotateCcw } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { SwipeCard } from '../../components/SwipeCard'
import { MatchPopup } from '../../components/MatchPopup'
import { Spinner } from '../../components/ui/Spinner'
import { useFeed } from '../../hooks/useFeed'

export default function SwipeFeed() {
  const navigate = useNavigate()
  const { offers, currentIndex, loading, error, swipe, undo, canUndo, matchResult, clearMatch, remaining } = useFeed()

  const handleKeyDown = useCallback((e) => {
    if (matchResult) return
    if (e.key === 'ArrowRight') swipe('LIKE')
    if (e.key === 'ArrowLeft') swipe('DISLIKE')
  }, [swipe, matchResult])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const noMore = !loading && currentIndex >= offers.length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 md:pb-8 pt-6 gap-6">
        {loading && <Spinner size="lg" />}

        {error && (
          <div className="text-center">
            <p className="text-red-500">Impossible de charger les offres</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Counter */}
            {!noMore && (
              <p className="text-sm text-gray-500 font-medium">
                {remaining} offre{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
                <span className="ml-2 text-xs text-gray-400">(← → ou boutons)</span>
              </p>
            )}

            {/* Card stack */}
            {noMore ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😴</div>
                <h2 className="text-2xl font-bold text-brand-900 mb-2">Reviens demain !</h2>
                <p className="text-gray-500">Tu as vu toutes les offres du moment.<br/>De nouvelles arrivent chaque jour.</p>
              </div>
            ) : (
              <div
                className="relative w-[90vw] md:w-[420px]"
                style={{ height: 480 }}
              >
                <AnimatePresence mode="popLayout">
                  {offers.slice(currentIndex, currentIndex + 2).map((offer, i) => (
                    <SwipeCard
                      key={offer.id}
                      offer={offer}
                      isTop={i === 0}
                      onSwipe={swipe}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Action buttons */}
            {!noMore && (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => swipe('DISLIKE')}
                  aria-label="Passer cette offre"
                  className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center shadow-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Annuler le dernier swipe"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:border-brand-400 hover:text-brand-600 flex items-center justify-center shadow-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => swipe('LIKE')}
                  aria-label="J'aime cette offre"
                  className="w-14 h-14 rounded-full bg-white border-2 border-brand-200 text-brand-500 hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50 flex items-center justify-center shadow-sm transition"
                >
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Match popup */}
      <AnimatePresence>
        {matchResult && (
          <MatchPopup
            offer={matchResult.offer}
            message={matchResult.message}
            onContinue={clearMatch}
            onGoToMatches={() => { clearMatch(); navigate('/candidate/matches') }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
