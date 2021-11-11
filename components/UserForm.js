import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Field, Form, Formik } from 'formik'

import Input from 'components/Input'
import RadioCardGroup from 'components/RadioCardGroup'
import RadioCard from 'components/RadioCard'
import Button from 'components/Button'
import CheckboxGroup from 'components/CheckboxGroup'
import Icon, { icons } from 'components/Icon'
import Checkbox, { checkboxLabelPositions } from './Checkbox'
import AlertFloat from 'components/AlertFloat'
//Utility
import axiosRes from 'utils/axiosInstance'
import isObjectEmpty from 'utils/isObjectEmpty'
import ReactTooltip from 'react-tooltip'

import {
  isValidNameOrSurname,
  isValidEmail,
  isDuplicateEmail
} from 'utils/validation'

import { addUser, updateUser } from 'state/units/actions'
import { assetsCodeOptions, userRoles } from 'utils/enums'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

import Dialog from 'components/Dialog'
import Container from 'components/Container'
import { axiosUnits } from 'utils/axiosInstance'
import ContractInfoSection from './ContractInfoSection'

import { updateUnit } from 'state/units/actions'

const duplicateMailCheckStatuses = {
  CHECKING: 0,
  IS_DUPLICATE: 1,
  IS_NOT_DUPLICATE: 2
}

