import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { useEffect, useState } from 'react'

import tailwind from 'tailwind.config.js'

const selectTheme = (theme) => ({
  ...theme,
  borderRadius: '6px',
  border: `1px solid ${tailwind.theme.colors.gray[400]}`,
  colors: {
    ...theme.colors,
    primary25: tailwind.theme.colors.green[100],
    primary50: tailwind.theme.colors.green[200],
    primary75: tailwind.theme.colors.green[200],
    primary: tailwind.theme.colors.green[200]
  }
})
const selectStyle = {
  control: (provided) => ({
    ...provided,
    padding: '0.125rem'
  }),
  input: (provided) => ({
    ...provided,
    width: 100
  }),
  placeholder: (provided) => ({
    ...provided,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  })
}

const Dropdown = ({
  handleChange,
  name,
  options = [],
  value = '',
  disabled = false,
  isClearable = false
}) => (
  <Select
    isClearable={isClearable}
    options={options}
    value={options.filter((option) => option.value === value)[0]}
    placeholder="Cerca..."
    styles={selectStyle}
    isDisabled={disabled}
    onChange={(change) => {
      handleChange(name, change?.value ?? '')
    }}
    theme={selectTheme}
  />
)

const MapsDropdown = ({
  handleChange,
  name = '',
  initialValue,
  placeholder = 'Cerca...'
}) => {
  const [value, setValue] = useState(initialValue)

  const filterAddresses = async (inputValue) => {
    if (inputValue !== '') {
      const { data } = await axios({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${inputValue}&types=establishment&inputtype=textquery&key=${process.env.NEXT_PUBLIC_MAPS_SECRET}&components=country:IT`,
        transformResponse: (response) => {
          const { results } = JSON.parse(response)

          if (results !== [])
            return results.map((result) => {
              const addressComponents = result.address_components
              const geometry = result.geometry

              let streetNumber, route, city, province, postalCode, lat, long
              try {
                streetNumber = addressComponents.filter((addressComponent) =>
                  addressComponent.types.includes('street_number')
                )[0].long_name
              } catch {
                streetNumber = ''
              }

              try {
                route = addressComponents.filter((addressComponent) =>
                  addressComponent.types.includes('route')
                )[0].long_name
              } catch {
                route = ''
              }

              try {
                city = addressComponents.filter((addressComponent) =>
                  addressComponent.types.includes('administrative_area_level_3')
                )[0].long_name
              } catch {
                city = ''
              }

              try {
                province = addressComponents.filter((addressComponent) =>
                  addressComponent.types.includes('administrative_area_level_2')
                )[0].short_name
              } catch {
                province = ''
              }

              try {
                postalCode = addressComponents.filter((addressComponent) =>
                  addressComponent.types.includes('postal_code')
                )[0].short_name
              } catch {
                postalCode = ''
              }

              try {
                lat = geometry.location.lat
                long = geometry.location.lng
              } catch {
                lat = ''
                long = ''
              }

              const street = `${route}, ${streetNumber}`

              const label = result.formatted_address
              const value = { street, city, province, postalCode, lat, long }

              return {
                label,
                value
              }
            })
          else return results
        }
      })

      return data
    } else return ''
  }

  let ref = {}

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (
      typeof ref.select.select.state.inputIsHidden !== 'undefined' &&
      ref.select.select.state.inputIsHidden
    )
      ref.select.select.state.inputIsHidden = false
  }, [ref])

  const promiseOptions = (inputValue) =>
    new Promise((resolve) =>
      setTimeout(
        () => inputValue.length > 7 && resolve(filterAddresses(inputValue)),
        500
      )
    )

  const handleInputChange = (newValue, { action }) => {
    if (action === 'input-change') setValue(newValue)
  }

  return (
    <AsyncSelect
      ref={(_ref) => (ref = _ref)}
      placeholder={placeholder}
      noOptionsMessage={({ inputValue }) => 'Nessun risultato.'}
      loadingMessage={({ inputValue }) => 'Ricerca in corso...'}
      loadOptions={promiseOptions}
      styles={selectStyle}
      inputValue={value}
      onInputChange={handleInputChange}
      value={value}
      onChange={({ label, value }) => {
        setValue(label)

        return handleChange(name, value)
      }}
      name={name}
      theme={selectTheme}
    />
  )
}

export { Dropdown as default, MapsDropdown }
