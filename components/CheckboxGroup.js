import CheckBox, { checkboxLabelPositions } from './Checkbox'

const CheckboxGroup = ({ id = '', checkboxes = [], handleClick, disabled }) => (
  <div id={id} className='flex justify-between mb-2 space-x-4'>
    {checkboxes.map((checkbox, index) => (
      <div className='flex flex-col items-center' key={index}>
        <CheckBox
          id={index}
          label={{ position: checkboxLabelPositions.TOP, text: checkbox.label }}
          disabled={disabled}
          checked={checkbox.checked == true}
          onClick={() => handleClick(index)}
        />
      </div>
    ))}
  </div>
)

export default CheckboxGroup
