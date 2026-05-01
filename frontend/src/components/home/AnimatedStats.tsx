'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Stat {
  end: number
  suffix: string
  label: string
  separator?: boolean
}

function useCountUp(end: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime: number | null = null

    const tick = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, end, duration])

  return value
}

function StatItem({ end, suffix, label, separator, active }: Stat & { active: boolean }) {
  const count = useCountUp(end, 1600, active)

  const formatted = separator
    ? count.toLocaleString('fr-FR')
    : count.toString()

  return (
    <div>
      <dt className="text-3xl font-bold text-primary tabular-nums">
        {formatted}{suffix}
      </dt>
      <dd className="mt-1 text-sm text-text-secondary">{label}</dd>
    </div>
  )
}

interface AnimatedStatsProps {
  stats: Stat[]
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <dl ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} active={active} />
      ))}
    </dl>
  )
}
