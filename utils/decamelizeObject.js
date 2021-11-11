import decamelize from 'decamelize'

function decamelizeObject(object) {
  const decamelizedEntries = Object.entries(object).map(([key, value]) => {
    return [decamelize(key), value]
  })
  const decamelizedObject = Object.fromEntries(decamelizedEntries)

  return decamelizedObject
}

export default decamelizeObject
