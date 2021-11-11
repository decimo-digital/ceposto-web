import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import dayjs from 'dayjs'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import { axiosBanking } from 'utils/axiosInstance'

import Input from 'components/Input'
import Button from 'components/Button'

import * as localeUtils from 'utils/localeUtils'

function InvoiceInfoForm({
  onSuccessfulSubmit,
  onErrorSubmit,
  reportId,
  userToken,
}) {
  const [date, setDate] = useState({
    label: dayjs().toDate(),
    value: dayjs().unix(),
  })

  function changeDate(day) {
    if (dayjs(day).isValid()) {
      const label = day

      if (label === '')
        setDate({
          label: dayjs().toDate(),
          value: dayjs().unix(),
        })
      else
        setDate({
          label: label,
          value: dayjs(label).unix(),
        })
    }
  }

  function formatDate(date, format, locale) {
    return dayjs(date).locale(locale).format(format)
  }

  return (
    <>
      <h2 className='text-xl font-bold w-full'>
        Completa le informazioni per la fattura
      </h2>
      <Formik
        initialValues={{
          invoiceNumber: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { invoiceNumber } = values

          setSubmitting(true)

          try {
            let cashoutReqBody = {
              reportId,
              customDate: dayjs.unix(date.value).toISOString(),
            }

            if (invoiceNumber !== '')
              cashoutReqBody = {
                ...cashoutReqBody,
                customNumber: invoiceNumber,
              }

            await axiosBanking.post(
              '/cashoutForAdminByReport',
              cashoutReqBody,
              { headers: { 'x-access-token': userToken } }
            )

            onSuccessfulSubmit()
          } catch (err) {
            onErrorSubmit(err.response.data)
          }
        }}
      >
        {props => (
          <Form>
            <div className='mt-4 space-y-4'>
              <div className='flex flex-col space-y-2'>
                <h3 className='text-xl font-medium'>Numero</h3>
                <p>
                  Lasciare vuoto per utilizzare la numerazione di default Toduba
                </p>

                <Field name='invoiceNumber'>
                  {({ field }) => (
                    <Input
                      name={field.name}
                      type='text'
                      isRequired={false}
                      {...field}
                    />
                  )}
                </Field>
                <div>
                  <div className='bg-gray-300 rounded p-4 w-full'>
                    <p>
                      Le fatture generate in automatico utilizzano un formato
                      standard per tutti i clienti Toduba (
                      <a
                        className='underline'
                        href='/manuale_azienda.pdf'
                        download
                      >
                        visualizza un fac-simile
                      </a>
                      ): <br />
                      Se non fosse conforme ai vostri standard, potete
                      utilizzare i report generati per compilare correttamente
                      la vostra fattura o nota di debito.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-xl font-medium'>Data</h3>

                <Field name='invoiceDate'>
                  {({ field }) => (
                    <div className='border border-gray-500 p-2 bg-white lg:w-1/2 xl:w-1/3'>
                      <DayPickerInput
                        id='dayPickerInputAssignSearch'
                        onDayChange={changeDate}
                        formatDate={formatDate}
                        format={'DD/MM/YYYY'}
                        placeholder={dayjs(date.label).format('DD/MM/YYYY')}
                        dayPickerProps={{
                          locale:
                            typeof navigator !== 'undefined'
                              ? navigator.languages[1]
                              : 'en',
                          localeUtils,
                          toMonth: new Date(),
                          disabledDays: [{ after: dayjs().toDate() }],
                        }}
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className='w-full flex justify-end'>
                <Button
                  disabled={props.isSubmitting}
                  type='submit'
                  variant='primary'
                >
                  {props.isSubmitting
                    ? `Cashout in corso...`
                    : 'Conferma Cashout'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default InvoiceInfoForm
