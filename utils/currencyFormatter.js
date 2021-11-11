function currencyFormatter(currency) {
  try {
    if (currency === '') return ''

    if (currency === undefined || currency === null) currency = 0
    var stringCurrency = currency.toFixed(2)
    stringCurrency = stringCurrency.replace('.', ',')
    return stringCurrency
  } catch (err) {
    console.log('currencyFormatterErr: ', err)
    return currency.replace('.', ',')
  }
}

export default currencyFormatter
