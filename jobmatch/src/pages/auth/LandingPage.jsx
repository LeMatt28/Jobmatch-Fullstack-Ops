import { Link } from 'react-router-dom'
import { SEOHead } from '../../components/ui/SEOHead'
import HeroSection from '../../components/landing/HeroSection'
import StatsSection from '../../components/landing/StatsSection'
import HowItWorks from '../../components/landing/HowItWorks'
import ScoreSection from '../../components/landing/ScoreSection'
import RecruiterSection from '../../components/landing/RecruiterSection'
import ReviewsCarousel from '../../components/landing/ReviewsCarousel'
import PricingSection from '../../components/landing/PricingSection'
import FAQSection from '../../components/landing/FAQSection'
import CTASection from '../../components/landing/CTASection'
import LandingFooter from '../../components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead page="landing" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-black text-brand-900 text-xl tracking-tight">JobMatch</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">Connexion</Link>
          <Link to="/register/candidate" className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-800 transition">Commencer</Link>
        </div>
      </nav>

      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <ScoreSection />
        <RecruiterSection />
        <ReviewsCarousel />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  )
}
