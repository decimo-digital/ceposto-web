import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import CheckBox, { checkboxLabelPositions } from 'components/Checkbox'
import Button from 'components/Button'

import axiosReq from 'utils/axiosInstance'
import Icon, { icons } from 'components/Icon'
import { unitScopes } from 'utils/enums'
import Alert from './Alert'

const CardCheckoutForm = ({
  token,
  unitId,
  purchaseBodyCC,
  onSuccessfulPurchase
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const [rememberCard, setRememberCard] = useState(true)
  const [cards, setCards] = useState([])
  const [isInsertingCard, setIsInsertingCard] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCards, setIsLoadingCards] = useState(true)
  const [purchaseError, setPurchaseError] = useState('')

  useEffect(() => {
    ;(async () => {
      let { data } = await axiosReq.get(`/units/${unitId}/paymentmethods`, {
        headers: { 'x-access-token': token }
      })

      if (data.length > 0) {
        let paymentMethods = data.map((paymentMethod, i) => {
          return {
            ...paymentMethod,
            attached: true,
            selected: i === 0
          }
        })

        setCards(paymentMethods)
      } else setIsInsertingCard(true)

      setIsLoadingCards(false)
    })()
  }, [])

  function setSelected(index) {
    let updatedCards = cards.map((card, i) => {
      return { ...card, selected: i === index }
    })

    setCards(updatedCards)
  }

  async function addCard(event) {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    setIsSubmitting(true)

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })

    if (error) {
      console.error('[error]', error)
    } else {
      let card = {
        id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
        last4: paymentMethod.card.last4,
        saveForFuturePayments: rememberCard
      }

      let tempCards = cards.map((card) => {
        return {
          ...card,
          selected: false
        }
      })
      tempCards.push({ ...card, selected: true })

      setCards(tempCards)
      setIsInsertingCard(false)
    }

    setIsSubmitting(false)
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    setIsSubmitting(true)
    setPurchaseError('')

    try {
      let selectedPaymentMethod = cards.filter((card) => card.selected)[0]

      purchaseBodyCC.paymentMethodId = selectedPaymentMethod.id

      console.log(purchaseBodyCC)

      const { data: purchaseIntent } = await axiosReq.post(
        `/units/${unitId}/purchases`,
        purchaseBodyCC,
        {
          headers: { 'x-access-token': token }
        }
      )

      console.log(purchaseIntent)

      let stripePurchaseBody = { payment_method: selectedPaymentMethod.id }
      if (selectedPaymentMethod.saveForFuturePayments)
        stripePurchaseBody = {
          ...stripePurchaseBody,
          setup_future_usage: 'off_session'
        }

      const stripePurchaseRequest = await stripe.confirmCardPayment(
        purchaseIntent.clientSecret,
        stripePurchaseBody
      )

      if (stripePurchaseRequest.error) {
        // Show error to your customer (e.g., insufficient funds)
        setPurchaseError(stripePurchaseRequest.error.message)
      } else {
        // The payment has been processed!
        if (stripePurchaseRequest.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          onSuccessfulPurchase()
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingCards)
    return (
      <div className="flex items-center justify-center w-full p-8 space-x-4">
        <div className="w-4 h-4 ease-linear border border-t-2 border-gray-100 rounded-full spinner"></div>
        <span>Sto recuperando le tue carte...</span>
      </div>
    )

  return (
    <AnimatePresence initial={false}>
      {!isInsertingCard ? (
        <motion.form
          onSubmit={handleSubmit}
          transition={{ duration: 0.5 }}
          initial={{
            opacity: 0,
            transform: 'translate3d(-5%,0,0)'
          }}
          animate={{
            opacity: 1,
            transform: 'translate3d(0%,0,0)'
          }}
          exit={{
            opacity: 0,
            width: 0,
            height: 0,
            transform: 'translate3d(70%,0,0)'
          }}
          onAnimationStart={() => setPurchaseError('')}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Le tue carte</h2>
            <ul className="border-b border-gray-300">
              {cards.map((card, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className="flex items-center justify-between w-full py-2 text-left border-t border-gray-300 hover:bg-gray-100"
                  >
                    <div className="flex">
                      <div className="p-4">
                        <Icon name={card.brand} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p>••••{card.last4}</p>
                        <p className="text-gray-500">
                          Scade il {card.exp_month}/{card.exp_year}
                        </p>
                      </div>
                    </div>
                    {card.selected && (
                      <div className="mr-4">
                        <Icon
                          name={icons.CHECK}
                          color={{
                            primary: 'text-green-100',
                            secondary: 'text-green-800'
                          }}
                        />
                      </div>
                    )}
                  </button>
                </li>
              ))}
              <li className="border-t border-gray-300 hover:bg-gray-100">
                <button
                  type="button"
                  className="flex items-center w-full text-left"
                  onClick={() => setIsInsertingCard(true)}
                >
                  <div className="p-4">
                    <Icon name={icons.ADD_CARD} />
                  </div>
                  Aggiungi metodo di pagamento
                </button>
              </li>
            </ul>
            <Button
              variant="primary"
              type="submit"
              disabled={!stripe || isSubmitting}
            >
              {isSubmitting ? 'Pagamento in corso...' : 'Paga'}
            </Button>
            {purchaseError && (
              <div className="mt-4">
                <Alert
                  type="error"
                  title="C&rsquo;è stato un errore nel pagamento"
                  body={purchaseError}
                  animate={true}
                />
              </div>
            )}
          </div>
        </motion.form>
      ) : (
        <motion.div
          transition={{ duration: 0.5 }}
          initial={{
            opacity: 0,
            transform: 'translate3d(10%,0,0)'
          }}
          animate={{
            opacity: 1,
            transform: 'translate3d(0%,0,0)'
          }}
          exit={{
            opacity: 0,
            width: 0,
            height: 0,
            transform: 'translate3d(70%,0,0)'
          }}
        >
          {cards.length > 0 && (
            <button
              type="button"
              className="p-2 -ml-2 hover:bg-gray-100"
              onClick={() => setIsInsertingCard(false)}
            >
              <Icon name={icons.ARROW_LEFT} />
            </button>
          )}
          <h2 className="text-xl font-medium">
            Inserisci le informazioni della carta
          </h2>
          <form onSubmit={addCard}>
            <div className="flex flex-col items-start my-8 space-y-4">
              <div className="w-full sm:w-1/2">
                <CardElement />
              </div>
              <CheckBox
                checked={rememberCard}
                onClick={() => setRememberCard(!rememberCard)}
                label={{
                  position: checkboxLabelPositions.RIGHT,
                  text: 'Ricorda per i prossimi acquisti'
                }}
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              disabled={!stripe || isSubmitting}
            >
              {isSubmitting ? 'Aggiunta in corso...' : 'Aggiungi carta'}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CardCheckoutForm
