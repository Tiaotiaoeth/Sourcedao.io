import moment from 'moment'

export const truncateMiddle = (
  str: string | undefined,
  frontLen = 4,
  backLen = 4,
  truncateStr = '…'
): string => {
  if (str === undefined) {
    return ''
  }

  const strLen = str.length
  if (
    (frontLen === 0 && backLen === 0) ||
    frontLen >= strLen ||
    backLen >= strLen ||
    frontLen + backLen >= strLen
  ) {
    return str
  } else if (backLen === 0) {
    return str.slice(0, frontLen) + truncateStr
  } else {
    return str.slice(0, frontLen) + truncateStr + str.slice(strLen - backLen)
  }
}

export const randomID = (n = 18, radix = 36): string => {
  const idString = (
    Number(Math.random() * Math.pow(10, n)) + Date.now()
  ).toString(radix)
  return idString
}

export const randomExamId = (): string => {
  const random = randomID()
  return new Date().getTime() + random
}

export const dateTimeConversion = (
  value: string | number,
  type = 'YYYY-MM-DD'
): string => {
  if (typeof value === 'string') value = parseInt(value)
  if (!value) return ''
  if (value.toString().length === 10) value *= 1000
  return moment(value).format(type)
}

export const scoreGrade = (score: number): string => {
  if (!score) return 'Fail'
  return score > 59
    ? score > 69
      ? score > 79
        ? score > 89
          ? 'High Distinction'
          : 'Distinction'
        : 'Credit'
      : 'Pass'
    : 'Fail'
}

export const dataURLtoFile = (dataURI: string, type = 'image/png'): File => {
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  const blob = new Blob([new Uint8Array(array)], { type })
  return new File([blob], new Date() + '.png')
}
