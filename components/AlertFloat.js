import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Icon, { icons } from './Icon'
import isObjectEmpty from 'utils/isObjectEmpty'

const infoTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

const AlertFloat = props => {
  let color

  switch (props.alert.type) {
    case infoTypes.SUCCESS:
      color = 'bg-green-800'
      break
    case infoTypes.ERROR:
      color = 'bg-red-800'
      break
    case infoTypes.WARNING:
      color = 'bg-yellow-800'
      break
    case infoTypes.INFO:
      color = 'bg-teal-800'
      break
    default:
      break
  }

  useEffect(() => {
    if (!isObjectEmpty(props.alert)) {
      let letTimer = setTimeout(() => {
        props.setAlert({})
      }, 10000)

      return () => {
        clearTimeout(letTimer)
      }
    }
  }, [props.alert])

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.4 }}
      style={{ zIndex: 99999 }}
      className='container fixed bottom-0 mx-auto inset-x-0 mb-4 z-10'
    >
      <div className={`relative ${color} p-4 rounded text-white`}>
        <h2 className='text-xl sm:text-2xl font-bold'>{props.alert.title}</h2>
        <p>{props.alert.body}</p>
        <button
          type='button'
          className='absolute right-0 top-0 m-2'
          onClick={() => {
            props.setAlert({})
          }}
        >
          <Icon
            name={icons.ERROR}
            color={{
              primary: 'text-transparent',
              secondary: 'text-white',
            }}
          />
        </button>
      </div>
    </motion.div>
  )
}

export default AlertFloat
