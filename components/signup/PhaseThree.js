import { motion } from 'framer-motion'

import Alert from 'components/Alert'
import FloatingLabelInput from 'components/FloatingLabelInput'
import Button from 'components/Button'

import isObjectEmpty from 'utils/isObjectEmpty'

function PhaseThree({
  alert,
  variants,
  handleSubmit,
  currSignupStage,
  fields,
  handleFieldChange,
  isSendingRequest = false
}) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exitCollapse"
      transition={{
        opacity: { duration: 0.5 },
        transform: { duration: 0.5 }
      }}
      className={`flex flex-col rounded-b bg-white mx-auto ${
        currSignupStage === 2 ? 'h-auto' : 'h-0'
      } w-full max-w-md shadow-md ${currSignupStage === 2 ? 'p-12' : 'p-0'}`}
    >
      <div className="flex flex-col">
        <h2 className="text-2xl text-center text-gray-500">
          Scegli una password sicura
        </h2>
        <p className="my-4 text-center text-gray-500">
          Minimo 8 caratteri, almeno una lettera maiuscola, un numero e un
          carattere speciale
        </p>
        {!isObjectEmpty(alert) && <Alert {...alert} />}
        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
          <FloatingLabelInput
            label="Password"
            isRequired={true}
            isInvalid={fields.password.invalid}
            invalidText="Inserire una password valida"
            type="password"
            value={fields.password.value}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            id="password"
          />

          <FloatingLabelInput
            label="Ripeti password"
            isRequired={true}
            isInvalid={fields.passwordRepeat.invalid}
            invalidText="Inserire una password valida"
            type="password"
            value={fields.passwordRepeat.value}
            onChange={(e) =>
              handleFieldChange('passwordRepeat', e.target.value)
            }
            id="passwordRepeat"
          />

          <div className="mt-16">
            <Button
              type="submit"
              fullWidth={true}
              variant="primary"
              disabled={isSendingRequest}
            >
              {isSendingRequest ? 'Creazione in corso...' : 'Crea account'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default PhaseThree
