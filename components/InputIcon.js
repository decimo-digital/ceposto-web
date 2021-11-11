import React, { useState } from 'react'

import Icon, { icons } from 'components/Icon'

const InputIcon = ({ className = '', onFileChange }) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <input type='file' onChange={onFileChange} />
    </div>
  )
}

export default InputIcon
