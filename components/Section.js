import React from 'react'
import PropTypes from 'prop-types'

const Section = ({
  id,
  title = '',
  border = '',
  centerSectionTitle = false,
  fullbleed = false,
  noborder = false,
  ...props
}) => {
  return (
    <section
      id={id}
      className={`flex flex-col py-8 ${border} md:flex-row ${
        fullbleed ? 'full-bleed' : ''
      } ${noborder ? '' : 'border-t'}`}
    >
      {title.trim() !== '' && (
        <div
          className={`${
            centerSectionTitle ? 'self-center' : ''
          } w-full pb-3 md:w-1/3 md:pb-0`}
        >
          <h2 className="font-medium text-gray-500">{title}</h2>
        </div>
      )}
      <div className={`flex flex-col flex-1 ${fullbleed ? 'full-bleed' : ''} `}>
        {props.children}
      </div>
    </section>
  )
}

Section.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  border: PropTypes.string
}

export default Section
