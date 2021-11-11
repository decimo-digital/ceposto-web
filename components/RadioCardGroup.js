import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'

import Card from './Card'

const RadioCardGroup = (props) => {
  const first = 0
  const last = props.children.length - 1

  return (
    <div className="flex flex-col w-full sm:flex-row" id={props.id}>
      {props.children.map((radioCard, index) => {
        let styleVariant = 'flex-grow h-full '
        if (index === first)
          styleVariant += `${
            radioCard.props.selected
              ? 'border-3 border-green-500 text-green-500'
              : 'border-t border-b-0 border-l border-r sm:border-r-0 sm:border-b'
          } rounded-tl-md rounded-tr-md rounded-bl-none sm:rounded-tr-none sm:rounded-bl-md`
        else if (index === last)
          styleVariant += `${
            radioCard.props.selected
              ? 'border-3 border-green-500 text-green-500'
              : 'border-t border-b border-r border-l'
          } rounded-bl-md rounded-br-md rounded-tr-none sm:rounded-bl-none sm:rounded-tr-md`
        else
          styleVariant += `${
            radioCard.props.selected
              ? 'border-3 border-green-500 text-green-500'
              : 'border-l border-r border-b-0 border-t sm:border-t sm:border-b sm:border-r-0'
          } rounded-none`

        return cloneElement(radioCard, {
          className: styleVariant,
          isInGroup: true,
          key: index
        })
      })}
    </div>
  )
}

RadioCardGroup.propTypes = {
  id: PropTypes.string,
  children: PropTypes.arrayOf(Card)
}

export default RadioCardGroup
