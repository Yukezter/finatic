export const fix = Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const group = new Intl.NumberFormat('en-US', {
  useGrouping: true,
}).format

export const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const abbreviate = (value: number): string => {
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  const index = Math.floor(String(value).length / 3)
  const newValue = parseFloat(
    (index !== 0 ? value / 1000 ** index : value).toPrecision(3)
  )

  return newValue + abbreviations[index]
}
