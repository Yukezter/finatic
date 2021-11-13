export const mergeArrays = <T, P>(arr1: T[], arr2: P[]): (T & P)[] => {
  return Array.from(new Array(Math.min(arr1.length, arr2.length)), (_, index) => {
    return {
      ...arr1[index],
      ...arr2[index],
    }
  })
}
