import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 12000, suffix: '+', label: 'Candidats actifs' },
  { value: 850, suffix: '+', label: 'Entreprises partenaires' },
  { value: 94, suffix: '%', label: 'Satisfaction' },
  { value: 48, suffix: 'h', label: 'Délai moyen de match' },
]

function useCountUp(target, duration = 1500, active = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])

  return count
}

function StatItem({ value, suffix, label, active, isLast }) {
  const count = useCountUp(value, 1500, active)
  const display = value >= 1000 ? `${(count / 1000).toFixed(count >= value ? 0 : 1)}k` : count

  return (
    <div className={`flex-1 text-center py-6 ${!isLast ? 'border-b md:border-b-0 md:border-r border-brand-800' : ''}`}>
      <p className="text-4xl font-black text-white">
        {display}{suffix}
      </p>
      <p className="text-sm text-brand-200 mt-1">{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-brand-900 py-14" aria-label="Chiffres clés">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row divide-y md:divide-y-0">
        {STATS.map((s, i) => (
          <StatItem key={s.label} {...s} active={active} isLast={i === STATS.length - 1} />
        ))}
      </div>
    </section>
  )
}
