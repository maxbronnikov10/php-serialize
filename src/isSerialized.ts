/**
 * Check value to find if it was serialized.
 * @param { string } item - Value to check to see if was serialized.
 * @param { boolean } strict - Whether to be strict about the end of the string. Default value: false
 */
export default function isSerialized(givenItem: string, strict = false) {
  if (typeof givenItem !== 'string') {
    return false
  }
  const item = givenItem.replace(/^(\s*)|(\s*)$/g, '')
  if (item === 'N;') {
    return true
  }
  if (item.length < 4) {
    return false
  }
  if (item[1] !== ':') {
    return false
  }

  if (strict) {
    const lastc = item.slice(-1)

    if (lastc !== ';' && lastc !== '}') {
      return false
    }
  } else {
    const semicolon = item.indexOf(';')
    const brace = item.indexOf('}')

    // Either ; or } must exist.
    if (semicolon === -1 && brace === -1) {
      return false
    }
    // But neither must be in the first X characters.
    if (semicolon !== -1 && semicolon < 3) {
      return false
    }
    if (brace !== -1 && brace < 4) {
      return false
    }
  }

  const token = item.slice(0, 1)
  const end = strict ? '$' : ''

  switch (token) {
    case 's':
      if (strict) {
        if (item.substr(-2, 1) !== '"') {
          return false
        }
      } else if (item.indexOf('"') === -1) {
        return false
      }
      break

    // or else fall through

    case 'a':
    case 'O':
      return item.match(new RegExp(`^${token}:[0-9]+:`, 's')) !== null

    case 'b':
    case 'i':
    case 'd':
      return item.match(new RegExp(`^${token}:[0-9.E+-]+;${end}`)) !== null

    default:
  }

  return false
}
