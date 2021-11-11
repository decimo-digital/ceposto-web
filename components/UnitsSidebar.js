import { useSelector, useDispatch, useStore } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Sidebar from './Sidebar'
import SidebarItem from './SidebarItem'
import Button from './Button'
import Dialog from './Dialog'
import AddUnit from './AddUnit'

import { deleteUnit } from 'state/units/actions'
import { setCurrentUnitIndex } from 'state/currentUnitIndex/actions'
import { unitScopes } from 'utils/enums'
import Icon, { icons } from './Icon'

const UnitsSidebar = ({ canAddUnits = false, isEmptyUnits = false }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const units = useSelector((state) => state.units.data)

  const [unitToDeleteIndex, setUnitToDeleteIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const [showDialogAdd, setShowDialogAdd] = useState(isEmptyUnits)
  const [showDialogDelete, setShowDialogDelete] = useState(false)

  const openDialogDelete = () => setShowDialogDelete(true)
  const closeDialogDelete = () => setShowDialogDelete(false)

  const openDialogAdd = () => setShowDialogAdd(true)
  const closeDialogAdd = () => setShowDialogAdd(false)


  async function handleDeleteClick(e) {
    e.preventDefault()

    setIsDeleting(true)

    try {
      await dispatch(deleteUnit(units[unitToDeleteIndex].id))
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }

    dispatch(setCurrentUnitIndex(0))
    router.push(`/info/0`)

    closeDialogDelete()
  }

  function getPathname(index) {
    let pathname = `/info/${index}`
    if (units[index].scope_id === unitScopes.MERCHANT) {
      pathname = `/incomingPayments/${index}`
    }

    return pathname
  }

  return (
    <>
      <div className="w-full mb-4 flex-grow max-h-full">
        <Sidebar>
          {units?.map((unit, index) => (
            <SidebarItem
              name={
                unit.business_name === '' ? (
                  `Nuova sede ${index + 1}`
                ) : unit.store_name !== '' ? (
                  <p>{unit.store_name}</p>
                ) : (
                  unit.business_name
                )
              }
              pathname={getPathname(index)}
              key={index}
              hasAction={true}
              scopeId={unit.scope_id}
              onItemClick={() => {
                dispatch(setCurrentUnitIndex(index))
              }}
              onActionClick={(e) => {
                setUnitToDeleteIndex(index)
                openDialogDelete()
              }}
            />
          ))}
          <>
            {canAddUnits && (
              <button
                className="w-full p-2 gap-2 text-gray-700 bg-white hover:bg-gray-200 sticky bottom-0 rounded-md flex items-center"
                onClick={() =>
                  // dispatch(addUnit())
                  openDialogAdd()
                }
              >
                <Icon name={icons.ADD} />
                <span>Aggiungi profilo</span>
              </button>
            )}
          </>
        </Sidebar>
      </div>
      <Dialog
        aria-label="Unit Add"
        isOpen={showDialogAdd}
        handleDismiss={isEmptyUnits ? () => { } : closeDialogAdd}
      >
        <AddUnit
          closeDialogAdd={closeDialogAdd}
          units={units}
          setCurrentUnitIndex={setCurrentUnitIndex}
        />
      </Dialog>

      <Dialog
        aria-label="Unit deletion"
        isOpen={showDialogDelete}
        handleDismiss={closeDialogDelete}
      >
        <p>
          Vuoi davvero eliminare{' '}
          {unitToDeleteIndex < units?.length
            ? units[unitToDeleteIndex].store_name
            : 'questa sede'}
          ?
        </p>
        <p className="font-bold text-red-700">L'azione è irreversibile</p>
        <div className="flex mt-8 space-x-4">
          <Button variant="destructive" onClick={handleDeleteClick}>
            {isDeleting ? 'Eliminazione in corso...' : 'Conferma'}
          </Button>
          <Button onClick={closeDialogDelete}>Annulla</Button>
        </div>
      </Dialog>
    </>
  )
}

export default UnitsSidebar
