import { motion } from 'framer-motion'

import Input from 'components/Input'
import Alert from 'components/Alert'

import isObjectEmpty from 'utils/isObjectEmpty'

import { unitScopes } from 'utils/enums'
import Button from 'components/Button'
import Infobox from 'components/Infobox'

function PhaseOne({
  alert,
  variants,
  handleSubmit,
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
        className={`flex flex-col rounded-b-md bg-white h-auto
         w-full max-w-md mx-auto shadow-md px-8 sm:px-12 pb-12 rounded-t-md 
          }`}
      >
        <h2 className="mb-4 text-2xl text-center text-gray-500 py-6">
          Registrati
        </h2>
        {!isObjectEmpty(alert) && <Alert {...alert} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Input
              label="Nome"
              isRequired={true}
              isInvalid={fields.nome.invalid}
              invalidText="Inserire un nome"
              type="text"
              value={fields.nome.value}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              id="nome"
            />
            <Input
              label="Cognome"
              isRequired={true}
              isInvalid={fields.cognome.invalid}
              invalidText="Inserire un cognome"
              type="text"
              value={fields.cognome.value}
              onChange={(e) => handleFieldChange('cognome', e.target.value)}
              id="cognome"
            />
            <Input
              label="Email"
              isRequired={true}
              isInvalid={fields.email.invalid}
              invalidText="Inserire una mail valida"
              type="email"
              value={fields.email.value}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              id="email"
            />
            <Input
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
            <Input
              label="Password"
              isRequired={true}
              isInvalid={fields.password.invalid}
              invalidText="Inserire una password valida"
              type="password"
              value={fields.password.value}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              id="password"
            />

            <Input
              label="Ripeti password"
              isRequired={true}
              isInvalid={fields.passwordRepeat.invalid}
              invalidText="Le password sono vuote o non combaciano"
              type="password"
              value={fields.passwordRepeat.value}
              onChange={(e) =>
                handleFieldChange('passwordRepeat', e.target.value)
              }
              id="passwordRepeat"
            />
            <Button
              type="submit"
              fullWidth={true}
              variant="primary"
              disabled={isSendingRequest}
            >
              {isSendingRequest ? 'Attendere prego...' : 'Conferma'}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  )
}

export default PhaseOne
