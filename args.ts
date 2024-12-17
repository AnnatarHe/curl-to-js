import * as shellwords from 'npm:shellwords'

type ParsedArgs = {
  main: string
  options: Record<string, string | string[]>
  args: string[]
}

export function parseArgs(rawArgs: string): ParsedArgs {
  const args = shellwords.split(rawArgs)
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
