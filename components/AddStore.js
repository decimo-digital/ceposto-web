//Libraries
import { useCallback, useEffect, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import Switch from 'components/Switch'
import { useDropzone } from 'react-dropzone'
//Components
import AlertFloat from 'components/AlertFloat'
import Button from 'components/Button'
import Container from 'components/Container'
import ConfirmDialog from './ConfirmDialog'
import Icon, { icons } from 'components/Icon'
import Input from 'components/Input'
import InputGroup from 'components/InputGroup'
import { MapsDropdown } from 'components/Dropdown'
import SectionGroup from 'components/SectionGroup'
//Utility
import axiosRes from 'utils/axiosInstance'
import isObjectEmpty from 'utils/isObjectEmpty'
//State
import { unitScopes } from 'utils/enums'
import Section from './Section'
import Card from './Card'
import Infobox from './Infobox'
import { useDispatch } from 'react-redux'
import { updateUnitOfCurrentUnit } from 'state/units/actions'

const AddStore = (props) => {
  const [alert, setAlert] = useState(false)
  const [devices, setDevices] = useState([])

  const dispatch = useDispatch()

  const [deviceToDelete, setDeviceToDelete] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  async function deleteDevice() {
    await axiosRes.delete(
      `/units/${props.unit?.id}/devices/${deviceToDelete.id}`,
      { headers: { 'x-access-token': props.token } }
    )

    setDevices((devices) =>
      devices.filter((device) => device.id !== deviceToDelete.id)
    )
  }

  useEffect(() => {
    async function getDevices() {
      if (props.unit?.id) {
        const { data: deviceRes } = await axiosRes.get(
          `/units/${props.unit?.id}/devices`,
          { headers: { 'x-access-token': props.token } }
        )

        setDevices(deviceRes.data)
      }
    }

    getDevices()
  }, [])

  const [files, setFiles] = useState([{ preview: props.unit.profilePic }])
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      )
    }
  })

  const thumbs = (
    <div key={files[0].name}>
      <div className="flex min-w-0 overflow-hidden">
        <img
          className="cursor-pointer w-32 h-32 border-2 rounded-full bg-white"
          src={files[0].preview}
        />
      </div>
    </div>
  )

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  return (
    <div>
      <Container>
        {!isObjectEmpty(alert) && (
          <AlertFloat alert={alert} setAlert={setAlert} />
        )}

        <>
          <div className="cursor-pointer" onClick={() => props.goBack()}>
            <Icon name={icons.ARROW_LEFT} />
          </div>
          <SectionGroup id="StoreSet" title="Informazioni punto vendita">
            <Formik
              initialValues={{
                storeName: props.unit?.store_name ?? '',
                address: {
                  street: props.unit?.address ?? '',
                  city: props.unit?.city ?? '',
                  province: props.unit?.province ?? '',
                  postalCode: props.unit?.cap ?? '',
                  lat: props.unit?.geo_x ?? '',
                  long: props.unit?.geo_y ?? ''
                },
                ticketAccepted: {
                  typeAll: false,
                  typeOne: false,
                  typeTwo: false,
                  typeThree: false,
                  typeFour: false
                }
              }}
              validate={(values) => {
                let errors = {}

                if (isObjectEmpty(values.storeName))
                  errors.storeName =
                    'Il nome del punto vendita non può essere vuoto'

                if (
                  isObjectEmpty(values.address.street) ||
                  isObjectEmpty(values.address.city) ||
                  isObjectEmpty(values.address.province) ||
                  isObjectEmpty(values.address.postalCode) ||
                  values.address.lat === 0 ||
                  values.address.long === 0
                )
                  errors.address = `L'address non può essere vuoto`

                return errors
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  for await (let alias of devices) {
                    let deviceReqBody = {
                      canCashout: alias.can_cashout
                    }

                    if (!isObjectEmpty(alias.label)) {
                      deviceReqBody.label = alias.label
                    }

                    if (!props.unit?.id) {
                      await axiosRes.post(
                        `/units/${props.unit?.id}/devices/${alias.id}`,
                        deviceReqBody,
                        { headers: { 'x-access-token': props.token } }
                      )
                    } else {
                      await axiosRes.patch(
                        `/units/${props.unit?.id}/devices/${alias.id}`,
                        deviceReqBody,
                        { headers: { 'x-access-token': props.token } }
                      )
                    }
                  }

                  let updates = {
                    storeName: values.storeName,
                    address: values.address.street,
                    city: values.address.city,
                    cap: values.address.postalCode,
                    province: values.address.province,
                    geoX: values.address.lat.toString(),
                    geoY: values.address.long.toString(),
                    createdBy: 'CLIENT_WEB',
                    subcategoryId: unitScopes.MERCHANT
                  }
                  if (files[0] !== '' && files[0] instanceof Blob)
                    updates = { ...updates, profilePic: files[0] }

                  await dispatch(
                    updateUnitOfCurrentUnit({
                      updates,
                      subunitIndex: props.index
                    })
                  )

                  let completeRegistration = props.unit.id

                  setAlert({
                    type: 'success',
                    title: completeRegistration
                      ? 'Registrazione completata con successo!'
                      : 'Informazioni aggiornate con successo',
                    body: completeRegistration
                      ? 'Ora puoi acquistare i buoni pasto Toduba'
                      : 'Aggiornamento avvenuto con successo'
                  })
                } catch (err) {
                  console.error(err)
                  setAlert({
                    type: 'error',
                    title: 'ERRORE',
                    body: 'Errore nel salvataggio'
                  })
                }
              }}
              enableReinitialize={true}
            >
              {({ values, errors, setFieldValue, isSubmitting }) => (
                <Form>
                  <Section title="Informazioni base">
                    <div className="flex flex-col gap-4">
                      <Field name="storeName">
                        {({ field, form: { touched, errors }, meta }) => (
                          <Input
                            name={field.storeName}
                            type="text"
                            isRequired={true}
                            label="Nome punto vendita"
                            maxLength="32"
                            isInvalid={!isObjectEmpty(errors.storeName)}
                            invalidText={errors.storeName}
                            {...field}
                          />
                        )}
                      </Field>
                      <InputGroup
                        labelText="Posizione"
                        containerClass="w-full"
                        invalidFlag={errors.address}
                        invalidText="Inserire un indirizzo valido"
                      >
                        <MapsDropdown
                          handleChange={setFieldValue}
                          initialValue={
                            values.address.street !== '' &&
                            values.address.city !== '' &&
                            values.address.postalCode !== '' &&
                            values.address.province !== ''
                              ? `${values.address.street}, ${values.address.city}, ${values.address.postalCode}, ${values.address.province}`
                              : ''
                          }
                          className="p-2 border border-gray-600 active:border-green-600 focus:shadow-outline w-100"
                          name="address"
                        />
                      </InputGroup>
                      <label htmlFor="logo">Logo</label>
                      <div className="flex gap-x-4">
                        <div className="flex-shrink-0">
                          <div
                            id="logo"
                            className="cursor-pointer w-32 h-32 border-2 rounded-full bg-white"
                            {...getRootProps({ className: 'dropzone' })}
                          >
                            <input {...getInputProps()} />
                            <div>{thumbs}</div>
                          </div>
                        </div>
                        <Infobox>
                          <p>
                            &Egrave; preferibile un immagine quadrata di
                            dimensione 128x128. Se non hai a disposizione un
                            logo provvederemo ad inserine uno di default in base
                            al tuo settore merceologico.
                          </p>
                        </Infobox>
                      </div>
                    </div>
                  </Section>
                  <Section title="Dispositivi associati">
                    <div className="flex flex-col gap-8">
                      <div className="col-span-3">
                        <Infobox>
                          <p>
                            Dal momento in cui verrà creato questo p.v. ti verrà
                            inviata una email con le spiegazioni per
                            l'attivazione dell'account sul dispositivo sul quale
                            andrai ad accettare i pagamenti. In sintesi, ci sono
                            due possibilità:
                          </p>
                          <ul className="list-disc list-inside">
                            <li>
                              Hai un dispositivo dedicato al p.v.? Accedi
                              tramite le credenziali che ti abbiamo inviato via
                              email.
                            </li>
                            <li>
                              Vuoi associare un p.v. ad un'utenza Toduba?
                              All'interno dell'app vai sul profilo{' '}
                              <Icon name={icons.ARROW_RIGHT} /> aggiungi utenza
                              <Icon name={icons.ARROW_RIGHT} /> inserisci i dati
                              arrivati via email.
                            </li>
                          </ul>
                          <p>
                            Una volta associato, nella sezione "Ricevi" dell'app
                            comparirà un QR apposta per il p.v.
                          </p>
                        </Infobox>
                      </div>

                      {props.unit?.id && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr">
                          {devices.map((alias, aliasIndex) => (
                            <Card key={aliasIndex}>
                              <div className="flex flex-col relative gap-4">
                                <div
                                  className="cursor-pointer absolute right-0 top-0"
                                  onClick={() => {
                                    setIsOpen(true)
                                    setDeviceToDelete(alias)
                                  }}
                                >
                                  <Icon name={icons.TRASH} />
                                </div>
                                <div>
                                  <p className="text-gray-500 uppercase text-sm">
                                    Codice punto vendita
                                  </p>
                                  <p className="font-bold">{alias.id}</p>
                                </div>
                                <div className="flex gap-2">
                                  <span
                                    style={{
                                      backgroundColor: alias.is_active
                                        ? '#00ff00'
                                        : '#ffff00'
                                    }}
                                    className={`rounded-full h-6 w-6`}
                                  />
                                  {alias.is_active
                                    ? 'Associato'
                                    : 'In attesa di associazione'}
                                </div>
                                <div>
                                  <Input
                                    label="Etichetta"
                                    type="text"
                                    value={alias.label}
                                    isRequired={false}
                                    onChange={(e) => {
                                      setDevices((devices) =>
                                        devices.map((aliasAux, indexAux) => {
                                          if (indexAux === aliasIndex) {
                                            aliasAux.label = e.target.value
                                          }
                                          return aliasAux
                                        })
                                      )
                                    }}
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}

                          <div
                            className="border border-dashed border-gray-700 rounded-md flex w-full h-full cursor-pointer justify-center items-center"
                            onClick={async () => {
                              const { data: deviceResponse } =
                                await axiosRes.post(
                                  `/units/${props.unit?.id}/devices`,
                                  {},
                                  { headers: { 'x-access-token': props.token } }
                                )

                              setDevices((devices) => [
                                ...devices,
                                {
                                  id: deviceResponse.deviceId,
                                  label: '',
                                  can_cashout: true
                                }
                              ])
                            }}
                          >
                            <Icon name={icons.ADD_SQUARE} />
                            <p className="text-gray-700 pl-2">
                              Crea utenza punto vendita
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Section>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      fullWidth={false}
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? props.unit.id
                          ? 'Aggiornamento in corso...'
                          : 'Creazione punto vendita in corso...'
                        : props.unit.id
                        ? 'Aggiorna'
                        : 'Conferma'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </SectionGroup>
          <ConfirmDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            changeData={deleteDevice}
          />
        </>
      </Container>
    </div>
  )
}

export default AddStore
