import { parseArgs } from './args.ts'

type ParsedCommand<T = unknown> = {
  method: string
  url: string
  headers: Record<string, string>
  params: Record<string, string>
  formData: Record<string, string>
  body: T | string | null
}

export function parse<T = unknown>(command: string): ParsedCommand<T> {
  const result: ParsedCommand<T> = {
    method: '',
    url: '',
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
      result.url = val
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
  }

  if (!result.method) {
    result.method = 'GET'
  }

  return result
}
