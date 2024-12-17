import { expect } from 'jsr:@std/expect'
import { parse } from './parser.ts'

const testCases = [
  {
    name: 'basic curl command with URL',
    input: 'curl https://api.example.com/data',
    expected: {
      method: 'GET',
      url: new URL('https://api.example.com/data'),
      headers: {},
      params: {},
      formData: {},
      body: null,
    },
  },
  {
    name: 'curl command with method and headers',
    input: 'curl -X POST https://api.example.com/data \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer token123"',
    expected: {
      method: 'POST',
      url: new URL('https://api.example.com/data'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
      },
      formData: {},
      params: {},
      body: null,
    },
  },
  {
    name: 'curl command with JSON body',
    input: 'curl -X POST https://api.example.com/data \
      -H "Content-Type: application/json" \
      -d \'{"name": "John", "age": 30}\'',
    expected: {
      method: 'POST',
      url: new URL('https://api.example.com/data'),
      headers: {
        'Content-Type': 'application/json',
      },
      params: {},
      formData: {},
      body: {
        name: 'John',
        age: 30,
      },
    },
  },
  {
    name: 'curl command with query parameters',
    input: 'curl "https://api.example.com/search?q=test&page=1"',
    expected: {
      method: 'GET',
      url: new URL('https://api.example.com/search?q=test&page=1'),
      headers: {},
      params: {},
      formData: {},
      body: null,
    },
  },
  {
    name: 'curl command with form data',
    input: 'curl -X POST https://api.example.com/form \
        -F "file=@photo.jpg" \
        -F "description=Profile photo"',
    expected: {
      method: 'POST',
      url: new URL('https://api.example.com/form'),
      headers: {},
      params: {},
      formData: {
        file: '@photo.jpg',
        description: 'Profile photo',
      },
      body: null,
    },
  },
]

testCases.forEach(({ name, input, expected }) => {
  Deno.test(`should parse ${name}`, () => {
    const result = parse(input)
    expect(result).toEqual(expected)
  })
})

Deno.test('should throw error for invalid curl command', () => {
  expect(() => {
    parse('invalid command')
  }).toThrow('not a curl command')
})
