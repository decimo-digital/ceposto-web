import React from 'react'
import PropTypes from 'prop-types'

const checkboxLabelPositions = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
}

const CheckBox = ({ id, checked = false, label, onClick, disabled }) => {
  let containerFlexMode = ''
  let labelMargin = ''

  const { text = '', position = checkboxLabelPositions.RIGHT } = label
  switch (position) {
    case checkboxLabelPositions.TOP:
      containerFlexMode = 'flex-col items-center'
      labelMargin = 'mb-1'
      break
    case checkboxLabelPositions.RIGHT:
      containerFlexMode = 'flex-row-reverse'
      labelMargin = 'ml-1'
      break
    case checkboxLabelPositions.BOTTOM:
      containerFlexMode = 'flex-col-reverse items-center'
      labelMargin = 'mt-1'
      break
    case checkboxLabelPositions.LEFT:
      containerFlexMode = 'flex-row'
      labelMargin = 'mr-1'
      break
    default:
      break
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`cursor-pointer flex ${containerFlexMode} ${
        disabled ? 'cursor-not-allowed opacity-30' : 'opacity-100'
      }`}
      onClick={onClick}
    >
      <label
        className={`${labelMargin} text-gray-700 ${
          disabled ? 'cursor-not-allowed ' : 'cursor-pointer'
        }`}
        htmlFor={id}
      >
        {text}
      </label>
      <span
        id={id}
        className={`${
          disabled
            ? ''
            : 'focus:outline-none focus:shadow-outline hover:shadow-outline'
        } bg-white border-2 border-gray-600 w-6 h-6 rounded-md flex-shrink-0 ${
          checked && 'bg-white border-8 border-green-600'
        }`}
      />
    </button>
  )
}

CheckBox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  checked: PropTypes.bool,
  label: PropTypes.shape({
    text: PropTypes.string,
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
  })
}

export { CheckBox as default, checkboxLabelPositions }
