const Switch = ({
  id = '',
  name = '',
  togglable = true,
  onClick,
  toggled,
  disabled
}) => (
  <div
    className="relative inline-block w-10"
    onClick={togglable ? onClick : () => { }}
  >
    <input
      readOnly={true}
      disabled={disabled}
      checked={toggled}
      type="checkbox"
      id={id}
      name={name}
      className={`
        absolute block w-6 h-6 
        ${toggled ? 'left-0' : 'right-0'} rounded-full
        ${toggled ? 'bg-green-500' : 'bg-gray-400'} 
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}
        appearance-none cursor-pointer focus:shadow-outline
      `}
    />
    <label
      htmlFor={id}
      className={`block h-6 overflow-hidden bg-white border rounded-full cursor-pointer ${disabled ? 'cursor-not-allowed' : 'opacity-100'}`}
    />
  </div >
)

export default Switch
