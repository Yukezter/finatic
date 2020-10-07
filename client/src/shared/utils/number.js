const SUFFIXES = 'KMBTqQsSOND'

export const getSuffixedNumber = num => {
  const power = Math.floor(Math.log10(num))
  const index = Math.floor(power / 3)
  num = parseFloat((num / Math.pow(10, index * 3)).toFixed(2))
  return num + (SUFFIXES[index - 1] || '')
}

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

export const grouped = number => groupedFormatter.format(number)
export const fixed = number => fixedFormatter.format(number)
export const percent = number => percentFormatter.format(number)
export const currency = number => currencyFormatter.format(number)
