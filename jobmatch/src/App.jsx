import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { Spinner } from './components/ui/Spinner'

const LandingPage       = React.lazy(() => import('./pages/auth/LandingPage'))
const Login             = React.lazy(() => import('./pages/auth/Login'))
const RegisterCandidate = React.lazy(() => import('./pages/auth/RegisterCandidate'))
const RegisterCompany   = React.lazy(() => import('./pages/auth/RegisterCompany'))
const ProfileSetup      = React.lazy(() => import('./pages/candidate/ProfileSetup'))
const SwipeFeed         = React.lazy(() => import('./pages/candidate/SwipeFeed'))
const MatchList         = React.lazy(() => import('./pages/candidate/MatchList'))
const CandidateProfile  = React.lazy(() => import('./pages/candidate/CandidateProfile'))
const CompanyDetail     = React.lazy(() => import('./pages/candidate/CompanyDetail'))
const Dashboard         = React.lazy(() => import('./pages/company/Dashboard'))
const CreateOffer       = React.lazy(() => import('./pages/company/CreateOffer'))
const MatchedCandidates = React.lazy(() => import('./pages/company/MatchedCandidates'))
const CompanyProfile    = React.lazy(() => import('./pages/company/CompanyProfile'))
const PremiumCandidate  = React.lazy(() => import('./pages/premium/PremiumCandidate'))
const PremiumCompany    = React.lazy(() => import('./pages/premium/PremiumCompany'))
const CheckoutPage      = React.lazy(() => import('./pages/premium/CheckoutPage'))
const SuccessPage       = React.lazy(() => import('./pages/premium/SuccessPage'))
const Settings          = React.lazy(() => import('./pages/Settings'))
const AdminDashboard    = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCandidates   = React.lazy(() => import('./pages/admin/AdminCandidates'))
const AdminCompanies    = React.lazy(() => import('./pages/admin/AdminCompanies'))
const AdminOffers       = React.lazy(() => import('./pages/admin/AdminOffers'))
const AdminMatches      = React.lazy(() => import('./pages/admin/AdminMatches'))
const AdminSubscriptions = React.lazy(() => import('./pages/admin/AdminSubscriptions'))

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register/candidate" element={<AnimatedPage><RegisterCandidate /></AnimatedPage>} />
          <Route path="/register/company" element={<AnimatedPage><RegisterCompany /></AnimatedPage>} />

          {/* Premium */}
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

          {/* Admin protected */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/candidates" element={<ProtectedRoute requiredRole="admin"><AdminCandidates /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute requiredRole="admin"><AdminCompanies /></ProtectedRoute>} />
          <Route path="/admin/offers" element={<ProtectedRoute requiredRole="admin"><AdminOffers /></ProtectedRoute>} />
          <Route path="/admin/matches" element={<ProtectedRoute requiredRole="admin"><AdminMatches /></ProtectedRoute>} />
          <Route path="/admin/subscriptions" element={<ProtectedRoute requiredRole="admin"><AdminSubscriptions /></ProtectedRoute>} />

          {/* Shared */}
          <Route path="/settings" element={<ProtectedRoute><AnimatedPage><Settings /></AnimatedPage></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
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
