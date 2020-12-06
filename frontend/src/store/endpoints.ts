import axios from 'axios'

export enum ENDPOINTS {
  MOCK_ENDPOINT = 'this/is/fake/endpoint',
}

async function makeRequest(
  url: string,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: Record<string, unknown> = {},
  requestBody: Record<string, unknown> = {},
) {
  const DOMAIN = 'localhost:3000'
  return axios({
    method,
    url: DOMAIN + url,
    headers: {
      ...additionalHeaders,
    },
    data: requestBody,
    withCredentials: true,
    validateStatus: (status) => {
      if (status >= 200 && status < 400) {
        return true
      } else {
        return false
      }
    },
  }).then((response) => response.data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponsePromise = Promise<any>

export function get(endpoint: ENDPOINTS, subRoute = ''): ResponsePromise {
  return makeRequest(endpoint + subRoute, 'get')
}

export function post(
  endpoint: ENDPOINTS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, 'post', additionalHeaders, requestBody)
}

export function del(
  endpoint: ENDPOINTS,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, 'delete', additionalHeaders)
}

export function put(
  endpoint: ENDPOINTS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, 'put', additionalHeaders, requestBody)
}
