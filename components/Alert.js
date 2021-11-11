import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const infoTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

const Alert = ({ type, title, body = '', className, animate = false }) => {
  let color

  switch (type) {
    case infoTypes.SUCCESS:
      color = 'bg-green-100 text-green-900 border-green-400'
      break
    case infoTypes.ERROR:
      color = 'bg-red-100 text-red-900 border-red-400'
      break
    case infoTypes.WARNING:
      color = 'bg-yellow-100 text-yellow-900 border-yellow-400'
      break
    case infoTypes.INFO:
      color = 'bg-teal-100 text-teal-900 border-teal-400'
      break
    default:
      break
  }

  return (
    <motion.div
      animate={animate && { x: [0, -5, 5, -5, 5, 0] }}
      className={`shadow rounded-md border-t-4 w-full ${color} p-4 ${className}`}
    >
      <p className="font-bold">{title}</p>
      <p className="text">{body}</p>
    </motion.div>
  )
}

Alert.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  body: PropTypes.string,
  className: PropTypes.string,
  animate: PropTypes.bool
}

export default Alert
