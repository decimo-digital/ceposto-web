import { motion } from 'framer-motion'

const Button = ({
  variant,
  type = 'submit',
  onClick,
  disabled = false,
  children,
  fullWidth = false,
  fullHeight = false,
  upperCase = false,
  className = '',
  noRoundTop = false,
  noRoundDown = false
}) => {
  let style = ' '

  switch (variant) {
    case 'primary':
      style += `bg-black shadow text-white ${!disabled ? 'hover:bg-gray-700' : 'opacity-50'
        }`
      break
    case 'google':
      style += `bg-red-400 text-white shadow'
        }`
      break
    case 'secondary':
      style += `border-2 border-green-500 bg-white text-green-500 ${!disabled ? '' : 'opacity-50'
        }`
      break
    case 'refuse':
      style += `bg-red-500 text-white ${!disabled ? 'hover:bg-red-400' : 'opacity-50'
        }`
      break
    case 'destructive':
      style += `border-2 border-red-500 text-red-500 ${!disabled ? '' : 'opacity-50'
        }`
      break
    case 'checkBox':
      style += `border-2 bg-white ${!disabled ? 'hover:bg-black hover:text-white' : 'opacity-50'
        }`
      break
    default:
      style += 'hover:bg-gray-100'
      break
  }

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      onClick={onClick}
      className={`${style} ${disabled ? 'cursor-not-allowed' : ''
        } ${noRoundDown
          ? 'rounded-tl-md rounded-tr-md '
          : noRoundTop
            ? 'rounded-b-md'
            : 'rounded-md '} 
        px-4 py-2 ${upperCase ? 'uppercase' : ''} ${fullWidth ? 'w-full' : 'w-full sm:w-auto'
        } ${fullHeight ? 'h-full' : 'h-auto'} ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default Button
