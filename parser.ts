import { parseArgs } from './args.ts'

type ParsedCommand<T = unknown> = {
  method: string
  url?: URL
  headers: Record<string, string>
  params: Record<string, string>
  formData: Record<string, string>
  body: T | string | null
}

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

  for (const key in parsed.options) {
    const val = parsed.options[key]
    if (key === 'H') {
      const pairs = Array.isArray(val) ? val : [val]
      for (const pair of pairs) {
        const [header, value] = pair.split(':').map((s) => s.trim())
        result.headers[header] = value
      }
    }

    if (key === 'X') {
      result.method = val as string
    }

    if (key === 'F') {
      const pairs = Array.isArray(val) ? val : [val]
      for (const pair of pairs) {
        const [k, value] = pair.split('=').map((s) => s.trim())
        result.formData[k] = value
      }
    }
    if (key === 'd' || key === 'D') {
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
