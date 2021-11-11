import { motion } from 'framer-motion'

import FloatingLabelInput from 'components/FloatingLabelInput'
import Alert from 'components/Alert'

import isObjectEmpty from 'utils/isObjectEmpty'

import { unitScopes } from 'utils/enums'
import Button from 'components/Button'
import Infobox from 'components/Infobox'

function PhaseOne({
  alert,
  variants,
  handleSubmit,
  currSignupStage,
  fields,
  handleFieldChange,
  isSendingRequest = false
}) {
  return (
    <>
      <motion.div
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          opacity: { duration: 0.5 },
          transform: { duration: 0.5 }
        }}
        className={`flex flex-col rounded-b-md bg-white ${
          currSignupStage === 0 ? 'h-auto' : 'h-0'
        } w-full max-w-md mx-auto shadow-md ${
          currSignupStage === 0 ? 'px-8 sm:px-12 pb-12' : 'p-0'
        }`}
      >
        <h2 className="mb-4 text-2xl text-center text-gray-500">
          {fields.scope.value === unitScopes.PIVA
            ? 'Registrati'
            : 'Registrati come referente'}
        </h2>
        {!isObjectEmpty(alert) && <Alert {...alert} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <FloatingLabelInput
              label="Nome"
              isRequired={true}
              isInvalid={fields.nome.invalid}
              invalidText="Inserire un nome"
              type="text"
              value={fields.nome.value}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              id="nome"
            />
            <FloatingLabelInput
              label="Cognome"
              isRequired={true}
              isInvalid={fields.cognome.invalid}
              invalidText="Inserire un cognome"
              type="text"
              value={fields.cognome.value}
              onChange={(e) => handleFieldChange('cognome', e.target.value)}
              id="cognome"
            />
            <FloatingLabelInput
              label="Email"
              isRequired={true}
              isInvalid={fields.email.invalid}
              invalidText="Inserire una mail valida"
              type="email"
              value={fields.email.value}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              id="email"
            />
            <FloatingLabelInput
              label="Telefono"
              isRequired={true}
              isInvalid={fields.phone.invalid}
              disabled={false}
              invalidText="Inserire un numero di telefono valido"
              type="text"
              value={fields.phone.value}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              id="phone"
            />
            <Infobox>
              Riceverai un codice via SMS sul tuo telefono per confermare la tua
              identità
            </Infobox>
            <div className="space-y-2">
              <div
                className={`${
                  fields.contractAccepted.invalid &&
                  'border border-red-100 text-red-900 p-2'
                }`}
              >
                <input
                  type="checkbox"
                  name="acceptContract"
                  className="mr-2 text-gray-500"
                  onClick={() =>
                    handleFieldChange(
                      'contractAccepted',
                      !fields.contractAccepted.value
                    )
                  }
                  checked={fields.contractAccepted.value}
                />
                Accetto i termini e condizioni del{' '}
                <a
                  href={`https://toduba-public.s3.eu-south-1.amazonaws.com/Contratto+utenti.html`}
                  target="_blank"
                  className="mt-2 text-green-500 hover:underline"
                >
                  contratto TODUBA
                </a>
              </div>
              <div
                className={`${
                  fields.conditionsAccepted.invalid &&
                  'border border-red-100 p-2'
                }`}
              >
                <input
                  type="checkbox"
                  name="acceptTermsAndConditions"
                  className="mr-2"
                  value={fields.conditionsAccepted.value}
                  onClick={() =>
                    handleFieldChange(
                      'conditionsAccepted',
                      !fields.conditionsAccepted.value
                    )
                  }
                />
                Ho letto e Acconsento alle{' '}
                <a
                  href="https://toduba-public.s3.eu-south-1.amazonaws.com/privacy.html"
                  target="_blank"
                  className="mt-2 text-green-600 hover:underline"
                >
                  regole di trattamento sulla Privacy.
                </a>
              </div>
            </div>
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
      </motion.div>
    </>
  )
}

export default PhaseOne
