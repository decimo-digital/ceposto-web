function getErrorMessage(status) {
  let errorMessage = { title: 'Qualcosa è andato storto!', body: '' }

  switch (status) {
    case 401:
      errorMessage.body = 'Non autorizzato'
      break
    case 404:
      errorMessage.body = 'Non trovato'
      break
    case 409:
      errorMessage.body = 'Utente già esistente'
      break
    case 429:
      errorMessage.body = `Hai fatto troppe richieste per ottenere l'OTP chiedere al supporto`
      break
    case 500:
      errorMessage.body = 'Errore del server'
      break
    default:
      errorMessage.body = 'Errore !'
      break
  }

  return errorMessage
}

export { getErrorMessage }
