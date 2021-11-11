import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import Container from './Container'

const SectionGroup = ({ id, children, title }) => {
  const first = 0
  const last = children.length - 1

  return (
    <div className="flex flex-col mt-8" id={id}>
      <h1 className="text-2xl font-bold text-green-500">{title}</h1>
      {children}
    </div>
  )
}

SectionGroup.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string
}

export default SectionGroup
