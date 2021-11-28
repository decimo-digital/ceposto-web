import { Field } from 'formik'
import InputGroup from './InputGroup'

const ContractInfoSection = (props) => {
  const {
    invalid = false,
    disabled = false,
    contract,
    className,
    name,
    scope,
    value = null
  } = props

  let discount, service_cost
  try {
    discount = contract.convention_code.discount
    service_cost = contract.convention_code.service_cost
  } catch { }

  return (
    <div
      className={`
        flex flex-col min-h-full justify-between sm:flex-row
        space-y-8 sm:space-y-0 sm:space-x-8 
      `}
    >
      <InputGroup
        labelText="Valore del buono"
        containerclassName="w-full"
        alertclassName="w-full"
        invalidFlag={invalid}
        invalidText="Inserire un valore valido"
      >
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl text-gray-500">&euro;</span>
          <Field
            value={value}
            type="number"
            className="w-40 text-6xl leading-none text-green-500 bg-transparent"
            id="ticketValue"
            name={name}
            placeholder="1"
            min="1"
            step="0.01"
            disabled={disabled}
          />
        </div>
      </InputGroup>

      {/* <div className="flex w-full">
        <div className="flex flex-col justify-between min-h-full">
          <label htmlFor="appliedConditions" className="text-gray-700">
            Condizioni applicate
          </label>
          <div id="appliedConditions" className="mb-0 sm:mb-2">
            <ul>
              {discount !== 0 && (
                <li>
                  <span className="font-bold">{discount}</span>% sconto
                </li>
              )}
              <li>
                <span className="font-bold">{service_cost}</span>% costi di
                servizio
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ContractInfoSection
