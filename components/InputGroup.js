import { Children } from 'react'

const InputGroup = ({
  children,
  labelText = 'Input',
  labelClass = 'text-gray-700',
  containerClass = '',
  alertClass = '',
  invalidFlag = false,
  invalidText = 'Errore',
  isRequired = true
}) => {
  const input = Children.toArray(children)[0]
  const childrenCount = Children.count(children)

  return (
    <div className={`flex flex-col ${containerClass}`}>
      <label className={labelClass} htmlFor={input.props.id}>
        {labelText}
        {isRequired && <span className="text-red-800"> *</span>}
      </label>
      {childrenCount > 1 ? <div className="flex">{children}</div> : children}
      {invalidFlag && (
        <div
          className={`${alertClass} mt-2 w-full bg-red-100 text-white p-2 rounded-md`}
        >
          {invalidText}
        </div>
      )}
    </div>
  )
}

export default InputGroup
