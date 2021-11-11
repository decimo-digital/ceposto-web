import { motion } from 'framer-motion'

import Button from 'components/Button'

function PhaseFour({ variants, handleSubmit }) {
  return (
    <motion.div
      variants={variants}
      initial='enterExpand'
      animate='centerExpand'
      exit='exit'
      className={`
        flex flex-col rounded-md bg-white h-auto
        w-full max-w-md mx-auto shadow-md
        px-20 py-12
      `}
    >
      <img
        src='/confetti.svg'
        className='h-auto mb-12'
        alt='Benvenuto in Toduba!'
      />
      <h2 className='mb-12 text-3xl font-bold text-center text-yellow-600 sm:text-5xl'>
        Benvenuto in Toduba!
      </h2>
      <div className='space-y-8'>
        <p className='text-lg font-bold text-center text-gray-700'>
          Il tuo account è stato creato correttamente.
        </p>
        <p className='text-lg font-bold text-center text-gray-700'>
          Accedi e termina la configurazione.
        </p>
        <Button
          type='button'
          fullWidth={true}
          onClick={handleSubmit}
          variant='primary'
        >
          Entra
        </Button>
      </div>
    </motion.div>
  )
}

export default PhaseFour
