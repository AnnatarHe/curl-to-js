# @AnnatarHe/curl-to-js [![codecov](https://codecov.io/gh/AnnatarHe/curl-to-js/graph/badge.svg?token=V2IBNU8PDH)](https://codecov.io/gh/AnnatarHe/curl-to-js)

[https://www.npmjs.com/package/@annatarhe/curl-to-js](https://www.npmjs.com/package/@annatarhe/curl-to-js)

A lightweight library that converts curl commands to JavaScript objects. Perfect for developers who want to transform curl commands into structured data for API testing, documentation, or code generation.

## Features

- 🚀 Converts curl commands to structured JavaScript objects
- 📦 Supports common curl options (-X, -H, -d, -F)
- 🔍 Parses URLs with query parameters
- 💪 Type-safe with TypeScript support
- 🧩 Handles JSON payloads automatically
- 📝 Supports form data

## Installation

```bash
npm install @annatarhe/curl-to-js
```

## Usage

```typescript
import { parse } from "@annatarhe/curl-to-js"

// Basic GET request
const result = parse('curl https://api.example.com/data')
// {
//   method: 'GET',
//   url: URL { href: 'https://api.example.com/data' },
//   headers: {},
//   params: {},
//   formData: {},
//   body: null
// }

// POST request with headers and JSON body
const result = parse(`
  curl -X POST https://api.example.com/data \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer token123" \
    -d '{"name": "John", "age": 30}'
`)
// {
//   method: 'POST',
//   url: URL { href: 'https://api.example.com/data' },
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer token123'
//   },
//   body: {
//     name: 'John',
//     age: 30
//   },
//   params: {},
//   formData: {}
// }
```

## Supported Curl Options

- `-X, --request`: HTTP method
- `-H, --header`: HTTP headers
- `-d, --data`: Request body (supports JSON)
- `-F, --form`: Form data
- URL parameters are automatically parsed

## Type Definition

```typescript
type ParsedCommand<T = unknown> = {
  method: string
  url?: URL
  headers: Record<string, string>
  params: Record<string, string>
  formData: Record<string, string>
  body: T | string | null
}
```

## Examples

### Form Data Upload
```typescript
const result = parse(`
  curl -X POST https://api.example.com/upload \
    -F "file=@photo.jpg" \
    -F "description=Profile photo"
`)
```

### Query Parameters
```typescript
const result = parse('curl "https://api.example.com/search?q=test&page=1"')
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
