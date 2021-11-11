function getSlicedNumber(number) {
  const [integerPart, separator, decimalPart] = number
    .toString()
    .split(/(\.|,)/)

  const integerDigits = []
  const decimalDigits = []

  for (let i = 0; i < integerPart.length; i++)
    integerDigits.push(integerPart.charAt(i))

  const [
    units,
    decines,
    hundreds,
    thousands,
    tensOfThousands,
    hundredsOfThousands,
    millions
  ] = integerDigits.reverse()

  if (typeof decimalPart !== 'undefined')
    for (let i = 0; i < decimalPart.length; i++)
      decimalDigits.push(decimalPart.charAt(i))
  else {
    decimalDigits.push(undefined)
    decimalDigits.push(undefined)
  }

  const [decimal, centesimal] = decimalDigits

  return {
    millions,
    hundredsOfThousands,
    tensOfThousands,
    thousands,
    hundreds,
    decines,
    units,
    decimal,
    centesimal
  }
}

export default getSlicedNumber
