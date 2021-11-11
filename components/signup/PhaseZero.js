import Button from 'components/Button'
import Container from 'components/Container'
import Profile from 'components/Profile'

import { useState } from 'react'

import { unitScopes, otpTypes } from 'utils/enums'

const USER = 0

function PhaseZero({
  alert,
  variants,
  handleSubmit,
  currSignupStage,
  fields,
  handleFieldChange,
  isSendingRequest = false
}) {
  const [selectedScope, setSelectedScope] = useState(unitScopes.NONE)

  return (
    <>
      <Container>
        <div className="bg-white rounded-md p-8 space-y-4">
          <p className="text-2xl">Che tipo di profilo vuoi inserire?</p>
          <div className="grid grid-cols-4 gap-8">
            <Profile
              scope={unitScopes.NONE}
              onClick={() => setSelectedScope(unitScopes.NONE)}
              selected={selectedScope === unitScopes.NONE}
            />
            <Profile
              scope={unitScopes.PIVA}
              onClick={() => setSelectedScope(unitScopes.PIVA)}
              selected={selectedScope === unitScopes.PIVA}
            />
            <Profile
              scope={unitScopes.COMPANY}
              onClick={() => setSelectedScope(unitScopes.COMPANY)}
              selected={selectedScope === unitScopes.COMPANY}
            />
            <Profile
              scope={unitScopes.MERCHANT_ADMIN}
              onClick={() => setSelectedScope(unitScopes.MERCHANT_ADMIN)}
              selected={selectedScope === unitScopes.MERCHANT_ADMIN}
            />
            {/* <Profile
              scope={unitScopes.CIRCUITO_SPESA}
              onClick={() => setSelectedScope(unitScopes.CIRCUITO_SPESA)}
              selected={selectedScope === unitScopes.CIRCUITO_SPESA}
            /> */}
          </div>
          <div className="flex justify-end">
            <div>
              <Button
                type="submit"
                variant="primary"
                onClick={() => {
                  handleFieldChange('scope', selectedScope)

                  handleSubmit()
                }}
                disabled={false}
              >
                Conferma
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default PhaseZero
