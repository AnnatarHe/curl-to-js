import { split } from './shellwords'

/**
 * Type for parsed command line arguments.
 */
type ParsedArgs = {
  main: string
  options: Record<string, string | string[]>
  args: string[]
}

/**
 * Parses command line arguments into a structured object.
 *
 * @param rawArgs The raw command line arguments.
 * @returns An object containing the main command, options, and arguments.
 */
export function parseArgs(rawArgs: string): ParsedArgs {
  const args = split(rawArgs)
  const result: ParsedArgs = {
    main: '',
    options: {},
    args: [],
  }

  let i = 0
  while (i < args.length) {
    const arg = args[i]
    if (i === 0) {
      result.main = arg
      i++
      continue
    }

    // not able to parse. just push to args
    if (!arg.startsWith('-')) {
      result.args.push(arg)
      i++
      continue
    }

    const key = arg.slice(arg.lastIndexOf('-') + 1)
    const val = args[i + 1]

    const prevValue = result.options[key]
    if (prevValue) {
      if (Array.isArray(prevValue)) {
        result.options[key] = [...prevValue, val]
      } else {
        result.options[key] = [prevValue, val]
      }
    } else {
      result.options[key] = val
    }

    i += 2
  }
  return result
}
