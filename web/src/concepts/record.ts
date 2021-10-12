import slugify from 'slugify'
const MAX_SLUG_LENGTH = 20

// const hashCode = function (str: string) {
//   return Math.abs(hash.hashCode(str))
// }

function trimToLastSpace(str: string): string {
  const lastSpace = str.lastIndexOf(' ')
  return lastSpace > str.length / 2 ? str.slice(0, lastSpace) : str
}

export const makeSlug = function (str: string): string {
  return slugify(
    str.length > MAX_SLUG_LENGTH
      ? trimToLastSpace(str.slice(0, MAX_SLUG_LENGTH))
      : str,
    { lower: true }
  )
}
