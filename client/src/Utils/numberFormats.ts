const formatWithFallback =
  (formatter: (number: number) => string) =>
  (number: number, fallback?: string): any => {
    if (fallback !== undefined && typeof number !== 'number') {
      return fallback
    }

    return formatter(number)
  }

const fixFormat = Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const fix = formatWithFallback(fixFormat)

const groupFormat = new Intl.NumberFormat('en-US', {
  useGrouping: true,
}).format

export const group = formatWithFallback(groupFormat)

const percentFormat = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const percent = formatWithFallback(percentFormat)

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const currency = formatWithFallback(currencyFormat)

const abbreviateFormat = (value: number): string => {
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  const index = Math.floor(String(value).length / 3)
  const newValue = parseFloat((index !== 0 ? value / 1000 ** index : value).toPrecision(3))

  return newValue + abbreviations[index]
}

export const abbreviate = formatWithFallback(abbreviateFormat)
