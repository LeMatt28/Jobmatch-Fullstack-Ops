import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/Button'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center px-4 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center gap-6 max-w-md">

        {/* Logo */}
        <motion.div variants={item}>
          <div className="w-24 h-24 rounded-3xl bg-brand-600 flex items-center justify-center mb-2 mx-auto shadow-2xl">
            <span className="text-4xl font-black text-white">JM</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">JobMatch</h1>
        </motion.div>

        {/* Taglines */}
        <motion.div variants={item}>
          <p className="text-xl font-semibold text-white/90">Trouvez votre match professionnel</p>
          <p className="text-sm text-brand-300 mt-1">Swipez les offres qui vous correspondent vraiment</p>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={item} className="flex gap-3 w-full">
          <Link to="/register/candidate" className="flex-1">
            <Button variant="primary" className="w-full bg-white text-brand-900 hover:bg-brand-50">
              Je suis candidat
            </Button>
          </Link>
          <Link to="/register/company" className="flex-1">
            <Button variant="secondary" className="w-full border-white text-white hover:bg-white/10">
              Je suis une entreprise
            </Button>
          </Link>
        </motion.div>

        {/* Login link */}
        <motion.p variants={item} className="text-brand-300 text-sm">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
