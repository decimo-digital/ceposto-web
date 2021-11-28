import {
  DialogContent as ReachDialogContent,
  DialogOverlay as ReachDialogOverlay
} from '@reach/dialog'
import { motion, AnimatePresence } from 'framer-motion'

const Dialog = ({ isOpen, handleDismiss, children, ...props }) => {
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
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <ReachDialogContent {...props} style={{ borderRadius: '6px', width: '400px' }}>
              {children}
            </ReachDialogContent>
          </motion.div>
        </ReachDialogOverlay>
      )}
    </AnimatePresence>
  )
}

export default Dialog
