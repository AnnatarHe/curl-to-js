import { parseArgs } from './args.ts'

type ParsedCommand<T = unknown> = {
  method: string
  url?: URL
  headers: Record<string, string>
  params: Record<string, string>
  formData: Record<string, string>
  body: T | string | null
}

/**
 * Parses a curl command into a structured object.
 *
 * @param command The curl command to parse.
 * @returns An object containing the main command, options, and arguments.
 */
export function parse<T = unknown>(command: string): ParsedCommand<T> {
  const result: ParsedCommand<T> = {
    method: '',
    url: undefined,
    headers: {},
    params: {},
    formData: {},
    body: null,
  }
  const parsed = parseArgs(command)

  if (parsed.main.toLowerCase() !== 'curl') {
    throw new Error('not a curl command')
  }

  for (const val of parsed.args) {
    if (URL.canParse(val)) {
      result.url = new URL(val)
    }
  }
  // if url is not found in args, check options
  if (!result.url) {
    Object.values(parsed.options).forEach((val) => {
      if (typeof val === 'string' && URL.canParse(val)) {
        result.url = new URL(val)
      }
    })
  }

  for (const key in parsed.options) {
    const val = parsed.options[key]

    if (key === 'u' || key === 'url') {
      const url = (val as string).trim()
      if (url) {
        result.url = new URL(url)
      }
    }

    if (key === 'H' || key === 'header') {
      const pairs = Array.isArray(val) ? val : [val]
      for (const pair of pairs) {
        const [header, value] = pair.split(':').map((s) => s.trim())
        result.headers[header] = value
      }
    }

    if (key === 'X' || key === 'request') {
      result.method = val as string
    }

    if (key === 'F') {
      const pairs = Array.isArray(val) ? val : [val]
      for (const pair of pairs) {
        const [k, value] = pair.split('=').map((s) => s.trim())
        result.formData[k] = value
      }
    }
    if (
      key === 'd' || key === 'data' || key === 'data-raw' || key === 'raw'
    ) {
      const d = (val as string).trim()

      if (isJSONLike(d)) {
        try {
          result.body = JSON.parse(d) as T
        } catch {
          // TODO: maybe should throw an error?
          result.body = d
        }
      } else {
        result.body = d
      }
    }
  }

  if (!result.method) {
    result.method = 'GET'
  }

  return result
}

function isJSONLike(str: string): boolean {
  return (str.startsWith('{') || str.endsWith('}')) ||
    (str.startsWith('[') || str.endsWith(']'))
}
