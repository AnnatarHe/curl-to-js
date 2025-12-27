import { describe, expect, test } from 'vitest'
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
  {
    name: 'real complex curl command',
    input: `
    curl --request POST \
  --url https://prompt-pal.annatarhe.com/api/v1/public/prompts/run/PQDE7LRNqgkl/stream \
  --header 'Content-Type: application/json' \
  --header 'accept: */*' \
  --header 'accept-language: en,zh;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7' \
  --header 'authorization: API 9184b65aecb845a5a0cde15b9a5aaba1' \
  --header 'cache-control: no-cache' \
  --header 'origin: http://localhost:3000' \
  --header 'pragma: no-cache' \
  --header 'priority: u=1, i' \
  --header 'referer: http://localhost:3000/' \
  --header 'sec-ch-ua: "Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"' \
  --header 'sec-ch-ua-mobile: ?0' \
  --header 'sec-ch-ua-platform: "macOS"' \
  --header 'sec-fetch-dest: empty' \
  --header 'sec-fetch-mode: cors' \
  --header 'sec-fetch-site: cross-site' \
  --header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' \
  --data '{"hello": "world"}'
    `,
    expected: {
      method: 'POST',
      url: new URL(
        'https://prompt-pal.annatarhe.com/api/v1/public/prompts/run/PQDE7LRNqgkl/stream',
      ),
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'en,zh;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7',
        'cache-control': 'no-cache',
        'sec-ch-ua':
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        accept: '*/*',
        authorization: 'API 9184b65aecb845a5a0cde15b9a5aaba1',
        origin: 'http',
        pragma: 'no-cache',
        priority: 'u=1, i',
        referer: 'http',
      },
      formData: {},
      params: {},
      body: {
        'hello': 'world',
      },
    },
  },
  {
    name: 'data-raw',
    input:
      `curl --location -g --request POST 'https://open.feishu.cn/open-apis/user/v8/API_FIRE' -H 'x-tt-logid: 20241216111023F39A80E09F49246CA826' -H 'Content-Type: application/json' -H 'Authorization: Bearer I_DO_NOT_WANT_TO_WORK'  --data-raw '{"email":"annatar.he@gmail.com"}' --compressed`,
    expected: {
      method: 'POST',
      url: new URL('https://open.feishu.cn/open-apis/user/v8/API_FIRE'),
      headers: {
        'x-tt-logid': '20241216111023F39A80E09F49246CA826',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer I_DO_NOT_WANT_TO_WORK',
      },
      formData: {},
      params: {},
      body: {
        'email': 'annatar.he@gmail.com',
      },
    },
  },
  {
    name: 'with pipe',
    input:
      `curl -X GET "https://api.example.com/data" --data-raw '{"author": "AnnatarHe"}' | jq .`,
    expected: {
      method: 'GET',
      url: new URL('https://api.example.com/data'),
      headers: {},
      formData: {},
      params: {},
      body: {
        'author': 'AnnatarHe',
      },
    },
  },
  {
    name: 'with pipe and bash command',
    input:
      `curl -sSL https://raw.githubusercontent.com/malamtime/installation/master/install.bash | bash`,
    expected: {
      method: 'GET',
      url: new URL(
        'https://raw.githubusercontent.com/malamtime/installation/master/install.bash',
      ),
      headers: {},
      formData: {},
      params: {},
      body: null,
    },
  },
]

describe('parse', () => {
  testCases.forEach(({ name, input, expected }) => {
    test(`should parse ${name}`, () => {
      const cmd = input.replaceAll(/[\n\t]/g, '')
      const result = parse(cmd)
      expect(result).toEqual(expected)
    })
  })

  test('should throw error for invalid curl command', () => {
    expect(() => {
      parse('invalid command')
    }).toThrow('not a curl command')
  })
})
