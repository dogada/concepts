import { makeClient } from './client'
import jsonRPC from './decorators/jsonRPC'
import fetchJson from './decorators/fetchJson'
import { ActionProducer } from './types'

import fetch, { MockResponseInitFunction } from 'jest-fetch-mock'

const jsonResponse =
  (data: any): MockResponseInitFunction =>
  async (_) => {
    return {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

describe('Dummy', () => {
  it('Check that 2+2=4', () => {
    makeClient({}, [])
    expect(2 + 2).toEqual(4)
  })
})

describe('makeClient', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('Create client with 2 producers', async () => {
    const pong = (data, _) => {
      return { cmd: 'pong', data }
    }
    const _fetch = jest.fn(pong)
    const m1: ActionProducer =
      ({ id }, next) =>
      async ({ cmd }, opts) =>
        next && next({ url: `http://${id}`, cmd }, opts)
    const m2: ActionProducer = () => async (data, opts) => _fetch(data, opts)
    type Api = { echo: (data: object) => Promise<object> }
    const client = makeClient<Api>({ echo: {} }, [m1, m2])
    const result = await client.echo({ cmd: 'ping' })
    expect(_fetch.mock.calls.length).toBe(1)
    expect(_fetch.mock.calls[0][0]).toEqual({ cmd: 'ping', url: 'http://echo' })
    expect(_fetch.mock.calls[0][1]).toEqual(undefined)
    expect(result).toEqual({
      cmd: 'pong',
      data: { cmd: 'ping', url: 'http://echo' }
    })
  })

  it('Create json RPC client', async () => {
    const errorHandler = (e: Error) => console.error(e)
    fetch.once(jsonResponse({ cmd: 'pong' }))
    const m1 = jsonRPC({ base: 'http://localhost/api/v1' })
    const m2 = fetchJson({ fetch, errorHandler })
    type Api = { ping: (cmd?: string) => Promise<object> }
    const client = makeClient<Api>({ ping: {} }, [m1, m2])
    const result = await client.ping('test')
    expect(result).toEqual({ cmd: 'pong' })
    expect(fetch.mock.calls[0][0]).toEqual(
      'http://localhost/api/v1/ping?q=%22test%22'
    )
  })
})
