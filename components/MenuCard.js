import dayjs from 'dayjs'
import { axiosPrenotation } from 'utils/axiosInstance'
import Button from './Button'
import { Field, Form, Formik } from 'formik'
import Input from 'components/Input'
import RadioCardGroup from 'components/RadioCardGroup'
import RadioCard from 'components/RadioCard'
import { useEffect, useState } from 'react'
const MenuCard = ({ id, name, price, categoryId, merchantId, updateMenuItem, deleteMenuItem, addMenuItem }) => {
  const categoryOptions = [
    { label: 'Antipasti', value: 1 }
    ,
    { label: 'Primi', value: 2 }
    ,
    { label: 'Secondi', value: 3 }
    ,
    { label: 'Pizza', value: 4 }
    ,
    { label: 'Dessert', value: 5 }
  ]
  const [selectedCategory, setSelectedCategory] = useState(categoryId)
  const [submitLabel, setSubmitLabel] = useState(name === '' ? 'Inserisci piatto' : 'Conferma modifiche')
  const [isVisible, setIsVisible] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  return (
    isVisible && (
      <div className="">
        <div id="card" className="">

          <div className="container w-100 lg:w-4/5 mx-auto flex flex-col mb-4">

            <div v-for="card in cards" className={`flex flex-col md:flex-row overflow-hidden
                                          rounded-lg shadow-xl w-100 mx-2
                                          border-t-2 `}>

              <div className="w-full py-4 px-6 text-gray-800 flex flex-col justify-between">
                <Formik
                  initialValues={{
                    id: id,
                    name: name,
                    price: price,
                    categoryId: selectedCategory ?? categoryId,
                  }}
                  validate={(values) => {
                    const errors = {}
                    if (values.name === '')
                      errors.name = 'Il campo nome non può essere vuoto'
                    if (values.price === 0)
                      errors.price = 'Il campo price non può essere 0'
                    return errors
                  }}
                  onSubmit={async (values, actions) => {
                    if (!isDeleting) {
                      setSubmitLabel('Attendi...')
                      if (values.id === -1) {
                        const result = await addMenuItem(values, selectedCategory, merchantId)
                        if (typeof result !== 'undefined') setSubmitLabel('Nuovo')
                      }
                      else {
                        await updateMenuItem(values, selectedCategory, merchantId)
                        setSubmitLabel('Conferma modifiche')
                      }


                    }
                    else setIsDeleting(false)


                  }}
                >
                  {({ values, errors, setFieldValue, isSubmitting }) => (
                    <Form>
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                          <Field name="name">
                            {({ field, form: { touched, errors }, meta }) => (
                              <Input
                                name={field.name}
                                type="text"
                                label="Nome piatto"
                                isRequired={false}
                                value={field.name}
                                isInvalid={touched.name && errors.name}
                                invalidText={errors.name}
                                {...field}
                                disabled={submitLabel === 'Nuovo'}
                              />
                            )}
                          </Field>
                          <Field name="price">
                            {({ field, form: { touched, errors }, meta }) => (
                              <Input
                                name={field.price}
                                type="number"
                                label="Prezzo (€)"
                                min={0}
                                isRequired={false}
                                value={field.price}
                                isInvalid={touched.price && errors.price}
                                invalidText={errors.price}
                                disabled={submitLabel === 'Nuovo'}
                                {...field}
                              />
                            )}
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                          <div>
                            <p>Categoria</p>
                            <RadioCardGroup>
                              {
                                categoryOptions.map(
                                  option => {
                                    return (
                                      <RadioCard
                                        disabled={submitLabel === 'Nuovo'}
                                        selected={
                                          option.value == selectedCategory
                                        }
                                        onClick={(e) => {
                                          setSelectedCategory(option.value)
                                        }}
                                      >
                                        {option.label}
                                      </RadioCard>


                                    )
                                  }
                                )
                              }
                            </RadioCardGroup>


                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:space-x-4 col-gap-4 space-y-2 md:grid-cols-2 xl:grid-cols-2 sm:space-y-0">
                          <div>
                            {
                              name !== '' && (
                                <Button
                                  onClick={async () => {
                                    setIsDeleting(true)
                                    const x = await deleteMenuItem(
                                      id, merchantId
                                    )
                                    if (typeof x !== 'undefined')
                                      setIsVisible(false)

                                  }}
                                  variant={'destructive'}
                                >
                                  ELIMINA
                                </Button>
                              )

                            }

                          </div>


                          <div>
                            <Button
                              variant={'primary'}
                              disabled={
                                submitLabel === 'Nuovo'
                              }
                            >
                              {submitLabel.toUpperCase()}
                            </Button>
                          </div>
                        </div>


                      </div>
                    </Form>
                  )}
                </Formik>

              </div>


            </div>



          </div>
        </div>
      </div >

    )


  )


}

export default MenuCard