function DatePicker({ id, max, value, onChange, required = true }) {
  return (
    <input
      id={id}
      type="date"
      required={required}
      className="p-2 border border-gray-300 rounded-md focus:shadow-outline"
      max={max}
      value={value}
      onChange={onChange}
    />
  )
}

export default DatePicker
