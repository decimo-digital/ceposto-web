import companyContract from '../companyContract.html'
import pivaContract from '../pivaContract.html'
import merchantContract from '../merchantContract.html'

function getContract(clientType) {
  let contract = ''

  switch (clientType) {
    case 'azienda':
      contract = companyContract
      break
    case 'piva':
      contract = pivaContract
      break
    case 'esercente':
      contract = merchantContract
      break
  }

  return contract
}

export { getContract }
