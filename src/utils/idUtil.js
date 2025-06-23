let count = 1

export const getTimeStampId = () => {
  const id = Date.now() + getPrefixZeroNumber(count, 4)
  increaseCount()
  return id
}

const getPrefixZeroNumber = (num, length) => {
  let str = num.toString()
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

const increaseCount = () => {
  count++
  if (count > 9999) {
    count = 1
  }
}
