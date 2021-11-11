import { motion, AnimatePresence } from 'framer-motion'

const MobileMenu = props => {
  return (
    <motion.div
      key='mobileMenu'
      initial={{ left: '-100vw' }}
      animate={{ left: 0 }}
      exit={{ left: '-100vw' }}
      className='absolute top-0 right-0 z-50 block w-full h-screen bg-white shadow-lg menu-slider sm:hidden'
    >
      <nav className='flex flex-col w-full'>{props.children}</nav>
    </motion.div>
  )
}

export default MobileMenu
