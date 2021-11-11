import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import Icon, { icons } from 'components/Icon'

const FloatingLabelInput = ({
  id,
  value,
  onChange,
  onBlur,
  type = 'text',
  label = '',
  isRequired = true,
  isInvalid = false,
  invalidText = 'Invalid prop',
  disabled = false,
  ...props
}) => {
  const [fixLabelTop, setFixLabelTop] = useState(false)
  const [inputType, setInputType] = useState(
    type !== 'currency' ? type : 'number'
  )

  return (
    <div className='relative mt-6'>
      <motion.label
        htmlFor={id}
        animate={{ top: fixLabelTop ? '-1.5rem' : '0.5rem' }}
        transition={{ duration: 0.15 }}
        className={`absolute z-10 ml-2 text-gray-700 ${
          disabled ? 'cursor-not-allowed' : 'cursor-text'
        }`}
      >
        {label} {isRequired && <span className='text-red-800'>*</span>}
      </motion.label>
      <div className='flex flex-col'>
        <div className='flex'>
          <input
            id={id}
            className={`
              p-2 text-gray-600 border-b focus:outline-none flex-grow
          ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
          ${
            isInvalid
              ? 'border-red-400 focus:border-red-600'
              : 'border-gray-300 focus:border-gray-600'
          }`}
            value={value}
            onFocus={() => value.trim() === '' && setFixLabelTop(true)}
            onBlur={e => {
              if (value.trim() === '') setFixLabelTop(false)

              if (onBlur) onBlur(e)
            }}
            name='floating-label-input'
            onChange={onChange}
            disabled={disabled}
            type={inputType}
            {...props}
          />
          {type === 'password' && (
            <button
              type='button'
              className={`p-2 text-gray-600 border-b focus:outline-none flex-grow-0
              ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}
              ${
                isInvalid
                  ? 'border-red-400 focus:border-red-600'
                  : 'border-gray-300 focus:border-gray-600'
              }`}
              onClick={e =>
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
          <span className='ml-2 text-sm text-red-600'>{invalidText}</span>
        )}
      </div>
    </div>
  )
}

FloatingLabelInput.displayName = 'FloatingLabelInput'

FloatingLabelInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'currency']),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isInvalid: PropTypes.bool,
  invalidText: PropTypes.string,
  disabled: PropTypes.bool,
}

export default FloatingLabelInput
