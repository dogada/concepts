import { useReducer, useEffect, Reducer } from 'react'
import { Action as ApiAction, FirstArg, Unpromisify } from '../types'
import { parseError } from '../../utils'

export type ResultHandler = (payload: any, state: any) => any

enum Kind {
  Query,
  Success,
  Failure,
  Reset
}

type Action<A extends ApiAction> =
  | { type: Kind.Query; payload: FirstArg<A> }
  | { type: Kind.Success; payload: Unpromisify<ReturnType<A>> }
  | { type: Kind.Failure; payload: string }
  | { type: Kind.Reset; payload: Initial<A> }

export type Query<A extends ApiAction> = FirstArg<A>

export type Initial<A extends ApiAction> = {
  query?: Query<A>
  data?: Unpromisify<ReturnType<A>>
}

type State<A extends ApiAction> = Initial<A> & {
  loading: boolean
  error?: any
  initial?: Initial<A>
}

const fetchReducer =
  <A extends ApiAction>(): Reducer<State<A>, Action<A>> =>
  (state, action): State<A> => {
    switch (action.type) {
      case Kind.Query:
        return {
          ...state,
          loading: true,
          error: null,
          query: action.payload
        }
      case Kind.Success:
        return {
          ...state,
          loading: false,
          error: null,
          data: action.payload
        }
      case Kind.Failure:
        return {
          ...state,
          loading: false,
          error: action.payload
        }
      case Kind.Reset:
        return initState(action.payload)
      default:
        throw new Error()
    }
  }

export function mergeItems(payload, state) {
  // console.log('merge', payload, state)
  return state.query.cursor
    ? {
        ...payload,
        items: [...state?.data.items, ...payload.items]
      }
    : payload
}

const replaceItems: ResultHandler = (payload) => payload

type setQuery<A> = (query: FirstArg<A>) => void

function initState<A extends ApiAction>(initial: Initial<A>): State<A> {
  return {
    ...initial,
    loading: Boolean(initial.query && !initial.data),
    error: null,
    initial
  }
}

// TODO: add opts = {loadingTimeout=0} and dispatch loading after timeout
type Opts = {
  resultHandler?: ResultHandler
  watch?: boolean
}

/**
 *
 * @param endpoint async function to load data
 * @param initial initial query and data (can be used to populate server side results)
 * @param opts use {watch: true} if useApi should reload data if 'initial' change (Next.Js page changed url)
 *
 * If using {watch: true} ensure that `initial` isn't changed on each render or useApi will try lo load data on each render
 * Receive initial from Next.js getInitialProps or cache it with React.useMemo ti ensure that it changes
 * only when the page is need to be reloaded
 */
function useApi<A extends ApiAction>(
  endpoint: A,
  initial: Initial<A> = {},
  opts: Opts = { watch: false }
): [State<A>, setQuery<A>] {
  const resultHandler = opts.resultHandler || replaceItems
  const [state, dispatch] = useReducer(fetchReducer<A>(), initial, initState)

  // TODO: remove initialQuery monitoring and fire setQuery() manually for NextJs?
  useEffect(() => {
    // already mounted component received from parent new props
    // for example after url change for NextJs page with getInitialProps
    if (opts.watch && state.initial !== initial) {
      dispatch({
        type: Kind.Reset,
        payload: initial
      })
    }
  }, [opts.watch && initial])

  useEffect(() => {
    // eslint-disable-next-line fp/no-let
    let cancelled = false
    const query = state.query // query may be changed during API request
    const fetchData = async () => {
      try {
        const data = await endpoint(query)
        if (!cancelled && query === state.query) {
          dispatch({
            type: Kind.Success,
            payload: resultHandler(data, state)
          })
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error('useApi error:', new Error().stack)
          dispatch({
            type: Kind.Failure,
            payload: parseError(error).message
          })
        }
      }
    }
    if (state.loading) {
      fetchData()
    }
    return () => {
      cancelled = true
    }
  }, [state.query])

  const setQuery: setQuery<A> = (query) =>
    dispatch({ type: Kind.Query, payload: query })
  return [state, setQuery]
}

export default useApi
