const groupedFormatter = new Intl.NumberFormat('en-US', {
  useGrouping: true,
})

const fixedFormatter = new Intl.NumberFormat('en-US', {
  minFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 2,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const SUFFIXES = 'KMBTqQsSOND'

export const toSuffixed = num => {
  if (num === null) return num
  if (num === 0) return num

  const power = Math.floor(Math.log10(num))
  const index = Math.floor(power / 3)
  num = parseFloat((num / Math.pow(10, index * 3)).toFixed(2))
  return num + (SUFFIXES[index - 1] || '')
}

const format = (number, formatter) => {
  if (isNaN(number)) return null
  return formatter.format(number)
}

export const toGrouped = number => format(number, groupedFormatter)
export const toFixed = number => format(number, fixedFormatter)
export const toPercent = number => format(number, percentFormatter)
export const toCurrency = number => format(number, currencyFormatter)
