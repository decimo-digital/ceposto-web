import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Icon, { icons } from 'components/Icon'

const Input = ({
  id,
  value,
  onChange,
  onBlur,
  className = '',
  type = 'text',
  label = '',
  isRequired = true,
  isInvalid = false,
  invalidText = 'Invalid prop',
  ...props
}) => {
  const [inputType, setInputType] = useState(
    type !== 'currency' ? type : 'number'
  )

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-gray-700" htmlFor={id}>
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      <div
        className={`border-gray-300 bg-white
        ${className.includes('border') ? '' : 'border'
          } flex items-center rounded-md`}
      >
        {type === 'email' && (
          <span className="p-2 bg-gray-200">
            <Icon name={icons.AT} />
          </span>
        )}
        {type === 'currency' && (
          <span className="p-2 bg-gray-200">
            <Icon name={icons.CURRENCY_EUR} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          min={type === 'currency' ? 0 : undefined}
          step={type === 'currency' ? 0.01 : 1}
          className="w-full p-2 focus:outline-none focus:shadow-outline text-black rounded-md"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="h-full p-2 ml-1 bg-white focus:outline-none focus:shadow-outline"
            onClick={(e) =>
              setInputType(inputType === 'password' ? 'text' : 'password')
            }
          >
            <Icon
              name={inputType === 'text' ? icons.EYE_CLOSED : icons.EYE_OPEN}
            />
          </button>
        )}
      </div>
      {isInvalid && (
        <div className="w-full p-2 mt-2 text-white bg-red-100 rounded-md">
          {invalidText}
        </div>
      )}
    </div>
  )
}

Input.displayName = 'Input'

Input.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'currency']),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isInvalid: PropTypes.bool,
  invalidText: PropTypes.string
}

export default Input
