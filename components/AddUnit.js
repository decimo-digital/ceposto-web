import Button from 'components/Button'
import Container from 'components/Container'
import jsCookie from 'js-cookie'
import router from 'next/router'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUnit } from 'state/units/actions'

import { unitScopes } from 'utils/enums'
import Profile from './Profile'

function AddUnit({ closeDialogAdd, units, setCurrentUnitIndex }) {
  const dispatch = useDispatch()
  const [selectedScope, setSelectedScope] = useState(unitScopes.COMPANY)

  return (
    <>
      <Container>
        <div className="flex flex-col space-y-4">
          <p className="text-2xl">Che tipo di profilo vuoi inserire?</p>
          <div className="grid grid-cols-2 gap-8">
            {/* <Profile
              scope={unitScopes.PIVA}
              onClick={() => setSelectedScope(unitScopes.PIVA)}
              selected={selectedScope === unitScopes.PIVA}
            /> */}
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
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                const unitIndex = units.length
                closeDialogAdd()
                dispatch(setCurrentUnitIndex(unitIndex))

                dispatch(
                  addUnit({
                    id: unitIndex * -1,
                    store_name: 'Nuova attività',
                    scope_id: selectedScope
                  })
                )

                router.push(`/info/${unitIndex}`)
              }}
            >
              Conferma
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}

export default AddUnit
