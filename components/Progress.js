import React from 'react'
import PropTypes from 'prop-types'

const Progress = ({ steps, current }) => {
  let stepComponents = []
  for (let i = 0; i < steps; i++) {
    let stepColor = 'bg-gray-300'
    if (i === current) stepColor = 'bg-red-500'
    if (i < current) stepColor = 'bg-green-500'

    stepComponents.push(
      <span
        className={`rounded-full p-2 ${stepColor} flex-grow-0 border border-gray-400`}
        key={`step${i}`}
      />
    )
    if (i < steps - 1)
      stepComponents.push(
        <span className='flex-grow border border-gray-400' key={`rule${i}`} />
      )
  }

  return <div className='flex items-center w-full'>{stepComponents}</div>
}

Progress.propTypes = {
  steps: PropTypes.number,
  current: PropTypes.number,
}

export default Progress
