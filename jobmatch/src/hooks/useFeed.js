import { useState } from 'react'
import { mockOffers } from '../mocks/offers'
import { swipeOffer } from '../services/candidateService'

export function useFeed() {
  const [offers] = useState(mockOffers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [matchResult, setMatchResult] = useState(null)
  const [history, setHistory] = useState([])

  const swipe = async (direction) => {
    if (currentIndex >= offers.length) return
    const offer = offers[currentIndex]
    const newLikeCount = direction === 'LIKE' ? likeCount + 1 : likeCount
    if (direction === 'LIKE') setLikeCount(newLikeCount)
    setHistory((h) => [...h, currentIndex])
    setCurrentIndex((i) => i + 1)
    try {
      const result = await swipeOffer(offer.id, direction, newLikeCount)
      if (result.matched) setMatchResult({ offer, message: result.message })
    } catch {
      // silently fail — swipe already moved visually
    }
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrentIndex(prev)
    if (likeCount > 0) setLikeCount((c) => c - 1)
  }

  const clearMatch = () => setMatchResult(null)

  return {
    offers,
    currentIndex,
    loading: false,
    error: null,
    swipe,
    undo,
    canUndo: history.length > 0,
    matchResult,
    clearMatch,
    remaining: Math.max(0, offers.length - currentIndex),
  }
}