function UserForm({
  unit,
  onSuccessfulSubmit,
  onErrorSubmit,
  ticketsOptions,
  userToken,
  onClose,
  user = '',
  hasPiva = false
}) {
  const dispatch = useDispatch()
  const pivaStatus = isObjectEmpty(hasPiva) ? 1 : hasPiva.status_id

  let [duplicateEmail, setIsDuplicateEmail] = useState(() => {
    console.log('user', user)
    return user.id
      ? duplicateMailCheckStatuses.IS_NOT_DUPLICATE
      : duplicateMailCheckStatuses.CHECKING
  })
  let [selectedTicketOption, setSelectedTicketOption] = useState(
    user.id ? user.bpvalue : ticketsOptions[0]
  )

  const oldBpValue = user?.bpvalue?.ticket_value

  let [checkBp, setCheckBp] = useState(
    user.id ? user.balance.hasOwnProperty(assetsCodeOptions[0].value) : false
  )
  let [isInPendingBp, setIsInPendingBp] = useState(
    user?.balance?.hasOwnProperty(assetsCodeOptions[0].value)
      ? !user.balance[assetsCodeOptions[0].value].is_active
      : false
  )
  let [isInPendingTsr, setIsInPendingTsr] = useState(
    user?.balance?.hasOwnProperty(assetsCodeOptions[1].value)
      ? !user.balance[assetsCodeOptions[1].value].is_active
      : false
  )
  let [isInPendingGift, setIsInPendingGift] = useState(
    user?.balance?.hasOwnProperty(assetsCodeOptions[2].value)
      ? !user.balance[assetsCodeOptions[2].value].is_active
      : false
  )
  let [checkTsr, setCheckTsr] = useState(
    user.id ? user.balance.hasOwnProperty(assetsCodeOptions[1].value) : false
  )
  let [canRemoveTsr, setCanRemoveTsr] = useState(
    user.id ? !(user.balance[assetsCodeOptions[1].value]?.amount > 0) : true
  )
  let [canRefill, setCanRefill] = useState(pivaStatus ? false : true)
  let [checkGift, setCheckGift] = useState(
    user.id ? user.balance.hasOwnProperty(assetsCodeOptions[2].value) : false
  )
  let [canRemoveGift, setCanRemoveGift] = useState(
    user.id ? !(user.balance[assetsCodeOptions[2].value]?.amount > 0) : true
  )

  const userPresence = user?.presences
  let [presences, setPresences] = useState(
    typeof userPresence !== 'undefined'
      ? [
        { label: 'LUN', backend: 'MON', checked: userPresence.MON },
        { label: 'MAR', backend: 'TUE', checked: userPresence.TUE },
        { label: 'MER', backend: 'WED', checked: userPresence.WED },
        { label: 'GIO', backend: 'THU', checked: userPresence.THU },
        { label: 'VEN', backend: 'FRI', checked: userPresence.FRI },
        { label: 'SAB', backend: 'SAT', checked: userPresence.SAT },
        { label: 'DOM', backend: 'SUN', checked: userPresence.SUN }
      ]
      : [
        { label: 'LUN', backend: 'MON', checked: false },
        { label: 'MAR', backend: 'TUE', checked: false },
        { label: 'MER', backend: 'WED', checked: false },
        { label: 'GIO', backend: 'THU', checked: false },
        { label: 'VEN', backend: 'FRI', checked: false },
        { label: 'SAB', backend: 'SAT', checked: false },
        { label: 'DOM', backend: 'SUN', checked: false }
      ]
  )

  const checkBoxesIds = {
    BP: 0,
    SR: 1,
    CAN_REFILL: 2,
    PRESENCES: 3,
    BENEFIT: 4
  }

  function handleCheckbox(checkboxId, dayIndex) {
    switch (checkboxId) {
      case checkBoxesIds.BP: {
        setCheckBp(!checkBp)
        break
      }
      case checkBoxesIds.SR: {
        setCheckTsr(!checkTsr)
        break
      }
      case checkBoxesIds.CAN_REFILL: {
        setCanRefill(!canRefill)
        break
      }
      case checkBoxesIds.PRESENCES: {
        const newPresences = [...presences]
        newPresences[dayIndex].checked = newPresences[dayIndex].checked
          ? false
          : true
        setPresences(newPresences)
        break
      }
      case checkBoxesIds.BENEFIT:
        setCheckGift(!checkGift)
        break
    }
  }

  function getEmailValidationStatus(currentEmail) {
    if (duplicateEmail === duplicateMailCheckStatuses.IS_DUPLICATE)
      return (
        <div className="flex items-center px-2 py-2 space-x-4">
          <Icon
            name={icons.ERROR}
            color={{ primary: 'text-red-200', secondary: 'text-red-800' }}
          />
          <span>La mail inserita è già presente nel nostro sistema</span>
        </div>
      )

    if (duplicateEmail === duplicateMailCheckStatuses.IS_NOT_DUPLICATE)
      return (
        <div className="flex items-center px-2 py-2 space-x-4">
          <Icon
            name={icons.CHECK}
            color={{ primary: 'text-green-200', secondary: 'text-green-800' }}
          />
          <span>La mail inserita è valida</span>
        </div>
      )
  }

  let [showDeleteDialog, setShowDeleteDialog] = useState(false)
  let [showAddDialog, setShowAddDialog] = useState(false)
  let [bpValueId, setBpValueId] = useState(0)
  const [alert, setAlert] = useState({})

  function getInvalidTicketValue(ticketValue) {
    if (ticketValue?.toString().trim() == '' ?? false)
      return 'Inserire un valore di buono pasto valido'

    if (ticketValue > 25)
      return 'Inserire un valore di buono pasto valido (inferiore a 25)'

    const dupValues = ticketsOptions.filter(
      (value) =>
        value.ticket_value.toFixed(2) === Number(ticketValue).toFixed(2)
    )

    if (dupValues.length > 0)
      return 'Questo valore di buono pasto è già presente'

    return ''
  }

  return (
    <>
      {!isObjectEmpty(alert) && (
        <AlertFloat alert={alert} setAlert={setAlert} />
      )}
      <div className="grid col-gap-4 md:grid-cols-2 xl:grid-cols-2">
        <h2 className="text-xl font-medium">
          {user.id
            ? 'Aggiorna i dati del dipendente/collaboratore'
            : 'Inserisci dati del dipendente/collaboratore'}
        </h2>
        <div className="text-right -mt-2">
          <button type="button" className="relative" onClick={onClose}>
            <Icon
              name={icons.ERROR}
              color={{
                primary: 'text-transparent',
                secondary: 'text-black'
              }}
            />
          </button>
        </div>
      </div>

      <Formik
        initialValues={{
          identity_code: user.id ? user.identity_code : '',
          first_name: user.id ? user.first_name : '',
          last_name: user.id ? user.last_name : '',
          username: user.id ? user.username : '',
          phone: user.id ? String(user.phone).substr(3, user.phone.length) : ''
        }}
        validate={(values) => {
          const errors = {}
          if (!isValidNameOrSurname(values.last_name))
            errors.last_name = 'Inserire un cognome valido'
          if (!isValidNameOrSurname(values.first_name))
            errors.first_name = 'Inserire un nome valido'
          if (!isValidEmail(values.username))
            errors.username = 'Inserire un indirizzo mail valido'
          else {
            isDuplicateEmail(values.username, userToken).then((isDuplicate) => {
              if (isDuplicate)
                setIsDuplicateEmail(duplicateMailCheckStatuses.IS_DUPLICATE)
              else
                setIsDuplicateEmail(duplicateMailCheckStatuses.IS_NOT_DUPLICATE)
            })
          }

          try {
            const parsedPhoneNumber = parsePhoneNumber(values.phone, 'IT')
            if (!isValidPhoneNumber(parsedPhoneNumber.number))
              errors.phone = 'Inserire un numero di telefono valido'
          } catch (error) {
            errors.phone = 'Inserire un numero di telefono valido'
          }
          return errors
        }}
        onSubmit={async (values, actions) => {
          if (duplicateEmail === duplicateMailCheckStatuses.IS_NOT_DUPLICATE) {
            actions.setSubmitting(true)
            const { identity_code, first_name, last_name, username, phone } =
              values

            if (checkBp && !selectedTicketOption.ticket_value) {
              onErrorSubmit({
                message: `Manca il valore del buono pasto: aggiungi un valore di buono pasto`
              })
              return
            }

            try {
              const parsedPhoneNumber = parsePhoneNumber(phone, 'IT')
              if (user.id)
                await dispatch(
                  updateUser({
                    id: user.id,
                    firstName: first_name,
                    lastName: last_name,
                    username,
                    phone: parsedPhoneNumber.number,
                    createdBy: 'WEB',
                    checkTsr,
                    ticket_value:
                      Number(selectedTicketOption.ticket_value) !==
                        Number(user.bpvalue.ticket_value)
                        ? selectedTicketOption.ticket_value
                        : '',
                    oldBpValue,
                    canRefill,
                    checkGift,
                    roleId: userRoles.DEPENDENT,
                    presences,
                    checkBp,
                    hasPiva,
                    identityCode: identity_code
                  })
                )
              else
                await dispatch(
                  addUser({
                    identity_code: identity_code,
                    firstName: first_name,
                    lastName: last_name,
                    username,
                    phone: parsedPhoneNumber.number,
                    createdBy: 'WEB',
                    checkTsr,
                    ticket_value: checkBp
                      ? selectedTicketOption.ticket_value
                      : '',
                    canRefill,
                    checkGift,
                    roleId: userRoles.DEPENDENT,
                    presences
                  })
                )
              onSuccessfulSubmit()
            } catch (err) {
              console.error(err)
              onErrorSubmit(err)
            }
          }
        }}
      >
        {(props) => (
          <Form>
            <div className="mt-8 space-y-8">
              <div className="grid grid-cols-1 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                <Field name="identity_code">
                  {({ field }) => (
                    <Input
                      name={field.identity_code}
                      type="text"
                      label="Matricola"
                      isRequired={false}
                      {...field}
                    />
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-1 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                <Field name="last_name">
                  {({ field, form: { touched, errors }, meta }) => (
                    <Input
                      name={field.name}
                      type="text"
                      label="Cognome"
                      isInvalid={touched.last_name && errors.last_name}
                      invalidText={errors.last_name}
                      {...field}
                    />
                  )}
                </Field>
                <Field name="first_name">
                  {({ field, form: { touched, errors }, meta }) => (
                    <Input
                      name={field.name}
                      type="text"
                      label="Nome"
                      isInvalid={touched.first_name && errors.first_name}
                      invalidText={errors.first_name}
                      {...field}
                    />
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-1 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                <Field name="username">
                  {({ field, form: { touched, errors }, meta }) => {
                    return (
                      <div className="flex flex-col">
                        <Input
                          name={field.name}
                          type="email"
                          label="Email"
                          isInvalid={touched.username && errors.username}
                          invalidText={errors.username}
                          {...field}
                        />
                        {touched.username &&
                          !errors.username &&
                          getEmailValidationStatus(field.value)}
                      </div>
                    )
                  }}
                </Field>
                <Field name="phone">
                  {({ field, form: { touched, errors }, meta }) => (
                    <Input
                      name={field.name}
                      type="text"
                      label="Telefono"
                      isInvalid={touched.phone && errors.phone}
                      invalidText={errors.phone}
                      {...field}
                    />
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 grid-rows-3 gap-8 2xl:grid-rows-2 2xl:grid-cols-2 items-center">
                <div className="w-full rounded-md border-gray-500 border p-3 row-span-2">
                  <div
                    className="bg-white -mt-6 mb-4 max-w-1"
                    data-tip={
                      isInPendingBp ? 'Buoni pasto in fase di attivazione' : ''
                    }
                  >
                    <Checkbox
                      label={{
                        text: 'Buoni pasto',
                        position: checkboxLabelPositions.RIGHT
                      }}
                      checked={checkBp}
                      disabled={isInPendingBp}
                      onClick={() => handleCheckbox(checkBoxesIds.BP)}
                    ></Checkbox>
                  </div>
                  <div className="flex-row w-full mb-12 grid grid-cols-1 mr-0">
                    <p>Presenza</p>
                    <CheckboxGroup
                      disabled={!checkBp}
                      modified={true}
                      checkboxes={presences.map((presence, i) => {
                        return {
                          label: presence.label,
                          checked: presence.checked
                        }
                      })}
                      handleClick={(checkboxIndex) =>
                        handleCheckbox(checkBoxesIds.PRESENCES, checkboxIndex)
                      }
                    />
                  </div>

                  <div>
                    <p>Valore del buono pasto</p>
                    <div className="flex flex-col w-full gap-2">
                      <div className={ticketsOptions.length === 0 && 'hidden'}>
                        <RadioCardGroup>
                          {ticketsOptions.map((ticketOption, i) => {
                            if (!selectedTicketOption?.ticket_value) {
                              setSelectedTicketOption(ticketOption)
                            }
                            return (
                              <RadioCard
                                disabled={!checkBp}
                                selected={
                                  ticketOption.ticket_value ===
                                  selectedTicketOption.ticket_value
                                }
                                onClick={() =>
                                  setSelectedTicketOption(ticketOption)
                                }
                                key={i}
                              >
                                <div class="absolute top-0 right-0">
                                  <button
                                    disabled={!checkBp}
                                    type="button"
                                    onClick={
                                      (e) => {
                                        e.preventDefault()

                                        setShowDeleteDialog(true)
                                        setBpValueId(ticketOption.id)
                                      }
                                      // console.log(ticketOption.id)
                                    }
                                  >
                                    <Icon
                                      name={icons.ERROR}
                                      color={{
                                        primary: 'text-transparent',
                                        secondary: 'text-black'
                                      }}
                                    />
                                  </button>
                                </div>

                                <div class="text-center inline-block">
                                  <p>{ticketOption.ticket_value}€</p>
                                </div>
                              </RadioCard>
                            )
                          })}
                        </RadioCardGroup>
                      </div>
                      <div
                        className={
                          !checkBp
                            ? 'text-gray-400 w-full border-dashed border-2 rounded-md'
                            : 'w-full border-dashed border-2 rounded-md'
                        }
                      >
                        <Button
                          type="button"
                          disabled={!checkBp}
                          fullWidth={true}
                          fullHeight={true}
                          onClick={() => setShowAddDialog(true)}
                        >
                          <div className="flex">
                            <div className="items-center">
                              <Icon
                                name={icons.ADD}
                                color={{
                                  primary: 'text-transparent',
                                  secondary: 'text-black'
                                }}
                              />
                            </div>
                            <p className="items-center font-normal">
                              Aggiungi valore buono pasto
                            </p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full rounded border-gray-500 border p-3">
                  <ReactTooltip place="top" type="dark" effect="float" />
                  <div
                    className="bg-white -mt-6 mb-8 max-w-1"
                    data-tip={
                      isInPendingTsr
                        ? 'Spese aziendali in fase di attivazione'
                        : canRemoveTsr
                          ? ''
                          : 'Non si può rimuovere, il dipendente ha un saldo positivo'
                    }
                  >
                    <Checkbox
                      label={{
                        text: 'Spese aziendali',
                        position: checkboxLabelPositions.RIGHT
                      }}
                      checked={checkTsr}
                      disabled={!canRemoveTsr || isInPendingTsr}
                      onClick={() => handleCheckbox(checkBoxesIds.SR)}
                    ></Checkbox>
                  </div>
                  <Checkbox
                    disabled={!checkTsr}
                    label={{
                      text: 'Può ricaricare il proprio wallet in autonomia',
                      position: checkboxLabelPositions.RIGHT
                    }}
                    checked={canRefill}
                    onClick={() => handleCheckbox(checkBoxesIds.CAN_REFILL)}
                  ></Checkbox>
                </div>
                <ReactTooltip place="top" type="dark" effect="float" />
                <div
                  className="h-1/2 rounded border-0 p-3 mb-8"
                  data-tip={
                    isInPendingGift
                      ? 'I benefit sono in fase di attivazione'
                      : canRemoveGift
                        ? ''
                        : 'Non si può rimuovere, il dipendente ha un saldo positivo'
                  }
                >
                  <Checkbox
                    label={{
                      text: 'Benefit (Flexible benefit, Fringe benefit, Premi di produzione, Buoni regalo)',
                      position: checkboxLabelPositions.RIGHT
                    }}
                    checked={checkGift}
                    disabled={!canRemoveGift || isInPendingGift}
                    onClick={() => handleCheckbox(checkBoxesIds.BENEFIT)}
                  ></Checkbox>
                </div>
              </div>

              <div className="grid grid-cols-1 col-gap-4 sm:grid-cols-2 md:grid-cols-2">
                <Button
                  disabled={props.isSubmitting}
                  type="submit"
                  variant="primary"
                >
                  {props.isSubmitting ? `Inserimento in corso...` : 'Conferma'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Dialog
        aria-label="Delete bpValue"
        isOpen={showDeleteDialog}
        handleDismiss={() => {
          setShowDeleteDialog(false)
          setBpValueId(0)
        }}
      >
        <Container>
          <h2 className="font-bold text-2xl">
            Vuoi davvero eliminare questo valore di buono pasto?
          </h2>

          <div className="flex justify-end">
            <Button
              className="mr-4"
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false)
                setBpValueId(0)
              }}
            >
              Annulla
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await axiosUnits.patch(
                    `/${unit.id}/bpValues/${bpValueId}`,
                    {},
                    {
                      headers: { 'x-access-token': userToken }
                    }
                  )

                  let updatedUnit = unit
                  updatedUnit.bpvalues = updatedUnit.bpvalues.filter(
                    (ticketsOption) => ticketsOption.id !== bpValueId
                  )

                  await dispatch(updateUnit({ updatedUnit }))

                  setAlert({
                    type: 'success',
                    title: 'SUCCESS',
                    body: 'Eliminazione completata',
                    animate: true,
                    position: 'top'
                  })
                } catch {
                  setAlert({
                    type: 'error',
                    title: 'ERROR',
                    body: 'Prima di poter cancellare un valore buono devi terminare i buoni ad esso associati',
                    animate: true,
                    position: 'top'
                  })
                }

                setShowDeleteDialog(false)
                setBpValueId(0)
              }}
            >
              Conferma
            </Button>
          </div>
        </Container>
      </Dialog>

      <Dialog
        aria-label="Add bpValue"
        isOpen={showAddDialog}
        handleDismiss={() => setShowAddDialog(false)}
      >
        <Container>
          <h2 className="font-bold text-2xl">
            Inserisci valore del buono pasto
          </h2>

          <Formik
            initialValues={{
              ticketValue: ''
            }}
            validate={(values) => {
              const errors = {}

              const invalidTicketValue = getInvalidTicketValue(
                values.ticketValue
              )

              if (invalidTicketValue !== '')
                errors.ticketValue = invalidTicketValue

              return errors
            }}
            onSubmit={async (values, actions) => {
              let bpValues = []
              bpValues.push(values.ticketValue)

              try {
                const bpValueResponse = await axiosUnits.post(
                  `/${unit.id}/bpValues`,
                  bpValues,
                  {
                    headers: { 'x-access-token': userToken }
                  }
                )

                if (unit.bpvalues.length === 0) {
                  setSelectedTicketOption({
                    id: bpValueResponse.data.bpValuesIds[0],
                    ticket_value: values.ticketValue
                  })
                }

                let updatedUnit = unit
                updatedUnit.bpvalues.push({
                  id: bpValueResponse.data.insertId,
                  ticket_value: values.ticketValue
                })

                await dispatch(updateUnit({ updatedUnit }))

                setAlert({
                  type: 'success',
                  title: 'SUCCESS',
                  body: 'Salvataggio del nuovo valore del buono completato',
                  animate: true
                })
              } catch (err) {
                console.log(err)
                setAlert({
                  type: 'error',
                  title: 'ERROR',
                  body: 'Errore nel caricamento del nuovo valore del buono',
                  animate: true
                })

                onErrorSubmit(err)
              }

              setShowAddDialog(false)
            }}
          >
            {({ values, errors, setFieldValue, isSubmitting }) => (
              <Form>
                <Container>
                  <ContractInfoSection
                    disabled={isSubmitting}
                    name={`ticketValue`}
                    key={1}
                  />
                  {errors.ticketValue && errors.ticketValue != '' && (
                    <div className="w-full p-2 mt-2 text-white bg-red-100 ">
                      {errors.ticketValue}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      disabled={isSubmitting || values.ticketValue === ''}
                      variant="primary"
                      type="submit"
                    >
                      {!isSubmitting ? 'Conferma' : 'Aggiunta in corso...'}
                    </Button>
                  </div>
                </Container>
              </Form>
            )}
          </Formik>
        </Container>
      </Dialog>
    </>
  )
}

export default UserForm
