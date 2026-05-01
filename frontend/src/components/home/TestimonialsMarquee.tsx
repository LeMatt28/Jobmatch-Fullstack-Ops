'use client'

import React from 'react'

interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
  color: string
}

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[]
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  // Triple pour un loop parfaitement fluide
  const items = [...testimonials, ...testimonials, ...testimonials]

  return (
    <div
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
      aria-hidden="true"
    >
      <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <figure
            key={i}
            className="w-72 sm:w-80 shrink-0 card p-5 flex flex-col gap-4"
          >
            <blockquote className="text-sm text-text-primary leading-relaxed flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full ${t.color} flex items-center justify-center text-xs font-bold shrink-0`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
