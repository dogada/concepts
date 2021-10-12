/*
  Resolve props independently on client, so we will not need to wait for the slowest promise like 
  with default getInitialProps or getServerSide props implementation.
  Allows to resolve important properties before first render and rest of properties in parallel after 
  first page render. The aim is to show page as fast as possible (i.e. faster than default getServerSide approach)
 */
import React from 'react'

export type PromisifyValues<T> = { [K in keyof T]: Promise<T[K]> }

function isPromise<T>(v: unknown): v is Promise<T> {
  return typeof (v as Promise<T>)?.then === 'function'
}

function useProp<T>(prop: T | Promise<T>): [value?: T, error?: Error] {
  const [value, setValue] = React.useState<T | undefined>()
  const [error, setError] = React.useState<Error>()
  console.log('useProp', prop, value)
  React.useEffect(() => {
    // eslint-disable-next-line fp/no-let
    let isMounted = true
    if (isPromise(prop)) {
      prop
        .then((value) => isMounted && setValue(value))
        .catch((e: Error) => isMounted && setError(e))
    }
    return () => {
      isMounted = false
    }
  }, [prop])

  return [value, error]
}

export function getProp<T>(prop: T | Promise<T>): [value?: T, error?: Error] {
  const hookState = useProp(prop) // we need to call hook always even if prop isn't a promise
  // if prop isn't a promise return it directly to avoid unnecessary re-renders from setState in the hook
  return isPromise(prop) ? hookState : [prop]
}

// TODO: add support for mixed promises and normal values
export async function resolvePromises<P, BP>(promises: BP): Promise<P> {
  const entries = Object.entries(promises)
  const resolved = await Promise.all(entries.map((e) => e[1]))
  return entries.reduce(
    (acc, [key], index) => ({
      ...acc,
      [key]: resolved[index]
    }),
    {}
  ) as Promise<P>
}

/**
 Wait for all promises on server and render immediately on client.
 */
export async function processPageProps<P, BP>(
  propsPromise: Promise<BP>
): Promise<P | BP> {
  const props = await propsPromise
  return typeof window === 'undefined' ? resolvePromises<P, BP>(props) : props
}
