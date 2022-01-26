import { motion } from 'framer-motion'

import Alert from 'components/Alert'
import FloatingLabelInput from 'components/FloatingLabelInput'
import Button from 'components/Button'

import isObjectEmpty from 'utils/isObjectEmpty'
import { otpTypes } from 'utils/enums'

import { axiosAuth } from 'utils/axiosInstance'

function PhaseTwo({
  alert,
  variants,
  handleSubmit,
  currSignupStage,
  fields,
  handleFieldChange,
  isSendingRequest = false,
  userInfo
}) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        opacity: { duration: 0.5 },
        transform: { duration: 0.5 }
      }}
      className={`flex flex-col rounded-b bg-white mx-auto ${currSignupStage === 1 ? 'h-auto' : 'h-0'
        } w-full max-w-md shadow-md ${currSignupStage === 1 ? 'px-8 sm:px-20 pb-12' : 'p-0'
        }`}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-2xl text-gray-500">Accettazione contratto</h2>
        <p className="mt-4 text-center text-gray-500">
          Inserisci il codice che hai ricevuto
          {fields.otpType.value === otpTypes.EMAIL
            ? ' via mail, se non lo trovi nella casella principale controlla nello spam'
            : ' via SMS'}
        </p>
        {!isObjectEmpty(alert) && <Alert {...alert} className="my-6" />}
        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
          <FloatingLabelInput
            label="Codice di conferma OTP"
            isRequired={true}
            isInvalid={fields.otpCode.invalid}
            invalidText="Inserire un codice valido"
            type="text"
            value={fields.otpCode.value}
            onChange={(e) => handleFieldChange('otpCode', e.target.value)}
            maxLength="6"
            id="otpCode"
          />
          <button
            type="button"
            className="text-center text-gray-400 bg-transparent hover:underline"
            onClick={async () => {
              const data = {
                email: userInfo.email,
                phone: userInfo.phone,
                source: 'CLIENT_WEB'
              }



              const pendingRegistrationResponse = await axiosAuth.post(
                '/pendingRegistration',
                data
              )
            }}
          >
            Non hai ricevuto nulla? Richiedi il codice
          </button>

          <div className="mt-16">
            <Button
              type="submit"
              fullWidth={true}
              variant="primary"
              disabled={isSendingRequest}
            >
              {isSendingRequest ? 'Attendere prego...' : 'Continua'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default PhaseTwo
