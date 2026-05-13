import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '①',
    title: 'Créez votre profil',
    duration: '5 minutes',
    desc: 'Compétences, salaire attendu, mode de travail. Sans CV obligatoire.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" aria-hidden="true">
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '②',
    title: 'Swipez les offres',
    duration: 'Aussi simple que Tinder',
    desc: "Like ce qui vous attire. Passez ce qui ne colle pas.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" aria-hidden="true">
        <path d="M8 20h8M24 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 12l6 8-6 8M18 12l-6 8 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '③',
    title: 'Recevez vos matchs',
    duration: "En moyenne 48h",
    desc: "Quand c'est réciproque, l'IA vous explique pourquoi et vous met en relation.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" aria-hidden="true">
        <path d="M20 34l-2.5-2.27C8 22.54 2 17.12 2 10.5 2 5.42 5.92 1.5 11 1.5c2.76 0 5.41 1.29 7 3.33C19.59 2.79 22.24 1.5 25 1.5c5.08 0 9 3.92 9 9 0 6.62-6 12.04-15.5 21.23L20 34z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-white py-20" aria-label="Comment ça marche">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Simple. Humain. Efficace.</h2>
        <p className="text-gray-500 mb-14">Trois étapes pour trouver votre prochain poste.</p>

        <div ref={ref} className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-0.5 bg-brand-100" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center gap-4 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center relative z-10">
                {step.icon}
              </div>
              <div>
                <span className="inline-block bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full border border-brand-100 mb-2">
                  {step.duration}
                </span>
                <p className="font-bold text-gray-900 text-base mb-1">{step.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
