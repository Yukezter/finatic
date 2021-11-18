export const mergeArrays = <T, P>(arr1: T[], arr2: P[]): (T & P)[] => {
  return Array.from(new Array(Math.min(arr1.length, arr2.length)), (_, index) => {
    return {
      ...arr1[index],
      ...arr2[index],
    }
  })
}

export const yyyymmdd = (date: Date, separator = ''): string => {
  const yyyy = date.getFullYear()
  let mm: number | string = date.getMonth() + 1
  mm = (mm > 9 ? '' : '0') + mm
  let dd: number | string = date.getDate()
  dd = (dd > 9 ? '' : '0') + dd
  return `${yyyy}${separator}${mm}${separator}${dd}`
}
