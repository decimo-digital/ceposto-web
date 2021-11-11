import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const InputInTable = ({
  id,
  value,
  onChange,
  onBlur,
  className = '',
  type = 'text',
  label = '',
  isRequired = true,
  isValid = true,
  invalidText = 'Invalid prop',
  isModified = false,
  ...props
}) => {
  const [inputType, setInputType] = useState(
    type !== 'currency' ? type : 'number'
  )
  return (
    <input
      id={id}
      type={inputType}
      min={type === 'currency' ? 0 : undefined}
      step={type === 'currency' ? 0.01 : 1}
      className={`${className} p-2 rounded-md border border-gray-300 ${
        isValid ? '' : 'border-red-400 border-t border-b border-l pl-2 py-2'
      } ${isModified ? 'bg-yellow-400' : ''}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isValid={isValid}
      isModified={isModified}
      {...props}
    />
  )
}

InputInTable.displayName = 'Input'

InputInTable.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'currency']),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isValid: PropTypes.bool,
  invalidText: PropTypes.string,
  isModified: PropTypes.bool
}

export default InputInTable
