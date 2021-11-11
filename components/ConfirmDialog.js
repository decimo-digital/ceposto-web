//Libraries
import { useState } from 'react'
//Components
import AlertFloat from 'components/AlertFloat'
import Dialog from 'components/Dialog'
import Button from 'components/Button'
//Utility
import isObjectEmpty from 'utils/isObjectEmpty'

function ConfirmDialog({
  isOpen = false,
  setIsOpen,
  changeData,
  type = 'default',
  data = {}
}) {
  const [alert, setAlert] = useState(false)
  return (
    <>
      {!isObjectEmpty(alert) && (
        <AlertFloat alert={alert} setAlert={setAlert} />
      )}
      <Dialog
        aria-label="Delete"
        isOpen={isOpen}
        handleDismiss={() => setIsOpen(false)}
      >
        <div className="flex flex-col items-center">
          <p className="text-2xl text-gray-500 font-bold">
            Sei sicuro di voler procedere{' '}
            {type === 'deletion'
              ? `all'eliminazione 
            di ${data.user.username}`
              : ''}
            ?
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-2">
              <Button
                variant="primary"
                fullWidth={true}
                type="button"
                onClick={() => {
                  changeData()
                  setIsOpen(false)

                  setAlert({
                    type: 'success',
                    title: 'Eliminato',
                    body: `Hai eliminato con successo ${
                      type === 'deletion' ? data.user.username : 'il dato'
                    }`,
                    animate: true
                  })
                }}
              >
                CONFERMA
              </Button>
            </div>
            <div className="col-start-3">
              <Button
                variant="refuse"
                fullWidth={true}
                type="button"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                RIFIUTA
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ConfirmDialog
