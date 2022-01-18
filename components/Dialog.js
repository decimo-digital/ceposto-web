import {
  DialogContent as ReachDialogContent,
  DialogOverlay as ReachDialogOverlay
} from '@reach/dialog'
import { motion, AnimatePresence } from 'framer-motion'

const Dialog = ({ isOpen, handleDismiss, children, type, ...props }) => {
  let width = '400px'
  switch (type) {
    case 'menu':
      width = '750px'
      break
    case 'prenotation':
      width = '650px'
      break
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <ReachDialogOverlay
          style={{ zIndex: 9999 }}
          isOpen={isOpen}
          onDismiss={handleDismiss}
        >
          <motion.div
            key="modal"
            transition={{ duration: 0.3 }}
            initial={type == 'menu' ? {} : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ReachDialogContent {...props} style={{ borderRadius: '6px', width: width }}>
              {children}
            </ReachDialogContent>
          </motion.div>
        </ReachDialogOverlay>
      )}
    </AnimatePresence>
  )
}

export default Dialog
