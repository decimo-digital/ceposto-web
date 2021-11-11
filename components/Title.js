import React from 'react'

const Title = ({
  text = '',
  type = 'primary',
  border = false
}
) => {
  let size = 'text-5xl'
  switch (type) {
    case 'primary': {
      size = 'text-base sm:text-base md:text-2xl lg:text-3xl xl:text-5xl'
      break;
    }
    case 'secondary': {
      size = 'text-base sm:text-base md:text-l lg:text-xl xl:text-3xl'
      break;
    }
    default:
  }
  return (
    <h1 className={`flex font-bold ${border ? 'border-b-3' : ''} py-3 ${size}`}> {text}</h1 >
  )
}

export default Title
