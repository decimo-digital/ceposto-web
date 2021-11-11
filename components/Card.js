import React from 'react'
import PropTypes from 'prop-types'

const Card = ({ id, className = '', children }) => (
  <div
    id={id}
    className={`${className.includes('border') ? '' : 'border'} ${
      className.includes('rounded') ? '' : 'rounded-md'
    } ${className} border-gray-300 p-4 bg-white w-full`}
  >
    {children}
  </div>
)

Card.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Card
