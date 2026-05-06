import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

// Auth pages
import LandingPage from './pages/auth/LandingPage'
import Login from './pages/auth/Login'
import RegisterCandidate from './pages/auth/RegisterCandidate'
import RegisterCompany from './pages/auth/RegisterCompany'

// Candidate pages
import ProfileSetup from './pages/candidate/ProfileSetup'
import SwipeFeed from './pages/candidate/SwipeFeed'
import MatchList from './pages/candidate/MatchList'
import CandidateProfile from './pages/candidate/CandidateProfile'
import CompanyDetail from './pages/candidate/CompanyDetail'

// Company pages
import Dashboard from './pages/company/Dashboard'
import CreateOffer from './pages/company/CreateOffer'
import MatchedCandidates from './pages/company/MatchedCandidates'
import CompanyProfile from './pages/company/CompanyProfile'

// Premium pages
import PremiumCandidate from './pages/premium/PremiumCandidate'
import PremiumCompany from './pages/premium/PremiumCompany'
import CheckoutPage from './pages/premium/CheckoutPage'
import SuccessPage from './pages/premium/SuccessPage'

// Messages
import MessageList from './pages/messages/MessageList'
import Conversation from './pages/messages/Conversation'

// Shared
import Settings from './pages/Settings'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: '100vh' }}>
      {children}
    </motion.div>
  )
}

function PremiumRedirect() {
  const { role } = useAuth()
  if (role === 'company') return <Navigate to="/premium/company" replace />
  return <Navigate to="/premium/candidate" replace />
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register/candidate" element={<AnimatedPage><RegisterCandidate /></AnimatedPage>} />
        <Route path="/register/company" element={<AnimatedPage><RegisterCompany /></AnimatedPage>} />

        {/* Premium (public-ish, accessible sans auth) */}
        <Route path="/premium" element={<AnimatedPage><PremiumRedirect /></AnimatedPage>} />
        <Route path="/premium/candidate" element={<AnimatedPage><PremiumCandidate /></AnimatedPage>} />
        <Route path="/premium/company" element={<AnimatedPage><PremiumCompany /></AnimatedPage>} />
        <Route path="/premium/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
        <Route path="/premium/success" element={<AnimatedPage><SuccessPage /></AnimatedPage>} />

        {/* Candidate protected */}
        <Route path="/candidate/setup" element={<ProtectedRoute requiredRole="candidate"><AnimatedPage><ProfileSetup /></AnimatedPage></ProtectedRoute>} />
        <Route path="/candidate/feed" element={<ProtectedRoute requiredRole="candidate"><AnimatedPage><SwipeFeed /></AnimatedPage></ProtectedRoute>} />
        <Route path="/candidate/matches" element={<ProtectedRoute requiredRole="candidate"><AnimatedPage><MatchList /></AnimatedPage></ProtectedRoute>} />
        <Route path="/candidate/profile" element={<ProtectedRoute requiredRole="candidate"><AnimatedPage><CandidateProfile /></AnimatedPage></ProtectedRoute>} />
        <Route path="/company/:id" element={<ProtectedRoute requiredRole="candidate"><AnimatedPage><CompanyDetail /></AnimatedPage></ProtectedRoute>} />

        {/* Company protected */}
        <Route path="/company/dashboard" element={<ProtectedRoute requiredRole="company"><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/company/offer/new" element={<ProtectedRoute requiredRole="company"><AnimatedPage><CreateOffer /></AnimatedPage></ProtectedRoute>} />
        <Route path="/company/offer/:id/matches" element={<ProtectedRoute requiredRole="company"><AnimatedPage><MatchedCandidates /></AnimatedPage></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute requiredRole="company"><AnimatedPage><CompanyProfile /></AnimatedPage></ProtectedRoute>} />

        {/* Messages (candidat + entreprise) */}
        <Route path="/messages" element={<ProtectedRoute><AnimatedPage><MessageList /></AnimatedPage></ProtectedRoute>} />
        <Route path="/messages/:matchId" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/settings" element={<ProtectedRoute><AnimatedPage><Settings /></AnimatedPage></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
