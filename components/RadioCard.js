import React from 'react'
import PropTypes from 'prop-types'

import Card from './Card'

const RadioCard = ({
  id,
  className,
  selected,
  onClick,
  isInGroup = false,
  children,
  disabled = false
}) => (
  <button
    className="w-full focus:outline-none focus:shadow-outline flex-grow relative"
    type="button"
    id={id}
    onClick={onClick}
    disabled={disabled}
  >
    <Card
      className={`border-gray-300 ${
        !isInGroup
          ? selected
            ? 'border-green-500 text-green-500 border-3'
            : 'border'
          : ''
      } 
        ${
          disabled
            ? selected
              ? 'cursor-not-allowed'
              : 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        } flex flex-col justify-center ${className}`}
    >
      {children}
    </Card>
  </button>
)

RadioCard.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node
}

export default RadioCard
